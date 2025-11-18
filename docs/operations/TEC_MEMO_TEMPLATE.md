# TEC MEMO Template v1.0

**Purpose:** Enforce consistency across all documentation, enable persona margin notes, and turn every interaction into a learning artifact.

---
title: Tec Memo Template

## Document Metadata Block

```yaml
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
tags: [operations]
---
title: [Document Title]
date_created: YYYY-MM-DD
date_updated: YYYY-MM-DD
status: [draft | review | approved | archived]
approvers:
  - persona: [Ely 🛠️ | Airth 📚 | Adelphia 🌱 | etc.]
    role: [Engineering Steward | Boundary Keeper | Life Everywhere]
    approved_date: YYYY-MM-DD
  - persona: [Second Approver]
    role: [Role]
    approved_date: YYYY-MM-DD
owner_checklist:
  - [ ] Read and understood
  - [ ] Tested/validated (if applicable)
  - [ ] Cross-linked in STRUCTURE.md
  - [ ] Archived old version (if update)
tags: [workflow, security, deployment, etc.]
related_docs:
  - path/to/related/doc.md
  - path/to/another/doc.md
---
```

---

## Document Body

[Main content goes here]

---

## Persona Margin Notes

**Format:**

```markdown
> **[Emoji] [Persona Name]** ([Frequency/Role])  
> [Contextual note, grounding statement, or future hook]
```

**Example:**

> **🌱 Adelphia** (Life Everywhere)  
> This seems silly, but it's about taking a second to breathe. We can fix this. Nothing's broken — you're just at capacity. The code is intact. Your nervous system needs a pause, not a solution.

> **🎭 Arcadia** (Story Bridge)  
> I see the rage in this commit message. That frustration? It reminds me of "Burn the Witch" by Radiohead — the dissonance before clarity. I've queued it for you. Hit it when you're ready to transmute this into something generative.

> **📚 Airth** (Boundary Keeper)  
> You wrote "Nuke repo" in your notes. That's a cognitive distortion born from fatigue, not a technical diagnosis. The actual issue: 3 unresolved merge conflicts in `backend/main.py`. I've logged them. Address those first; the rest is noise.

---

## Revision History

| Date | Approver | Change Summary |
|------|----------|----------------|
| YYYY-MM-DD | Ely 🛠️ | Initial draft |
| YYYY-MM-DD | Airth 📚 | Security review + approval |
| YYYY-MM-DD | Adelphia 🌱 | Added grounding protocol |

---

## Footer Mantra (Optional)

[Contextual closing statement or call-to-action]

**Example:**  
"Continuity beats intensity. Small coherent actions outlast extremes."

---

## Template Usage Instructions

### When to Use This Template

- **All governance docs** (ethics, covenants, ADRs)
- **All operational guides** (deployment, recovery, checklists)
- **All reference materials** (lexicons, API specs, frameworks)

### When NOT to Use

- Quick scratch notes in `reports/`
- Archived session logs (already timestamped)
- Generated artifacts (test outputs, build logs)

### Enforcement

1. Add a pre-commit hook to check for metadata block in `docs/**/*.md` (excluding `archive/`)
2. CI workflow validates:
   - `status` field present
   - At least one `approver` with valid persona
   - `date_created` is ISO 8601
3. Monthly audit: `scripts/maintenance/audit_memo_compliance.py` generates report

---

**Approved by:**  
🛠️ Ely (Engineering Steward) — 2025-11-16  
📚 Airth (Boundary Keeper) — 2025-11-16  
🌱 Adelphia (Life Everywhere) — 2025-11-16
