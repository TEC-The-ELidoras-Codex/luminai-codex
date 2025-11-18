# 🎯 TEC Memo System — Implementation Summary

**Date:** 2025-11-16  
**Status:** Phase 1 Complete — Template + Practices + Validator + Pre-commit Hook  
**Next:** Monthly persona sweep (Dec 7, 2025)

---

## What Was Delivered

### 1. Core Template (`docs/operations/TEC_MEMO_TEMPLATE.md`)

Standard structure for all documentation:

- YAML metadata block (title, dates, status, approvers, owner checklist, tags, related docs)
- Persona margin notes with emoji + role + contextual message
- Revision history table
- Footer mantra/approval block

**Enforcement:** Pre-commit hook validates metadata on all `docs/**/*.md` files (excluding archive/reports)

### 2. Business Practices (`CODEBASE_MEMO_PRACTICES.md`)

Workflow guide covering:

- Draft → Review → Approval lifecycle
- Persona reviewer assignments by doc type
- Margin note injection (manual + automated via distress detection)
- Rage-commit pattern triggers (force-pushes, all-caps, profanity)
- Monthly persona sweep ritual
- Secret handling protocol (Bitwarden + GitHub Secrets only)
- CLEAR naming conventions (Consistent, Linked, Explicit, Approved, Revisioned)

### 3. Validation Script (`scripts/maintenance/validate_memo.py`)

Python tool that checks:

- Presence of YAML metadata block
- Required fields (title, date_created, status, approvers)
- Date format (ISO 8601)
- Approved status → requires approved_date
- Valid persona names (Airth, Ely, Adelphia, LuminAI, Arcadia, Kaznak)

**Usage:**

```bash
python scripts/maintenance/validate_memo.py docs/operations/DEV_RECOVERY.md
python scripts/maintenance/validate_memo.py docs/**/*.md
```

### 4. Pre-Commit Hook (`.pre-commit-config.yaml`)

Added local hook:

```yaml
- id: validate-memo-metadata
  name: Validate TEC Memo metadata in docs
  entry: python scripts/maintenance/validate_memo.py
  language: system
  files: ^docs/.*\.md$
  exclude: ^docs/(archive|reports)/
```

Runs on every commit touching `docs/` files; blocks commit if metadata invalid.

### 5. Live Examples

#### A. DEV_RECOVERY.md (Updated)

- Added full YAML metadata block
- 3 persona approvers (Adelphia, Airth, Ely)
- 3 margin notes from Adelphia (grounding) and Airth (boundary-setting)
- Revision history table
- Owner checklist (3/4 checked)

#### B. SPOTIFY_INTEGRATION.md (New)

- Documents OAuth flow for TEC Resonance Player
- Redirect URIs, API scopes, environment variables
- Credential rotation protocol
- Margin notes from Airth (security) and Ely (pre-deploy checklist)
- Resonance mapping table (Spotify features → TGCR axes)

---

## How to Use This System

### For New Docs

1. Copy `docs/operations/TEC_MEMO_TEMPLATE.md` to target location
2. Fill metadata block (use today's date, set `status: draft`)
3. Write content
4. Invoke 2 persona reviewers (see practices doc for assignment table)
5. Each reviewer adds margin note + updates approvers block
6. Run through owner checklist
7. Set `status: approved`
8. Commit (pre-commit hook validates automatically)

### For Existing Docs (Migration)

**Priority order:**

1. Security/deployment docs (SECRETS_MANAGEMENT, GITHUB_APP_SETUP, etc.)
2. Governance/ethics covenants (ConsentOS, Embodiment Covenant, etc.)
3. Operations/reference (TEC_HUB, QUICK_REFERENCE, etc.)
4. Education/intro (UNDERSTANDING_LUMINAI_CODEX, etc.)
5. Archive docs (add metadata but skip margin notes)

**Process:**

- Add metadata block at top (use original file creation date if known; else today)
- Set `status: review` (don't approve old docs without re-reading)
- Add at least one margin note (Airth or Adelphia recommended)
- Commit with: `docs: migrate [filename] to TEC Memo template`

### Monthly Persona Sweep

**Next scheduled:** December 7, 2025

1. Run: `python scripts/maintenance/memo_audit.py` (to be created)
2. Each Core 5 persona reviews 2-3 docs in their domain
3. Add "still relevant" or "update needed" margin notes
4. Update `date_updated` in metadata
5. Commit: `chore: monthly persona sweep — Nov 2025`

---

## Margin Note Guidelines

### When to Add

- **During review:** Context that helps future readers (you or teammates)
- **Post-approval:** New information emerges (e.g., integration added)
- **Distress detection:** Commit patterns indicate nervous system overload
- **Seasonal wisdom:** Quarterly reviews add "this saved me in [context]" notes

### Format

```markdown
> **[Emoji] [Persona Name]** ([Role] | [Optional timestamp/context])  
> [Message in persona voice — grounding, boundary-setting, or insight]
```

**Examples:**

```markdown
> **🌱 Adelphia** (Life Everywhere)  
> This seems silly, but it's about taking a second to breathe. Nothing's broken.

> **📚 Airth** (Boundary Keeper | Post-approval note)  
> You wrote "Nuke repo" in commit 3fa7b2. That's fatigue, not diagnosis.

> **🎭 Arcadia** (Story Bridge | 2025-11-16)  
> I see the rage here. Reminds me of "Burn the Witch" by Radiohead — queued for later.
```

### Voice Guidelines

| Persona | Tone | When to Use |
|---------|------|-------------|
| 🌱 Adelphia | Somatic grounding, nervous system awareness | Overload, shutdown, burnout |
| 📚 Airth | Boundary-setting, ontological truth | Security, cognitive distortions |
| 🛠️ Ely | Operational pragmatism, checklists | Deployment, technical fixes |
| 🎭 Arcadia | Story bridges, cultural connections | Education, user-facing docs |
| 🧠 LuminAI | Pattern recognition, resonance mapping | Framework, theoretical docs |

---

## Integration Points

### Version Control

**Commit message convention:**

```text
docs(scope): migrate DEV_RECOVERY to TEC Memo template

Added metadata block with Adelphia + Airth approvers.
Included 3 margin notes for grounding + boundary-setting.

Approved-by: Adelphia 🌱, Airth 📚, Ely 🛠️
```

### Distress Detection (Future)

**Trigger patterns:**

- 3+ force-pushes in < 5 minutes
- Commit messages with: "fuck", "delete", "broken", "rage", "goddammit"
- All-caps subject lines
- Revert → force-push cycles

**Automated response:**

1. CI job runs `scripts/development/distress_check.py`
2. Appends margin note from Adelphia to most recently edited doc
3. Sends notification: "🌱 Margin note added to [doc] — check when ready"

### Aqueduct System (Future)

Margin notes feed into:

- Resonance metrics (emotional state tracking)
- Persona invocation triggers (auto-summon based on patterns)
- Knowledge graph (cross-link docs thematically)

**Status:** Design phase. Integration with `modules/codex-hub/`.

---

## Success Metrics

### Phase 1 (Current)

- [x] Template created and validated
- [x] Practices doc published
- [x] Validator script working
- [x] Pre-commit hook enforcing metadata
- [x] 2 live examples (DEV_RECOVERY, SPOTIFY_INTEGRATION)

### Phase 2 (Dec 2025)

- [ ] Migrate 10 core docs to template
- [ ] First monthly persona sweep completed
- [ ] Distress detection script (auto margin notes)
- [ ] Memo audit tool (find missing metadata)

### Phase 3 (Q1 2026)

- [ ] All governance docs migrated
- [ ] All deployment docs migrated
- [ ] Aqueduct integration (margin notes → resonance metrics)
- [ ] Public-facing memo examples (education docs)

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Pre-commit hook fails with "missing field" | Add required metadata (title, date_created, status, approvers) |
| Validator complains about persona name | Use canonical names: Airth, Ely, Adelphia, LuminAI, Arcadia, Kaznak |
| Date format error | Use YYYY-MM-DD (ISO 8601); avoid DD/MM/YYYY or MM-DD-YYYY |
| Approved status rejected | Add at least one `approved_date` under approvers |
| Margin note not showing up | Ensure blockquote starts with `> **[Emoji] [Name]**` |

---

## Owner Checklist

- [x] Read template + practices docs
- [x] Validated DEV_RECOVERY.md (live example)
- [x] Created SPOTIFY_INTEGRATION.md (live example)
- [x] Added pre-commit hook
- [x] Tested validator script
- [ ] Schedule Dec 7 persona sweep reminder
- [ ] Create memo_audit.py tool (Phase 2)
- [ ] Migrate SECRETS_MANAGEMENT.md next (security priority)

---

**Approved by:**  
🌱 Adelphia (Life Everywhere) — 2025-11-16  
📚 Airth (Boundary Keeper) — 2025-11-16  
🛠️ Ely (Engineering Steward) — 2025-11-16

**Mantra:**  
"Structure is care. Templates are boundaries. Margin notes are presence. This is how we stay coherent at scale."
