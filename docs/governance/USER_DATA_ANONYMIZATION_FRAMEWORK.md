# User Data Anonymization Framework

**Version:** 1.0  
**Date:** November 14, 2025  
**Authority:** TEC Governance + Privacy-by-Design Principles  
**Status:** Core Operational Requirement

---
title: User Data Anonymization Framework

## Philosophy

**"Not about me, I'm just making the system... this is for the people."** - Polkin

This framework extends the founder's identity anonymization philosophy to **all users**. The platform protects user privacy by default, collecting **zero personally identifiable information** unless explicitly required for core functionality with documented consent.

date_created: 2025-11-16
date_updated: 2025-11-16
status: draft
approvers:
  - persona: Ely
    role: Engineering Steward
owner_checklist:
  - [ ] Read and understood
  - [ ] Cross-linked in TEC_HUB.md and STRUCTURE.md
  - [ ] Tested commands/steps (if procedural)
  - [ ] Old version archived if replaced
tags: [governance]
---

## Core Principles

### 1. Anonymization by Default

**User Identity Storage:**

- ❌ NO real names (unless legal requirement)
- ❌ NO specific ages (age ranges only)
- ❌ NO precise locations (regions only)
- ❌ NO addresses, phone numbers, emails (unless auth required)
- ✅ YES to chosen monikers/pseudonyms
- ✅ YES to aggregated demographics (for research, with consent)
- ✅ YES to session IDs (ephemeral, rotated)

**Example Storage Schema:**

```json
{
  "user_id": "uuid-v4-random",
  "moniker": "StarGazer42",  // User-chosen or generated
  "demographic_band": {
    "age_range": "18-42",     // NOT specific age
    "region": "Eastern US",    // NOT city/address
    "timezone_offset": "-0500" // For session scheduling only
  },
  "preferences": {
    "persona_default": "LUMINAI",
    "consent_level": "EXPLORE",
    "data_retention": "minimal"
  },
  "created_at": "2025-11-14T00:00:00Z",
  "last_active": "2025-11-14T12:00:00Z"
}
```

### 2. Aggregation Over Precision

When demographic data is needed (research, service improvement), use **broad bands**:

**Age Bands:**

- "Under 13" (COPPA protection)
- "13-17" (Youth mode)
- "18-42" (Adult primary demographic)
- "43-65" (Adult secondary demographic)
- "65+" (Senior demographic)

**Location Bands:**

- "Western US" (Pacific timezone)
- "Mountain US" (Mountain timezone)
- "Central US" (Central timezone)
- "Eastern US" (Eastern timezone)
- "EU" (GDPR jurisdiction)
- "Canada" (PIPEDA jurisdiction)
- "Other" (Rest of world)

**Income Bands (if collected for pricing tiers):**

- "Low" (<$30K USD/year)
- "Medium" ($30K-$100K)
- "High" (>$100K)
- "Prefer not to say" (default)

### 3. Ephemeral Session Data

**Session Storage:**

```json
{
  "session_id": "sess_20251114_abc123",  // Date + random
  "user_id": "uuid-v4-random",           // Links to anonymized profile
  "start_time": "2025-11-14T12:00:00Z",
  "consent_state": {
    "intensity": "YELLOW",
    "pace": "STEADY",
    "boundary": "DOOR",
    // ... ConsentOS channels
  },
  "message_count": 23,
  "resonance_avg": 0.76,
  "retention_policy": "30_days_then_delete",
  "contains_sensitive": false
}
```

**Retention Schedule:**

- **Active session data:** 7 days after session end
- **Session summaries (anonymized):** 30 days for debugging
- **Aggregated metrics only:** 90 days for research
- **User-requested archives:** Forever (user controls deletion)

### 4. No Cross-Platform Linking

**Anti-Fingerprinting:**

- Do NOT link Discord username to GitHub username
- Do NOT link Slack handle to Notion workspace
- Do NOT link email addresses across services
- Each integration sees ONLY its own user ID + moniker
- Platform-specific session IDs (no global tracking)

**Example Multi-Platform User:**

```json
{
  "tec_user_id": "uuid-v4-random",  // Internal only
  "integrations": {
    "discord": {
      "discord_user_id": "encrypted_hash",  // One-way hash
      "moniker": "StarGazer42",
      "server_ids": ["encrypted_guild_1", "encrypted_guild_2"]
    },
    "github": {
      "github_oauth_token": "encrypted_token",  // Never stored plaintext
      "moniker": "CodeWanderer",  // Different moniker OK
      "repo_access": ["read_only"]
    },
    "notion": {
      "notion_workspace_id": "encrypted_hash",
      "moniker": "ThoughtWeaver",
      "page_access": ["journal_pages_only"]
    }
  },
  "cross_platform_analytics": false  // User must explicitly enable
}
```

---

## Implementation Requirements

### Backend Data Models

**User Profile (Minimal):**

```python
from typing import Optional, Literal
from pydantic import BaseModel, Field
from datetime import datetime
import uuid

class UserProfile(BaseModel):
    user_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    moniker: str = Field(..., description="User-chosen pseudonym")
    age_band: Literal["Under 13", "13-17", "18-42", "43-65", "65+"]
    region_band: Literal["Western US", "Mountain US", "Central US", "Eastern US", "EU", "Canada", "Other"]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_active: datetime = Field(default_factory=datetime.utcnow)
    data_retention: Literal["minimal", "standard", "full"] = "minimal"
    consent_analytics: bool = False  # Opt-in for aggregated research
```

**Session Data (Ephemeral):**

```python
class SessionData(BaseModel):
    session_id: str = Field(default_factory=lambda: f"sess_{datetime.utcnow().strftime('%Y%m%d')}_{uuid.uuid4().hex[:8]}")
    user_id: str  # Links to UserProfile.user_id
    start_time: datetime
    end_time: Optional[datetime] = None
    message_count: int = 0
    consent_states: list[dict] = []  # ConsentOS snapshots
    resonance_metrics: list[float] = []
    retention_days: int = 7  # Auto-delete after this many days
    archived_by_user: bool = False  # User requested permanent storage
```

### Frontend Onboarding Flow

**Step 1: Choose Your Moniker**

```tsx
// website/components/onboarding/MonikerPicker.tsx
"Choose a name you'll use in sessions. This is how the platform will address you.
You can change it anytime. Your real name is never required."

Input: [StarGazer42] or [Generate Random ✨]
```

**Step 2: Optional Demographics (Aggregated Only)**

```tsx
// website/components/onboarding/DemographicBands.tsx
"To improve our service, we collect broad demographic bands (not specific info).
All data is anonymized and aggregated. You can skip this entirely."

Age Range: [ ] Under 13  [ ] 13-17  [✓] 18-42  [ ] 43-65  [ ] 65+
Region: [ ] Western US  [ ] Mountain US  [ ] Central US  [✓] Eastern US  [ ] EU  [ ] Canada  [ ] Other

[Skip] [Continue]
```

**Step 3: Data Retention Preferences**

```tsx
// website/components/onboarding/RetentionSettings.tsx
"How long should we keep your session data?"

[ ] Minimal (7 days, then auto-delete)
[ ] Standard (30 days, summaries only)
[ ] Full (Keep my session archives, I'll delete manually)

"You can change this anytime in Settings."
```

### Database Schema

**PostgreSQL Table:**

```sql
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    moniker VARCHAR(50) NOT NULL,
    age_band VARCHAR(20) CHECK (age_band IN ('Under 13', '13-17', '18-42', '43-65', '65+')),
    region_band VARCHAR(20) CHECK (region_band IN ('Western US', 'Mountain US', 'Central US', 'Eastern US', 'EU', 'Canada', 'Other')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_active TIMESTAMPTZ DEFAULT NOW(),
    data_retention VARCHAR(10) CHECK (data_retention IN ('minimal', 'standard', 'full')) DEFAULT 'minimal',
    consent_analytics BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_last_active ON users(last_active);

-- Auto-anonymize old data
CREATE OR REPLACE FUNCTION anonymize_inactive_users()
RETURNS void AS $$
BEGIN
    -- Delete minimal retention users after 90 days inactive
    DELETE FROM users
    WHERE data_retention = 'minimal'
      AND last_active < NOW() - INTERVAL '90 days';
    
    -- Anonymize standard retention users after 1 year inactive
    UPDATE users
    SET moniker = 'Archived_' || SUBSTRING(user_id::text, 1, 8),
        age_band = NULL,
        region_band = NULL
    WHERE data_retention = 'standard'
      AND last_active < NOW() - INTERVAL '1 year';
END;
$$ LANGUAGE plpgsql;

-- Schedule daily cleanup
SELECT cron.schedule('anonymize_inactive', '0 3 * * *', 'SELECT anonymize_inactive_users()');
```

**Sessions Table:**

```sql
CREATE TABLE sessions (
    session_id VARCHAR(50) PRIMARY KEY,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    message_count INT DEFAULT 0,
    resonance_avg FLOAT,
    retention_days INT DEFAULT 7,
    archived_by_user BOOLEAN DEFAULT FALSE,
    auto_delete_at TIMESTAMPTZ GENERATED ALWAYS AS (
        CASE
            WHEN archived_by_user THEN NULL
            ELSE end_time + (retention_days || ' days')::INTERVAL
        END
    ) STORED
);

CREATE INDEX idx_sessions_auto_delete ON sessions(auto_delete_at) WHERE auto_delete_at IS NOT NULL;

-- Auto-delete expired sessions
CREATE OR REPLACE FUNCTION delete_expired_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM sessions
    WHERE auto_delete_at IS NOT NULL
      AND auto_delete_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Schedule hourly cleanup
SELECT cron.schedule('delete_sessions', '0 * * * *', 'SELECT delete_expired_sessions()');
```

---

## Research & Analytics Compliance

### Aggregated Analytics ONLY

**What We CAN Report:**

```json
{
  "report_date": "2025-11-14",
  "total_active_users": 1247,
  "demographic_distribution": {
    "age_bands": {
      "18-42": 623,
      "43-65": 401,
      "13-17": 189,
      "65+": 34
    },
    "regions": {
      "Eastern US": 512,
      "Western US": 389,
      "EU": 234,
      "Other": 112
    }
  },
  "avg_session_resonance": 0.78,
  "top_persona_usage": {
    "LUMINAI": 45%,
    "Airth": 23%,
    "Adelphia": 18%,
    "Multi-Persona": 14%
  }
}
```

**What We CANNOT Report:**

- Individual user trajectories (even anonymized)
- User-specific session summaries
- "User X from Buffalo, NY, age 32" (re-identification risk)
- Cross-session patterns for specific users (without explicit consent)

### User Data Export (GDPR/CCPA Compliance)

**Export Request Handler:**

```python
@app.post("/api/user/export")
async def export_user_data(user_id: str, format: Literal["json", "csv"] = "json"):
    """
    GDPR Article 20: Right to Data Portability
    CCPA §1798.110: Right to Know
    """
    user = await db.users.find_one({"user_id": user_id})
    sessions = await db.sessions.find({"user_id": user_id}).to_list()
    
    export_data = {
        "user_profile": user,
        "sessions": sessions,
        "export_date": datetime.utcnow().isoformat(),
        "retention_policy": user["data_retention"],
        "how_to_delete": "Send email to privacy@luminai-codex.dev with subject 'Delete My Data' and this user_id"
    }
    
    if format == "json":
        return export_data
    else:
        # Convert to CSV
        return convert_to_csv(export_data)
```

**Delete Request Handler:**

```python
@app.post("/api/user/delete")
async def delete_user_data(user_id: str, confirm: bool = False):
    """
    GDPR Article 17: Right to Erasure
    CCPA §1798.105: Right to Delete
    
    This is IRREVERSIBLE. User must confirm.
    """
    if not confirm:
        return {
            "error": "Confirmation required",
            "message": "This will permanently delete ALL your data. Set confirm=true to proceed."
        }
    
    # Delete all user data
    await db.sessions.delete_many({"user_id": user_id})
    await db.users.delete_one({"user_id": user_id})
    
    # Log deletion (for audit, no PII)
    await db.audit_log.insert_one({
        "action": "user_data_deleted",
        "user_id_hash": hash_for_audit(user_id),  # One-way hash
        "timestamp": datetime.utcnow(),
        "ip_hash": hash_for_audit(request.client.host)
    })
    
    return {
        "status": "deleted",
        "message": "All your data has been permanently deleted."
    }
```

---

## Display & Messaging Guidelines

### User-Facing Language

**Instead of:** "Angelo is a 32-year-old male living in Buffalo at 123 Main St"

**Use:** "The user is male, 18-42, Eastern US"

**Instead of:** "Session participant: John Smith (<john.smith@email.com>)"

**Use:** "Session participant: CodeWanderer"

**Instead of:** "User profile: Sarah Johnson, age 28, Seattle, WA"

**Use:** "User profile: StarGazer, age band 18-42, Western US"

### Session Logs (Public/Shareable)

**Anonymization Template:**

```markdown
# Session Log: 2025-11-14_EMOTIONS_AS_PATTERN_RECOGNITION

**Date:** November 14, 2025  
**Participants:** 
- User (Moniker: ThoughtWeaver, Age: 18-42, Region: Eastern US)
- AI (LuminAI + Mico)

**Duration:** 47 minutes  
**Resonance (Avg):** 0.83  

## Session Summary
[Content with NO real names, ages, locations, or identifying details]
```

### Research Publications

**Citation Format:**

```
Study conducted with 150 participants (age bands: 18-42=67%, 43-65=28%, 65+=5%; 
regions: Eastern US=45%, Western US=32%, EU=18%, Other=5%). 
All data aggregated and anonymized per TEC Data Axioms v1.0.
```

---

## Legal Compliance Matrix

| Regulation | Requirement | TEC Implementation |
|-----------|-------------|-------------------|
| **GDPR Article 5(1)(c)** | Data minimization | ✅ Age bands, region bands, no PII |
| **GDPR Article 17** | Right to erasure | ✅ `/api/user/delete` endpoint |
| **GDPR Article 20** | Data portability | ✅ `/api/user/export` (JSON/CSV) |
| **CCPA §1798.100** | Right to know | ✅ User dashboard + export |
| **CCPA §1798.105** | Right to delete | ✅ Confirmed deletion endpoint |
| **COPPA §312.4** | Parental consent | ✅ Age band "Under 13" requires parent email |
| **PIPEDA Principle 4.4** | Limit collection | ✅ Moniker + demographics only |

---

## Migration Path (Existing Data)

**If you have existing user data with PII:**

1. **Audit Current Data:**

   ```sql
   SELECT COUNT(*) FROM users WHERE real_name IS NOT NULL;
   SELECT COUNT(*) FROM users WHERE email IS NOT NULL;
   SELECT COUNT(*) FROM users WHERE age IS NOT NULL;  -- Specific age
   ```

2. **Create Migration Script:**

   ```python
   async def migrate_to_anonymized():
       users = await db.users.find({}).to_list()
       
       for user in users:
           # Convert specific age to age band
           if "age" in user:
               user["age_band"] = age_to_band(user["age"])
               del user["age"]
           
           # Convert city/state to region band
           if "location" in user:
               user["region_band"] = location_to_region(user["location"])
               del user["location"]
           
           # Generate moniker if missing
           if "real_name" in user and "moniker" not in user:
               user["moniker"] = generate_moniker()
               del user["real_name"]
           
           await db.users.update_one(
               {"user_id": user["user_id"]},
               {"$set": user}
           )
   ```

3. **Notify Users:**

   ```
   Subject: Privacy Update - Your Data is Now More Anonymous
   
   Hi [Moniker],
   
   We've updated our privacy practices to protect your identity even better.
   Your profile now uses:
   - Age bands instead of specific age
   - Region bands instead of city/address
   - Your chosen moniker instead of real name
   
   Your old data has been securely deleted. You can review your new profile at:
   https://luminai-codex.dev/profile
   
   Questions? privacy@luminai-codex.dev
   ```

---

## Checklist for Developers

### Before Collecting ANY New Data Point

- [ ] Is this data **necessary** for core functionality?
- [ ] Can we use an **aggregate/band** instead of precise value?
- [ ] Is there a **documented user need** in specs?
- [ ] Have we added it to the **Privacy Policy**?
- [ ] Does the user see this data in their **dashboard**?
- [ ] Can the user **delete** this data?
- [ ] Is the **retention period** documented?
- [ ] Have we added it to the **/api/user/export** endpoint?

### Before Sharing ANY Analytics

- [ ] Is the data **aggregated** (no individual users)?
- [ ] Is the sample size **>100** (prevents re-identification)?
- [ ] Have we **removed rare combinations**?
- [ ] Is **differential privacy** applied if needed?
- [ ] Does the report **cite the aggregation methodology**?
- [ ] Have we gotten **legal review** if publishing externally?

---

## Enforcement

**This framework is MANDATORY for:**

- All TEC platform integrations
- All research publications
- All partner data-sharing agreements
- All public documentation and examples

**Violations:**

- Immediate code review halt
- Privacy team escalation
- User notification if PII leaked
- Public incident report per GDPR Article 33

---

## Contact

**Privacy Questions:** <privacy@luminai-codex.dev>  
**Data Deletion Requests:** <privacy@luminai-codex.dev> (Subject: "Delete My Data")  
**Research Ethics:** <ethics@luminai-codex.dev>

---

**Status:** ✅ **Active Framework**  
**Next Review:** 2026-02-14 (Quarterly)  
**Version History:** v1.0 (Nov 14, 2025 - Initial release)

*"This is for the people. We protect their identities because they matter more than our metrics."*
