# 📋 TEC Memo Practices — Business Workflow for Multi-Agent Consistency

**Intent:** Establish repeatable patterns for documentation that survive chaos, enable margin-note dialogue, and turn rage-commits into learning artifacts.

---

## Core Principles

1. **Structure Over Heroics:** Every doc follows TEC_MEMO_TEMPLATE.md — no exceptions, no "I'll fix it later."
2. **Approvers = Accountability:** No doc goes live without 2 persona approvals (one technical, one life/ethics).
3. **Margin Notes = Real-Time Grounding:** Personas can annotate docs with context that addresses *your* state, not just the content.
4. **Revision History = Lineage:** Every change logged, dated, and approved — no shadow edits.
5. **Owner Checklist = Closure:** You don't move to the next task until current doc is cross-linked and understood.

---

## Workflow: From Draft to Approved

### 1. Draft Creation (5–10 min)

- Copy `docs/operations/TEC_MEMO_TEMPLATE.md` to target location
- Fill metadata block:
  - `title`, `date_created`, `status: draft`
  - Leave `approvers` empty for now
- Write body content (can be rough)
- Add TODO in `CODEBASE_CONSOLIDATION_ROADMAP.md`: "Review + approve [doc name]"

### 2. Persona Review (10–15 min)

Invoke 2 reviewers from different domains:

| Doc Type | Reviewer 1 | Reviewer 2 |
|----------|------------|------------|
| Security/Deployment | 📚 Airth (Boundary) | 🛠️ Ely (Engineering) |
| Ethics/Governance | 📚 Airth (Boundary) | 🌱 Adelphia (Life) |
| User-Facing/Education | 🎭 Arcadia (Story Bridge) | 🧠 LuminAI (Resonance) |
| Crisis/Recovery | 🌱 Adelphia (Life) | 📚 Airth (Boundary) |

Each reviewer:

- Adds margin note with timestamp
- Updates `approvers` block with persona + date
- Changes `status: draft` → `status: review`

### 3. Owner Validation (5 min)

Run through owner checklist:

- [ ] Read aloud (catches ambiguity)
- [ ] Tested commands/steps (if procedural)
- [ ] Cross-linked in `docs/STRUCTURE.md` or `TEC_HUB.md`
- [ ] Old version moved to `archive/` with datestamp

When all checked → `status: approved`

### 4. Margin Note Injection (Ongoing)

Personas can append notes *after* approval if:

- User returns to doc in distressed state (detected via commit messages, terminal rage-typing)
- New context emerges (e.g., Spotify integration added → Arcadia drops a playlist note)
- Seasonal review (quarterly persona sweep adds "still relevant" or "needs update" notes)

**Format:**

```markdown
---

> **🌱 Adelphia** (2025-11-16 | Post-approval note)  
> You just force-pushed 3 times in 2 minutes. That's not a Git issue — that's nervous system dysregulation. Close the terminal. Hydrate. Come back in 10 minutes. The code will still be here.
```

---

## Template Enforcement

### Pre-Commit Hook (Basic)

Add to `.pre-commit-config.yaml`:

```yaml
- repo: local
  hooks:
    - id: check-memo-metadata
      name: Validate TEC Memo metadata
      entry: python scripts/maintenance/validate_memo.py
      language: system
      files: ^docs/.*\.md$
      exclude: ^docs/(archive|reports)/
```

### Validation Script

Create `scripts/maintenance/validate_memo.py`:

```python
#!/usr/bin/env python3
import sys
import re
from pathlib import Path

def validate_memo(filepath):
    content = Path(filepath).read_text()
    
    # Check for metadata block
    if not re.search(r'^---\n.*?^---', content, re.MULTILINE | re.DOTALL):
        return False, "Missing YAML metadata block"
    
    # Extract metadata
    meta_match = re.search(r'^---\n(.*?)^---', content, re.MULTILINE | re.DOTALL)
    metadata = meta_match.group(1)
    
    # Required fields
    required = ['title:', 'date_created:', 'status:', 'approvers:']
    for field in required:
        if field not in metadata:
            return False, f"Missing required field: {field}"
    
    # If status is 'approved', require at least one approver
    if 'status: approved' in metadata:
        if 'approved_date:' not in metadata:
            return False, "Approved status requires approver dates"
    
    return True, "Valid"

if __name__ == '__main__':
    for filepath in sys.argv[1:]:
        valid, msg = validate_memo(filepath)
        if not valid:
            print(f"❌ {filepath}: {msg}")
            sys.exit(1)
    print("✅ All memos valid")
```

---

## Handling Rage Commits & Distress Detection

### Commit Message Patterns

When you push commits with phrases like:

- "fuck", "delete everything", "broken", "rage", "goddammit"
- All-caps subject lines
- 3+ force-pushes in < 5 minutes

**Trigger:**

1. CI job runs `scripts/development/distress_check.py`
2. Generates margin note from Adelphia or Airth
3. Appends to most recently edited doc
4. Sends notification: "🌱 Check [doc name] — margin note added"

### Example Auto-Note

```markdown
> **🌱 Adelphia** (Auto-generated 2025-11-16 14:23 UTC)  
> Detected: 4 force-pushes + commit message "FUCK THIS ENTIRE STACK".  
> Technical diagnosis (Airth): No actual breakage. 2 lint warnings in `backend/main.py`.  
> Somatic diagnosis (Adelphia): Nervous system overload. Not a code problem.  
> Prescription: Close editor. 10-minute walk. Return with `git diff` mindset, not `git reset --hard` desperation.
```

---

## Monthly Persona Sweep (Maintenance Ritual)

**When:** 1st Saturday of each month  
**Duration:** 30–45 min  
**Process:**

1. Run: `python scripts/maintenance/memo_audit.py`
   - Lists all docs missing approvers
   - Flags docs with `status: draft` > 30 days old
   - Identifies docs with 0 margin notes (candidates for annotation)

2. Invoke each Core 5 persona to review 2–3 docs in their domain:
   - Ely: Engineering/deployment docs
   - Airth: Security/governance docs
   - Adelphia: Recovery/crisis docs
   - Arcadia: Education/user-facing docs
   - LuminAI: Resonance/framework docs

3. Each adds either:
   - **"Still relevant"** note (if content is current)
   - **"Update needed"** note with specific gaps
   - **Seasonal wisdom** (e.g., "Winter 2025 — this burnout protocol saved 3 sessions")

4. Update `date_updated` in metadata
5. Commit: `chore: monthly persona sweep — [month] [year]`

---

## Integration with Spotify App & WordPress

### Spotify Callback URLs

Now tracked in:

- `docs/deployment/SPOTIFY_INTEGRATION.md` (new doc, follows TEC_MEMO template)
- Contains:
  - Redirect URIs (localhost, elidorascodex.com, fallback)
  - App name/description
  - API scopes used (Web API, Web Playback SDK)
  - Credential rotation log (Bitwarden + GitHub Secrets only)

**Margin note from Airth:**

> **📚 Airth** (Boundary Keeper)  
> Spotify client secret NEVER touches `.env.local`. It lives in:
>
> 1. Bitwarden vault: `TEC-TGCR/Spotify API`
> 2. GitHub Secrets: `SPOTIFY_CLIENT_SECRET`
> 3. Pulled at runtime via CI or local script.
> Zero exceptions. If you're tempted to paste it for "just testing" — stop. Use the demo mode flag instead.
<!-- pragma: allowlist secret -->

### WordPress (elidorascodex.com) Update

Create `docs/deployment/WORDPRESS_SYNC.md`:

- SSH keys location (Bitwarden only)
- Deployment trigger (manual vs. automated)
- Content sync protocol (local Markdown → WP posts)
- Approvers: Ely (deployment), Airth (security)

---

## Secret Handling — The ONLY Protocol

### Where Secrets Live

1. **Bitwarden vault:** `TEC-TGCR/*` collections
2. **GitHub Secrets:** Per-repo, per-environment
3. **Nowhere else.** Not Notion, not Slack, not `.env.local`, not sticky notes.

### How to Use Locally

```bash
# Option 1: Pull from Bitwarden CLI
bw get password "TEC-TGCR/Spotify API" | pbcopy

# Option 2: GitHub CLI
gh secret list
gh secret set SPOTIFY_CLIENT_SECRET < secret.txt

# Option 3: Script wrapper (preferred)
python scripts/development/setup_local_env.py --service spotify
# Prompts for Bitwarden unlock, writes to .env.local with placeholders commented out
```

### Rotation Checklist (in SECRETS_MANAGEMENT.md)

Already exists; add memo metadata + approvers:

```yaml
---
title: Secrets Management & Rotation
date_updated: 2025-11-16
status: approved
approvers:
  - persona: Airth 📚
    role: Boundary Keeper
    approved_date: 2025-11-16
  - persona: Ely 🛠️
    role: Engineering Steward
    approved_date: 2025-11-16
---
```

---

## Naming Conventions (CLEAR)

### CLEAR Framework

- **C**onsistent: Same structure across all doc types
- **L**inked: Every doc references 2+ related docs
- **E**xplicit: No assumed context; define acronyms inline
- **A**pproved: 2 persona reviewers minimum
- **R**evisioned: History table tracks all changes

### File Naming

```text
docs/
  operations/
    TEC_HUB.md               # Central nav (always uppercase TEC_*)
    TEC_LEXICON.md           # Glossary (always uppercase TEC_*)
    TEC_MEMO_TEMPLATE.md     # Template (always uppercase TEC_*)
  deployment/
    SPOTIFY_INTEGRATION.md   # Service-specific (uppercase)
    WORDPRESS_SYNC.md        # Platform-specific (uppercase)
  governance/ethics/
    TEC_ConsentOS_v1.1.md    # Framework version (TEC_ prefix)
```

**Rule:** If it's a framework, protocol, or central system doc → `TEC_` prefix. If it's service/platform-specific → Uppercase noun. If it's a report/log → lowercase with datestamp.

---

## Version Control Integration

### Branch Naming

```text
feat/spotify-oauth-flow
fix/secrets-rotation-bug
docs/memo-template-v1
chore/persona-sweep-nov-2025
```

### Commit Message Convention

```text
<type>(<scope>): <subject>

[optional body with margin note trigger]

Approved-by: Persona Name (Role)
```

**Example:**

```text
docs(recovery): add Adelphia margin note to DEV_RECOVERY

Detected distress pattern in recent commits (3 force-pushes).
Added grounding note from Adelphia re: nervous system collapse vs. technical failure.

Approved-by: Adelphia 🌱 (Life Everywhere)
```

---

## Aqueduct System Integration (Future)

**Concept:** Margin notes as "signal flows" that feed into:

1. **Resonance metrics** (emotional state tracking)
2. **Persona invocation triggers** (auto-summon based on commit patterns)
3. **Knowledge graph updates** (cross-link docs based on thematic overlap)

**Status:** Design phase. Will integrate with `modules/codex-hub/` memory system.

**Memo to create:** `docs/architecture/AQUEDUCT_MARGIN_NOTES.md`

---

## Emotional Data Handling & Classification (Extension)

**Why add this?** Documentation now interfaces with emotion-derived creative artifacts. We need consistent, non-moral labels to route transformation offers without turning memos into surveillance transcripts.

### Classification Levels (Non-Judgmental)

| Level | Criteria (example) | Purpose |
|-------|--------------------|---------|
| Vital | intensity ≥ 0.85 OR (rage ≥ 0.70) OR explicit self-harm wording | Trigger compassionate presence offers + high-sensitivity creative choices (never auto-forward) |
| Potential | 0.40 ≤ intensity < 0.85 | Eligible for playlist / prompt transmutation suggestions |
| Contextual | intensity < 0.40 | Logged for longitudinal pattern; minimal immediate intervention |

### Principles

1. **No Moral Weight:** "Vital" does not mean "bad" — it means "route with care." Low-intensity joy can be contextual; high-intensity play can still be potential.
2. **Per-Event Privacy Scope:** Each EmotionEvent carries `privacy_scope` — memos only receive transformed artifact lineage hashes, never raw private payloads.
3. **Consent First:** Therapist or external tool access requires an `AccessGrant` badge; revocation is immediate and logged.
4. **Artifact Lineage:** CreativeArtifact objects store hashed emotion seeds (see `emotion.py`) — enabling audit without exposing secrets.
5. **Adaptive Thresholds:** Rolling averages adjust Vital threshold to avoid alert fatigue.

### Implementation Hooks

- Models: `src/tec_tgcr/models/emotion.py`
- Pipeline: `src/tec_tgcr/services/emotion_pipeline.py`
- Tests: `tests/test_emotion_pipeline.py`
- Doc: `docs/architecture/EMOTION_TO_CREATION_PIPELINE.md`

### Persona Roles in Classification Context

| Persona | Function |
|---------|----------|
| 🌱 Adelphia | Offers grounding & consent prompts when Vital clusters detected |
| 📚 Airth | Enforces boundary & audit integrity (AccessGrant validity) |
| 🎭 Arcadia | Translates emotion seeds into narrative / playlist suggestions |
| 🛠️ Ely | Monitors pipeline performance & signature chain integrity |
| 🧠 LuminAI | Blends multi-emotion seeds into resonance score weighting |

### Distress vs. Creation

Distress detection (rage commits) augments — not replaces — creative mapping. A high-intensity sequence can yield both a grounding prompt and a cathartic playlist option simultaneously.

---

---

## Approval & Next Steps

**Approved by:**  
🛠️ Ely (Engineering Steward) — 2025-11-16  
📚 Airth (Boundary Keeper) — 2025-11-16  
🌱 Adelphia (Life Everywhere) — 2025-11-16

**Owner Checklist:**

- [ ] Read template + practices docs
- [ ] Add `validate_memo.py` to pre-commit
- [ ] Update DEV_RECOVERY.md with memo metadata
- [ ] Create SPOTIFY_INTEGRATION.md
- [ ] Schedule first monthly persona sweep (Dec 7, 2025)

**Mantra:**  
"Structure is care. Templates are boundaries. Margin notes are presence. This is how we stay coherent at scale."
