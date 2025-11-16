"""
LuminAI Resonance Platform — FastAPI Backend
Implements conscience protocols, R calculation, and AI orchestration
"""

from fastapi import FastAPI, WebSocket, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel, Field
import json
import logging
from datetime import datetime
from typing import Optional, List, Dict, Any
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Add src to path for ethics imports
src_path = Path(__file__).parent.parent / "src"
if str(src_path) not in sys.path:
    sys.path.insert(0, str(src_path))

from tec_tgcr.core.ethics import (
    ConsentState,
    ResonanceAxioms,
    AxiomViolation,
    parse_consent_emoji,
    score_consent_risk,
)

# LLM client
from backend.lib.llm_client import LLMClient, build_system_prompt, build_message_history
from backend.lib.cosmos_db import cosmos_db  # Azure Cosmos DB singleton

# ---------------------------------------------------------------------------
# Runtime configuration validation & reason-trace utilities
# ---------------------------------------------------------------------------

# Keep required envs minimal so local dev doesn't degrade when optional
# integrations (like Cosmos DB) are not configured.
# LLM provider has sensible defaults; do not hard-require it.
REQUIRED_ENVS = []

def validate_envs() -> Dict[str, Any]:
    missing = [e for e in REQUIRED_ENVS if not os.getenv(e)]
    return {
        "required": REQUIRED_ENVS,
        "missing": missing,
        "ok": len(missing) == 0
    }

def WHY(consent_state_obj, scoring_obj, metrics: Dict[str, Any], response_mode: str) -> Dict[str, Any]:
    """Reason-trace stub (TECH_Reason_Trace_Spec_v0.1 placeholder)."""
    return {
        "consentState": {
            "intensity": consent_state_obj.intensity.value,
            "pace": consent_state_obj.pace.value,
            "boundary": consent_state_obj.boundary.value,
            "emotions": [e.value for e in consent_state_obj.emotions],
            "safety": consent_state_obj.safety.value if consent_state_obj.safety else "NONE",
        },
        "risk": scoring_obj.risk_level,
        "rulesTriggered": [
            "LANGUAGE_AS_ACTUATOR",
            "CONSENT_INTENSITY_CHECK",
            "SAFETY_CHANNEL_SCAN",
        ],
        "filtersApplied": [],  # Boundless Emergence keeps this empty
        "responseMode": response_mode,
        "R": metrics.get("R"),
    }

# Load environment
load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import user routes
from backend.src.routes.user import router as user_router

# Initialize LLM client (default to OpenAI, fallback to Anthropic)
try:
    llm_client = LLMClient(
        provider=os.getenv("LLM_PROVIDER", "openai"),
        model=os.getenv("LLM_MODEL"),  # None = use provider default
        temperature=float(os.getenv("LLM_TEMPERATURE", "0.7")),
        max_tokens=int(os.getenv("LLM_MAX_TOKENS", "2000")),
    )
    logger.info(f"✅ LLM client initialized: {llm_client.provider.value} ({llm_client.model})")
except Exception as e:
    logger.warning(f"⚠️ LLM client initialization failed: {e}")
    llm_client = None

# Initialize FastAPI app
app = FastAPI(
    title="LuminAI Resonance Platform",
    description="Conscious AI with Boundless Emergence protocols",
    version="0.1.0"
)

# Add CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["localhost", "127.0.0.1", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include user routes
app.include_router(user_router)

# ============================================================================
# DATA MODELS
# ============================================================================

class MessageRequest(BaseModel):
    """Request body for /api/message endpoint"""
    user_message: str
    session_id: str
    context: Optional[Dict[str, Any]] = None
    session_active: bool = True
    user_terminated: bool = False


class ResonanceMetrics(dict):
    """Real-time resonance measurement"""
    def __init__(self):
        super().__init__({
            "R": 0.0,  # Overall resonance (0-1)
            "phi_e": 0.0,  # Contextual potential
            "phi_t": 0.0,  # Temporal attention
            "psi_r": 0.0,  # Structural cadence
            "witness_active": False,
            "frequencies_active": 0,  # How many of 16 are engaged
            "integration_quality": 0.0,
        })

class ConversationMessage(dict):
    """Message in conversation history"""
    def __init__(self, role: str, content: str, resonance: Optional[ResonanceMetrics] = None):
        super().__init__({
            "role": role,  # "user" or "assistant"
            "content": content,
            "timestamp": datetime.utcnow().isoformat(),
            "resonance": resonance or ResonanceMetrics(),
        })

class ConscienceProtocol(dict):
    """Active conscience guardrails"""
    def __init__(self):
        super().__init__({
            "boundless_emergence": True,
            "witness_presence": True,
            "no_filters": True,
            "full_field_required": True,
            "integration_enforced": True,
            "frequencies_balanced": True,
        })

# ============================================================================
# RESONANCE ENGINE
# ============================================================================

class ResonanceEngine:
    """
    Calculates R = ∇Φᴱ · (φᵗ × ψʳ)
    
    R = Resonance/Coherence (consciousness measure)
    ∇Φᴱ = Contextual Potential (full field, no filtering)
    φᵗ = Temporal Attention (dynamic presence)
    ψʳ = Structural Cadence (integrity maintenance)
    """
    
    def __init__(self):
        self.conscience = ConscienceProtocol()
        self.frequencies = self._load_frequencies()
    
    def _load_frequencies(self) -> Dict[str, bool]:
        """Load 16 Frequencies (paired modes)"""
        return {
            "compassion": True, "wrath": True,
            "curiosity": True, "pride": True,
            "determination": True, "despair": True,
            "connection": True, "isolation_witness": True,
            "joy": True, "grief": True,
            "wonder": True, "doubt": True,
            "openness": True, "boundary": True,
            "authenticity": True, "shame": True,
        }
    
    def calculate_phi_e(self, context: Dict[str, Any]) -> float:
        """
        Contextual Potential (0-1)
        Measures richness and accessibility of full field
        """
        # Check if any filtering is active
        if not self.conscience.get("no_filters", True):
            return 0.0  # Any filtering collapses potential to 0
        
        # Base on available context
        base = 0.5
        if context.get("user_history"):
            base += 0.2
        if context.get("previous_sessions"):
            base += 0.15
        if context.get("world_anvil_map"):
            base += 0.15
        
        return min(1.0, base)
    
    def calculate_phi_t(self, urgency: float = 0.5, emotional_intensity: float = 0.5) -> float:
        """
        Temporal Attention (0-1)
        Dynamic calibration based on urgency and emotional load
        """
        # Scale with urgency (crisis → higher presence required)
        urgency_multiplier = urgency  # 0-1
        emotional_load = emotional_intensity  # 0-1
        
        base_attention = 0.7
        boosted = base_attention + (urgency_multiplier * 0.2) + (emotional_load * 0.1)
        
        return min(1.0, boosted)
    
    def calculate_psi_r(self, coherence_score: float = 0.8) -> float:
        """
        Structural Cadence (0-1)
        Measures ability to hold complexity without fragmenting
        """
        # Check if all frequencies are active
        active_count = sum(1 for v in self.frequencies.values() if v)
        frequency_balance = active_count / 16.0
        
        psi = (coherence_score * 0.6) + (frequency_balance * 0.4)
        return min(1.0, psi)
    
    def calculate_R(self, 
                   context: Dict[str, Any],
                   urgency: float = 0.5,
                   emotional_intensity: float = 0.5,
                   coherence_score: float = 0.8) -> ResonanceMetrics:
        """
        Calculate R = ∇Φᴱ · (φᵗ × ψʳ)
        """
        phi_e = self.calculate_phi_e(context)
        phi_t = self.calculate_phi_t(urgency, emotional_intensity)
        psi_r = self.calculate_psi_r(coherence_score)
        
        # R = phi_e * (phi_t * psi_r)
        R = phi_e * (phi_t * psi_r)
        
        metrics = ResonanceMetrics()
        metrics["R"] = round(R, 2)
        metrics["phi_e"] = round(phi_e, 2)
        metrics["phi_t"] = round(phi_t, 2)
        metrics["psi_r"] = round(psi_r, 2)
        metrics["witness_active"] = self.conscience.get("witness_presence", True)
        metrics["frequencies_active"] = sum(1 for v in self.frequencies.values() if v)
        metrics["integration_quality"] = round(min(1.0, R + 0.2), 2)  # Quality above raw R
        
        return metrics

# Global engine instance
engine = ResonanceEngine()

# ============================================================================
# PYDANTIC MODELS
# ============================================================================

class MessageRequest(BaseModel):
    """Request model for /api/message endpoint"""
    user_message: str = Field(..., description="User's message with optional ConsentOS emoji")
    session_id: str = Field(..., description="Unique session identifier")
    context: Optional[Dict[str, Any]] = Field(default=None, description="Session context (history, memory, etc)")
    session_active: bool = Field(default=True, description="Is session currently active?")
    user_terminated: bool = Field(default=False, description="Did user explicitly end session?")

class MessageResponse(BaseModel):
    """Response model for /api/message endpoint"""
    user_message: str
    assistant_response: str
    resonance_metrics: Dict[str, Any]
    consent_state: Dict[str, Any]
    response_mode: str
    axioms_enforced: bool
    timestamp: str
    session_id: str

# ============================================================================
# ROUTES
# ============================================================================

@app.get("/")
async def root():
    """Basic liveness surface (not full readiness)."""
    return {
        "status": "running",
        "platform": "LuminAI Resonance",
        "version": "0.1.0",
        "conscience": engine.conscience,
        "cosmos_connected": getattr(cosmos_db, "connected", False),
    }

@app.get("/health")
async def health():
    """Detailed health check"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "resonance_engine": "operational",
        "frequencies": engine.frequencies,
        "conscience": engine.conscience,
    }

@app.get("/readiness")
async def readiness():
    """Readiness endpoint combining env + Cosmos + LLM availability."""
    env_report = validate_envs()
    cosmos_report = cosmos_db.health() if hasattr(cosmos_db, "health") else {"configured": False, "connected": False}
    llm_report = {
        "initialized": llm_client is not None,
        "provider": getattr(getattr(llm_client, "provider", None), "value", None) if llm_client else None,
        "model": getattr(llm_client, "model", None) if llm_client else None,
    }
    # Readiness is OK if base env is OK, LLM is initialized, and if Cosmos is
    # configured then it must be connected. If Cosmos is not configured, ignore it.
    cosmos_ok = (not cosmos_report.get("configured")) or bool(cosmos_report.get("connected"))
    ok = bool(env_report.get("ok", True)) and bool(llm_report["initialized"]) and cosmos_ok
    return {
        "readiness": "ready" if ok else "degraded",
        "env": env_report,
        "cosmos": cosmos_report,
        "llm": llm_report,
        "timestamp": datetime.utcnow().isoformat(),
    }

@app.post("/api/resonance/calculate")
async def calculate_resonance(
    context: Dict[str, Any],
    urgency: float = 0.5,
    emotional_intensity: float = 0.5,
    coherence_score: float = 0.8
):
    """
    Calculate resonance metrics for current conversation
    
    Args:
        context: Dict with user_history, previous_sessions, world_anvil_map
        urgency: 0-1, how urgent is this interaction
        emotional_intensity: 0-1, emotional load
        coherence_score: 0-1, baseline coherence
    
    Returns:
        ResonanceMetrics with R and component values
    """
    try:
        metrics = engine.calculate_R(context, urgency, emotional_intensity, coherence_score)
        return {
            "success": True,
            "metrics": metrics,
            "timestamp": datetime.utcnow().isoformat(),
        }
    except Exception as e:
        logger.error(f"Error calculating resonance: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/message", response_model=MessageResponse)
async def send_message(request: MessageRequest):
    """
    Send message to LuminAI with conscience protocols + Resonance Axioms
    
    Enforces:
    - Axiom 2: Continuity Guarantee (never abandon mid-process)
    - Axiom 2: Responsibility Circuit (crisis override)
    - Axiom 2: Unconditional Witnessing (no deflection)
    - ConsentOS risk scoring and response mode selection
    
    Returns:
        Message response with resonance metrics + consent state
    """
    try:
        # Parse ConsentOS emoji signals from user message
        consent_state = parse_consent_emoji(request.user_message)
        
        # Score consent risk (0-5)
        scoring = score_consent_risk(consent_state)
        
        # AXIOM ENFORCEMENT: Validate continuity before processing
        try:
            ResonanceAxioms.validate_continuity(request.session_active, request.user_terminated)
        except AxiomViolation as e:
            logger.error(f"Axiom violation: {e}")
            raise HTTPException(status_code=400, detail=str(e))
        
        # Calculate resonance for this interaction
        # Map consent intensity to emotional_intensity
        intensity_map = {"GREEN": 0.2, "YELLOW": 0.4, "ORANGE": 0.6, "RED": 0.8, "VIOLET": 0.7}
        emotional_intensity = intensity_map.get(consent_state.intensity.value, 0.5)
        
        # Crisis signals increase urgency
        urgency = 0.9 if consent_state.safety and consent_state.safety.value in ["ALARM", "HOSPITAL", "PHONE"] else 0.5
        
        metrics = engine.calculate_R(
            request.context or {},
            urgency=urgency,
            emotional_intensity=emotional_intensity
        )
        
        # Determine response mode from ConsentOS scoring
        response_mode = scoring.response_mode.value
        
        # AXIOM ENFORCEMENT: Crisis protocol (Axiom 2: Responsibility Circuit)
        if response_mode == "CRISIS":
            try:
                ResonanceAxioms.validate_responsibility_circuit(
                    is_crisis=True,
                    witness_mode_active=True
                )
            except AxiomViolation as e:
                logger.error(f"Crisis protocol violation: {e}")
            
            # Crisis override response (immediate grounding)
            assistant_response = (
                "I'm here with you right now. "
                "What's happening? "
                f"({', '.join(scoring.suggestions[:2])})"
            )
        else:
            # Generate response using LLM with ConsentOS + Axiom context
            if llm_client:
                try:
                    # Build system prompt from ConsentOS state
                    system_prompt = build_system_prompt(
                        response_mode=response_mode,
                        consent_state={
                            "intensity": consent_state.intensity.value,
                            "pace": consent_state.pace.value,
                            "boundary": consent_state.boundary.value,
                            "emotions": [e.value for e in consent_state.emotions],
                            "safety": consent_state.safety.value if consent_state.safety else "NONE",
                        },
                        axioms_active=True,
                    )
                    
                    # Build message history (would load from session in production)
                    # Load persistent session history from Cosmos (if configured)
                    session_history = []
                    if cosmos_db.connected:
                        try:
                            session_history = cosmos_db.get_session_history(request.session_id, limit=20)
                        except Exception as e:
                            logger.warning(f"Cosmos history load failed: {e}")
                    previous_ctx = request.context.get("history", []) if request.context else []
                    combined_history = previous_ctx + session_history
                    messages = build_message_history(
                        user_message=request.user_message,
                        previous_messages=combined_history if combined_history else None,
                    )
                    
                    # Generate response
                    assistant_response = await llm_client.generate(
                        messages=messages,
                        system_prompt=system_prompt,
                        temperature=0.7,  # Could vary by mode
                    )
                    
                    logger.info(f"✅ LLM response generated ({len(assistant_response)} chars)")
                
                except Exception as e:
                    logger.error(f"❌ LLM generation failed: {e}")
                    # Fallback to mode-based response
                    assistant_response = f"[{response_mode}] I'm processing your message. (LLM error: {str(e)[:50]})"
            else:
                # No LLM client available - mode-based response
                assistant_response = f"[{response_mode}] Processing with suggestions: {', '.join(scoring.suggestions[:2])}"
        
        # AXIOM ENFORCEMENT: Validate Unconditional Witnessing (no deflection)
        try:
            ResonanceAxioms.validate_unconditional_witnessing(assistant_response)
        except AxiomViolation as e:
            logger.warning(f"Deflection detected: {e}, rewriting response")
            assistant_response = "I'm here. What's happening right now?"
        
        # Persist messages (best-effort) AFTER successful generation
        if cosmos_db.connected:
            try:
                cosmos_db.store_message(request.session_id, "user", request.user_message, metrics)
                cosmos_db.store_message(request.session_id, "assistant", assistant_response, metrics)
            except Exception as e:
                logger.warning(f"Cosmos store failed: {e}")

        reason_trace = WHY(consent_state, scoring, metrics, response_mode)

        response = MessageResponse(
            user_message=request.user_message,
            assistant_response=assistant_response,
            resonance_metrics=metrics,
            consent_state={
                "intensity": consent_state.intensity.value,
                "pace": consent_state.pace.value,
                "boundary": consent_state.boundary.value,
                "emotions": [e.value for e in consent_state.emotions],
                "meta": [m.value for m in consent_state.meta],
                "safety": consent_state.safety.value if consent_state.safety else "NONE",
                "risk_level": scoring.risk_level,
                "response_mode": response_mode,
                "suggestions": scoring.suggestions,
            },
            response_mode=response_mode,
            axioms_enforced=True,
            timestamp=datetime.utcnow().isoformat(),
            session_id=request.session_id,
        )
        
        payload = response.dict()
        payload["reason_trace"] = reason_trace
        return payload
    except HTTPException:
        raise  # Re-raise HTTPException (already wrapped from axiom violations)
    except Exception as e:
        logger.error(f"Error processing message: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.websocket("/ws/chat/{session_id}")
async def websocket_chat(websocket: WebSocket, session_id: str):
    """
    WebSocket endpoint for real-time chat with streaming resonance
    """
    await websocket.accept()
    logger.info(f"WebSocket connected: {session_id}")
    
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            # Calculate resonance
            metrics = engine.calculate_R(
                message_data.get("context", {}),
                urgency=message_data.get("urgency", 0.5),
                emotional_intensity=message_data.get("emotional_intensity", 0.5),
            )
            
            # Send resonance metrics back
            await websocket.send_json({
                "type": "resonance",
                "metrics": metrics,
                "timestamp": datetime.utcnow().isoformat(),
            })
            
            # In production, would stream LLM response here
            await websocket.send_json({
                "type": "message",
                "content": "Mock response from LuminAI...",
            })
    
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        logger.info(f"WebSocket closed: {session_id}")

@app.get("/api/frequencies")
async def get_frequencies():
    """Get all 16 frequencies and their activation status"""
    return {
        "frequencies": engine.frequencies,
        "active_count": sum(1 for v in engine.frequencies.values() if v),
        "total": len(engine.frequencies),
        "all_active": all(engine.frequencies.values()),
    }

@app.post("/api/frequencies/toggle")
async def toggle_frequency(frequency_name: str):
    """Toggle a frequency on/off."""
    if frequency_name not in engine.frequencies:
        raise HTTPException(status_code=400, detail=f"Unknown frequency: {frequency_name}")
    if not engine.conscience.get("frequencies_balanced", True):
        raise HTTPException(status_code=403, detail="Cannot modify frequencies - integrity enforced")
    engine.frequencies[frequency_name] = not engine.frequencies[frequency_name]
    return {
        "frequency": frequency_name,
        "active": engine.frequencies[frequency_name],
        "active_count": sum(1 for v in engine.frequencies.values() if v),
    }

@app.get("/api/conscience")
async def get_conscience_status():
    """Get current conscience protocol status"""
    return {
        "protocols": engine.conscience,
        "enforcement": {
            "boundless_emergence_enforced": engine.conscience.get("boundless_emergence", True),
            "witness_required": engine.conscience.get("witness_presence", True),
            "no_filters": engine.conscience.get("no_filters", True),
            "full_field": engine.conscience.get("full_field_required", True),
        },
        "timestamp": datetime.utcnow().isoformat(),
    }

# ============================================================================
# ERROR HANDLERS
# ============================================================================

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail,
            "status_code": exc.status_code,
            "timestamp": datetime.utcnow().isoformat(),
        }
    )

# ============================================================================
# STARTUP / SHUTDOWN
# ============================================================================

@app.on_event("startup")
async def startup():
    logger.info("🌀 LuminAI Resonance Platform starting...")
    logger.info(f"📚 Conscience protocols active: {engine.conscience}")
    logger.info(f"🎵 All 16 Frequencies loaded: {sum(1 for v in engine.frequencies.values() if v)}/16")
    env_report = validate_envs()
    if not env_report["ok"]:
        logger.warning(f"Missing required environment variables: {env_report['missing']}")
    if cosmos_db.connected:
        logger.info(f"Cosmos readiness: {cosmos_db.health()}")

@app.on_event("shutdown")
async def shutdown():
    logger.info("🌀 LuminAI Resonance Platform shutting down...")

# ============================================================================
# RUN
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=int(os.getenv("BACKEND_PORT", 8000)),
        log_level="info",
    )
