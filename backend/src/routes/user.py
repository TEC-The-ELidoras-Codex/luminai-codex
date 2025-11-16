"""
User profile and data management routes
Implements the User Data Anonymization Framework

Endpoints:
- POST /api/user/profile - Create or update user profile
- GET /api/user/profile/{user_id} - Get user profile
- POST /api/user/export - Export all user data (GDPR/CCPA)
- DELETE /api/user/delete - Delete user account (right to be forgotten)
- POST /api/session/start - Start new session
- POST /api/session/end - End session
- GET /api/session/{session_id} - Get session data
"""

from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from typing import Optional, List
from datetime import datetime, timedelta
import logging
import json
from pathlib import Path

from ..models.user import (
    UserProfile,
    SessionData,
    DemographicData,
    UserDataExport,
    UserDeletionRequest,
    ConsentStateSnapshot,
)

router = APIRouter(prefix="/api/user", tags=["user"])
logger = logging.getLogger(__name__)

# In-memory storage for demo (replace with PostgreSQL in production)
USERS_DB: dict[str, UserProfile] = {}
SESSIONS_DB: dict[str, SessionData] = {}


# ============================================================================
# USER PROFILE ENDPOINTS
# ============================================================================

@router.post("/profile", response_model=UserProfile)
async def create_or_update_profile(
    moniker: str,
    demographics: Optional[DemographicData] = None,
    data_retention: str = "minimal",
    consent_analytics: bool = False,
    user_id: Optional[str] = None,
):
    """
    Create new user profile or update existing one
    
    Args:
        moniker: User-chosen pseudonym (required)
        demographics: Optional age/region bands
        data_retention: "minimal" (7d), "standard" (30d), or "full" (forever)
        consent_analytics: Opt-in for aggregated analytics
        user_id: If updating existing profile
    
    Returns:
        UserProfile with generated user_id
    """
    try:
        if user_id and user_id in USERS_DB:
            # Update existing profile
            profile = USERS_DB[user_id]
            profile.moniker = moniker
            profile.last_active = datetime.utcnow()
            
            if demographics:
                profile.age_band = demographics.age_band
                profile.region_band = demographics.region_band
            
            profile.data_retention = data_retention  # type: ignore
            profile.consent_analytics = consent_analytics
            
            logger.info(f"Updated profile for {moniker} ({user_id})")
        else:
            # Create new profile
            profile = UserProfile(
                moniker=moniker,
                age_band=demographics.age_band if demographics else None,
                region_band=demographics.region_band if demographics else None,
                data_retention=data_retention,  # type: ignore
                consent_analytics=consent_analytics,
            )
            USERS_DB[profile.user_id] = profile
            logger.info(f"Created new profile for {moniker} ({profile.user_id})")
        
        return profile
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error creating profile: {e}")
        raise HTTPException(status_code=500, detail="Failed to create profile")


@router.get("/profile/{user_id}", response_model=UserProfile)
async def get_profile(user_id: str):
    """Get user profile by ID"""
    if user_id not in USERS_DB:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update last_active timestamp
    USERS_DB[user_id].last_active = datetime.utcnow()
    return USERS_DB[user_id]


# ============================================================================
# DATA EXPORT (GDPR/CCPA Compliance)
# ============================================================================

@router.post("/export", response_model=UserDataExport)
async def export_user_data(user_id: str):
    """
    Export all user data (GDPR Article 20 - Right to Data Portability)
    
    Returns:
        Complete data export including profile and all sessions
    """
    if user_id not in USERS_DB:
        raise HTTPException(status_code=404, detail="User not found")
    
    profile = USERS_DB[user_id]
    
    # Gather all sessions for this user
    user_sessions = [
        session for session in SESSIONS_DB.values()
        if session.user_id == user_id
    ]
    
    active_sessions = [s for s in user_sessions if not s.end_time]
    archived_sessions = [s for s in user_sessions if s.end_time]
    
    total_messages = sum(s.message_count for s in user_sessions)
    
    export = UserDataExport(
        user_profile=profile,
        active_sessions=active_sessions,
        archived_sessions=archived_sessions,
        total_message_count=total_messages,
    )
    
    logger.info(f"Exported data for user {user_id} ({profile.moniker})")
    return export


# ============================================================================
# DATA DELETION (Right to be Forgotten)
# ============================================================================

@router.delete("/delete")
async def delete_user_account(request: UserDeletionRequest, background_tasks: BackgroundTasks):
    """
    Delete user account and all associated data (GDPR Article 17)
    
    Args:
        request: Deletion request with confirmation token
    
    Returns:
        Confirmation message
    """
    if request.user_id not in USERS_DB:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Require explicit confirmation to prevent accidents
    if request.confirmation_token != "I_CONFIRM_DELETE":
        raise HTTPException(
            status_code=400,
            detail="Invalid confirmation token. Must be 'I_CONFIRM_DELETE'"
        )
    
    profile = USERS_DB[request.user_id]
    moniker = profile.moniker
    
    # Delete user profile
    del USERS_DB[request.user_id]
    
    # Delete sessions
    sessions_to_delete = [
        sid for sid, session in SESSIONS_DB.items()
        if session.user_id == request.user_id
        and (request.delete_all or not session.archived_by_user)
    ]
    
    for sid in sessions_to_delete:
        del SESSIONS_DB[sid]
    
    logger.info(
        f"Deleted user {request.user_id} ({moniker}) "
        f"and {len(sessions_to_delete)} sessions"
    )
    
    return {
        "status": "deleted",
        "user_id": request.user_id,
        "moniker": moniker,
        "sessions_deleted": len(sessions_to_delete),
        "deleted_at": datetime.utcnow().isoformat(),
    }


# ============================================================================
# SESSION MANAGEMENT
# ============================================================================

@router.post("/session/start", response_model=SessionData)
async def start_session(user_id: str):
    """Start a new session for user"""
    if user_id not in USERS_DB:
        raise HTTPException(status_code=404, detail="User not found")
    
    profile = USERS_DB[user_id]
    
    # Map retention policy to days
    retention_map = {"minimal": 7, "standard": 30, "full": 365 * 10}  # 10 years for "full"
    retention_days = retention_map.get(profile.data_retention, 7)
    
    session = SessionData(
        user_id=user_id,
        retention_days=retention_days,
    )
    
    SESSIONS_DB[session.session_id] = session
    
    # Update user's last_active
    profile.last_active = datetime.utcnow()
    
    logger.info(f"Started session {session.session_id} for {profile.moniker}")
    return session


@router.post("/session/end")
async def end_session(session_id: str, summary: Optional[str] = None):
    """End a session and mark it for retention/deletion"""
    if session_id not in SESSIONS_DB:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = SESSIONS_DB[session_id]
    session.end_time = datetime.utcnow()
    session.summary = summary
    
    logger.info(f"Ended session {session_id} ({session.message_count} messages)")
    
    return {
        "status": "ended",
        "session_id": session_id,
        "duration_minutes": (session.end_time - session.start_time).total_seconds() / 60,
        "message_count": session.message_count,
        "delete_after": (session.end_time + timedelta(days=session.retention_days)).isoformat(),
    }


@router.get("/session/{session_id}", response_model=SessionData)
async def get_session(session_id: str):
    """Get session data by ID"""
    if session_id not in SESSIONS_DB:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return SESSIONS_DB[session_id]


@router.post("/session/{session_id}/consent")
async def update_session_consent(session_id: str, consent: ConsentStateSnapshot):
    """Update consent state for a session"""
    if session_id not in SESSIONS_DB:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = SESSIONS_DB[session_id]
    session.consent_states.append(consent)
    
    return {"status": "updated", "consent_states": len(session.consent_states)}


# ============================================================================
# BACKGROUND CLEANUP JOBS
# ============================================================================

async def cleanup_expired_sessions():
    """
    Background job to delete expired sessions based on retention policy
    
    Should be run daily via cron or scheduler
    """
    now = datetime.utcnow()
    deleted = []
    
    for session_id, session in list(SESSIONS_DB.items()):
        if not session.end_time:
            continue  # Don't delete active sessions
        
        if session.archived_by_user:
            continue  # User wants to keep this
        
        expiry = session.end_time + timedelta(days=session.retention_days)
        
        if now > expiry:
            deleted.append(session_id)
            del SESSIONS_DB[session_id]
    
    logger.info(f"Cleanup: Deleted {len(deleted)} expired sessions")
    return {"deleted": len(deleted), "session_ids": deleted}


async def anonymize_inactive_users():
    """
    Background job to anonymize users who haven't been active
    
    Retention rules:
    - minimal: Delete after 90 days inactive
    - standard: Anonymize after 1 year inactive
    - full: Keep forever (user controls)
    """
    now = datetime.utcnow()
    anonymized = []
    deleted = []
    
    for user_id, profile in list(USERS_DB.items()):
        days_inactive = (now - profile.last_active).days
        
        if profile.data_retention == "minimal" and days_inactive > 90:
            deleted.append(user_id)
            del USERS_DB[user_id]
        
        elif profile.data_retention == "standard" and days_inactive > 365:
            # Anonymize but keep
            profile.moniker = f"Deleted_User_{user_id[:8]}"
            profile.age_band = None
            profile.region_band = None
            anonymized.append(user_id)
    
    logger.info(
        f"Anonymization: Deleted {len(deleted)} users, "
        f"anonymized {len(anonymized)} users"
    )
    
    return {
        "deleted": len(deleted),
        "anonymized": len(anonymized),
    }
