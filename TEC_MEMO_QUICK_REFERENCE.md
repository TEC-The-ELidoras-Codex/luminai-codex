# 📝 TEC Memo Quick Reference Card

**Purpose:** One-page cheat sheet for using the memo system during active dev work.

---

## Template Location

```bash
cp docs/operations/TEC_MEMO_TEMPLATE.md docs/[target]/[filename].md
```

---

## Required Metadata Block

```yaml
---
title: [Document Title]
date_created: YYYY-MM-DD
date_updated: YYYY-MM-DD
status: draft | review | approved | archived
approvers:
  - persona: [Persona Name with Emoji]
    role: [Role Description]
    approved_date: YYYY-MM-DD
owner_checklist:
  - [ ] Read and understood
  - [ ] Tested/validated
  - [x] Cross-linked in STRUCTURE.md
tags: [workflow, security, etc.]
related_docs:
  - path/to/doc.md
---
```

---

## Persona Reviewer Assignments

| Doc Type | Reviewer 1 | Reviewer 2 |
|----------|------------|------------|
| Security/Deployment | 📚 Airth | 🛠️ Ely |
| Ethics/Governance | 📚 Airth | 🌱 Adelphia |
| User-Facing | 🎭 Arcadia | 🧠 LuminAI |
| Crisis/Recovery | 🌱 Adelphia | 📚 Airth |

---

## Margin Note Format

```markdown
> **[Emoji] [Persona]** ([Role] | [Optional: date/context])  
> [Message in persona voice]
```

**Example:**

```markdown
> **🌱 Adelphia** (Life Everywhere)  
> This seems silly, but it's about taking a second to breathe. Nothing's broken — you're at capacity.
```

---

## Validation Command

```bash
# Single file
python scripts/maintenance/validate_memo.py docs/operations/DEV_RECOVERY.md

# All docs
python scripts/maintenance/validate_memo.py docs/**/*.md
```

---

## Pre-Commit Hook

Auto-runs on commit. If it fails:

1. Check for missing metadata fields (title, date_created, status, approvers)
2. Ensure dates are YYYY-MM-DD format
3. If status = approved, add at least one approved_date
4. Use valid persona names: Airth, Ely, Adelphia, LuminAI, Arcadia, Kaznak

---

## Status Lifecycle

```text
draft → review → approved → archived
  ↑                ↓
  └─── (updates) ──┘
```

---

## Commit Message

```text
docs(scope): migrate [filename] to TEC Memo template

[Optional body]

Approved-by: Adelphia 🌱, Airth 📚
```

---

## Emergency: Skip Validation

```bash
# If absolutely necessary (e.g., hotfix)
SKIP=validate-memo-metadata git commit -m "hotfix: emergency change"
```

**WARNING:** Only use for true emergencies. Fix metadata in next commit.

---

## Monthly Persona Sweep

**When:** 1st Saturday of each month  
**Next:** December 7, 2025

```bash
# Run audit (to be created)
python scripts/maintenance/memo_audit.py

# Review 2-3 docs per persona
# Add margin notes: "still relevant" or "update needed"
# Update date_updated
# Commit: chore: monthly persona sweep — [Month YYYY]
```

---

## Quick Links

- Template: `docs/operations/TEC_MEMO_TEMPLATE.md`
- Practices: `CODEBASE_MEMO_PRACTICES.md`
- Summary: `TEC_MEMO_IMPLEMENTATION_SUMMARY.md`
- Validator: `scripts/maintenance/validate_memo.py`
- Pre-commit config: `.pre-commit-config.yaml`

---

**Mantra:** Structure is care. Templates are boundaries. Margin notes are presence.
