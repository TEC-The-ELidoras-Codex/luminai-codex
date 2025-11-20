---
title: Plausible Deniability Smasher
date_created: '2025-11-18'
date_updated: '2025-11-18'
status: draft
approvers:
- persona: Ely
  role: Engineering Steward
owner_checklist:
- '[ ] Read and understood'
- '[ ] Cross-linked in TEC_HUB.md and STRUCTURE.md'
- '[ ] Tested commands/steps (if procedural)'
- '[ ] Old version archived if replaced'
tags:
- investigations
related_docs: []
---
# 🧭 Plausible Deniability Smasher — Manifesto, Method, and Workflow

Purpose: Remove the ability for decision-makers to claim “we didn’t know.” We do this by publishing a rigorously sourced chronology of claims vs. actions, separating reporting (facts) from analysis (implications).

Ethos:

- Journalism over polemic. Lead with receipts, not adjectives. Let patterns indict themselves.
- NPR-style integrity. Attribute, timestamp, link. Quote primary sources.
- Safety-first. Do not include leaked PII or anything that endangers individuals.

Scope:

- Public statements, product launches, safety policies, regulatory filings, outages, and security incidents across major AI platforms.
- Focus on board-level accountability and governance—not rank-and-file workers.

Definitions (working set; cite sources in `RECEIPTS_INDEX.md`):

- “Negligence”: Failure to act with reasonable care despite foreseeable harm.
- “Structural harm”: Sustained, predictable harm caused by system design and incentives (see SES‑01).
- “Plausible deniability”: The perception of lack of knowledge; removed when warnings are public and specific.

Method:

1) Collect receipts → `RECEIPTS_INDEX.md`
2) Log events chronologically → `TIMELINE_AI_SAFETY_2024_2026.md`
3) Tag each event with: Category, Impacted users, Claimed mitigation, Delivered mitigation, Delta (gap)
4) Mark any unresolved facts with [VERIFY]
5) Run `tools/validators/check_receipts.py` to ensure every claim is sourced
6) Publish only when [VERIFY] = 0 and all claims have a source

Structure of an Event (paste into the timeline):

```
- Date: YYYY‑MM‑DD
  Actor: <Org/Team>
  Title: <Concise headline>
  Claim: <Their public promise/position>
  Observation: <What actually shipped/failed>
  Impact: <Who/how>
  Sources:
    - <URL 1>
    - <URL 2>
  Notes: <Context, prior incidents>
  Classification: [policy|announcement|incident|remediation]
```

Editorial Standards:

- Separate “Reporting” and “Analysis” sections in any public article.
- Opinionated framing allowed only in “Analysis” and must reference the receipts.
- Use neutral verbs: “states,” “announces,” “ships,” “omits,” “acknowledges.”

Release Checklist:

- [ ] All [VERIFY] markers removed
- [ ] Each claim cites at least one primary source
- [ ] Timeline cross‑links to sources
- [ ] Risk review: no PII or doxxing; consider safety impact
- [ ] Changelog entry created under `docs/updates/`

Call for Response:

- Every publication includes a “Right to Respond” block with a contact alias and 72‑hour window for comment. Add responses verbatim with timestamps.

Linkage:

- SES‑01 (Structural Evil Specification) and SES‑02 (Repair Blueprint) provide the ethical rubric and remediation path.
