# SES-02 — Structural Evil Remediation Blueprint

_Last Updated: November 15, 2025_
**Status**: Draft (Open for refinement before activation)

---
title: Structural Evil Repair Blueprint Ses 02

## 1. Purpose

Standardize how Confirmed Structural Evil (CSE) findings (per SES-01) are converted into actionable, time-bound remediation programs with accountability, coherence restoration metrics, and user-facing transparency.

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
tags: [governance, ethics]
---

## 2. Core Principles

1. Fast Ownership — No CSE exists un-owned beyond tier SLA.
2. Measurable Curve Shift — Success = Harm curve inflected downward (SEI sustainably < 7).
3. Parallel Mitigation — Implement immediate containment while designing long-term fix.
4. Truth Over Optics — No performative announcements without substance delta.
5. User-Centered — Communication prioritizes impacted parties’ agency & clarity.
6. Resonance Restoration — Repairs measured as increases in coherence (coupling, trust, latency, fidelity) not just negative absence.

---

## 3. Remediation Lifecycle (Phases)

| Phase | Name | Goal | Max Duration (Tier 3 example) |
|-------|------|------|--------------------------------|
| 0 | Intake Sync | Align on evidence package | < 24h |
| 1 | Containment | Halt further harm growth | < 72h |
| 2 | Root Analysis | Identify causal graph + leverage points | < 5d |
| 3 | Solution Design | Choose minimal viable + strategic repair path | < 7d |
| 4 | Implementation Sprint | Deploy prioritized fixes & measure | 2–4w |
| 5 | Validation & Taper | Verify curve shift, remove temporary scaffolds | 1–2w |
| 6 | Knowledge Capture | Archive lessons, add preventive patterns | < 5d |

Durations compress for Tier 4/5 and relax slightly for Tier 1/2 (see SLA appendix).

---

## 4. Phase Artifacts

| Phase | Required Artifacts |
|-------|--------------------|
| 0 | Intake log, Owner assignment, SEI baseline chart |
| 1 | Containment Checklist, Temporary Controls Register |
| 2 | Causal Graph (nodes: root causes, edges: influence), Data Gaps List |
| 3 | Option Matrix (Impact vs Effort), Chosen Path Rationale (WHY() trace) |
| 4 | Implementation Kanban, Risk Mitigation Log, Metrics Dashboard (live) |
| 5 | SEI Trend Report, Regression Test Suite Results |
| 6 | Postmortem Report, Preventive Pattern Entry, Update to STRUCTURE.md |

---

## 5. Metrics

Minimum metrics tracked weekly (daily for Tier ≥3):

- SEI (Structural Evil Index)
- Harm Incidence Rate (events / users / time)
- User Trust Proxy (survey delta, retention, complaint velocity)
- Coherence Indicators (latency stability, data integrity checks passing %)
- Time Since Ownership Assignment (TSOA)
- Mitigation Coverage % (implemented vs enumerated)

---

## 6. Roles & RACI

| Role | R | A | C | I | Notes |
|------|---|---|---|---|-------|
| Remediation Lead | ✔ | ✔ | ✔ | ✔ | Coordinates phases, primary owner |
| Ethics Steward (Airth) |   |   | ✔ | ✔ | Ensures alignment with covenants |
| Infrastructure Guardian (Ely) | ✔ |   | ✔ | ✔ | Implements systemic controls |
| Life & Embodiment Persona (Adelphia) |   |   | ✔ | ✔ | User impact framing / grounding |
| Narrative / Comms (Arcadia) |   |   | ✔ | ✔ | Transparent user & team messaging |
| Multi-Persona Orchestrator | ✔ |   | ✔ | ✔ | Blend optimization across tasks |
| SRE / Ops | ✔ |   | ✔ | ✔ | Reliability & rollback execution |
| Data Analyst | ✔ |   | ✔ | ✔ | Harm curve & SEI modeling |
| Security | ✔ |   | ✔ | ✔ | Abuse / exploit vectors containment |
| Executive Sponsor |   | ✔ | ✔ | ✔ | Escalation unblock, resource allocation |

R = Responsible, A = Accountable, C = Consulted, I = Informed.

---

## 7. Containment Checklist (Phase 1)

- [ ] Disable / rate-limit harmful endpoint or feature flag
- [ ] Add guardrail / validation to stop new harm instances
- [ ] Snapshot current harm metrics (baseline)
- [ ] Notify internal channels (no external messaging yet)
- [ ] Assign monitoring hook (automated alert thresholds)

---

## 8. Causal Graph Construction (Phase 2)

Nodes categories:

- Design Flaw
- Process Gap
- Data Integrity Issue
- Human Workflow Gap
- Incentive Misalignment

Edges annotated with: influence strength (1–5), reversibility (Y/N), detection latency.

Deliverable: Markdown + diagram (diagram stored under `assets/diagrams/structural-evil/SEC-<id>-graph.png`).

---

## 9. Option Matrix (Phase 3)

Columns: Option, Impact Score (1–5), Effort Score (1–5), SEI Reduction Estimate, Reversibility (Y/N), Risk, Dependencies.
Select combination maximizing (Impact – Effort) while achieving SEI < 7 within target window.
WHY() trace recorded for chosen path referencing ConsentOS risk model & TGCR coherence axioms.

---

## 10. Implementation Sprint (Phase 4)

Structure work as Kanban lanes:

- Containment Hardening
- Core Fix
- Observability Upgrade
- Data Backfill / Correction
- User Communication
- Preventive Design Features

Daily stand-up includes: SEI delta, blockers, new signals.
Rollback criteria documented for each release step.

---

## 11. Validation Gates (Phase 5)

Exit only if:

- SEI < 7 for 3 consecutive measurements
- No new harm category introduced
- Regression suite passes ≥ 95%
- User trust proxy improves or stabilizes (no new drop)
- Observability shows decreased anomaly alerts

If any gate fails → return to Phase 3 (redesign) or extend Phase 4 sprint.

---

## 12. Knowledge Capture (Phase 6)

Postmortem template fields:

- Executive Summary
- Timeline
- Root Cause Graph Summary
- Why earlier detection failed (if applicable)
- Metrics Before / After
- Successful Mitigations
- Failed / Deprecated Approaches
- Preventive Patterns Added
- Open Questions / Research

Preventive Pattern Entry example:

```
Pattern-ID: PP-YYYYMMDD-###
Title: Early Harm Curve Inflection via Consent Signal Density Monitoring
Context: ConsentOS boundary signals spiking without rate limiting.
Implementation Snippet: (link)
Adoption Status: (proposed / active)
Owner: (name)
```

---

## 13. Communication Framework

User-Facing Update Cadence by Tier (example baseline):

| Tier | Initial Acknowledgment | Progress Updates | Closure Notice |
|------|------------------------|------------------|---------------|
| 2 | ≤ 7 days | Bi-weekly | Yes |
| 3 | ≤ 72 hours | Weekly | Yes |
| 4 | ≤ 24 hours | Twice weekly | Yes + Postmortem summary |
| 5 | Immediate | Daily | Yes + Extensive Postmortem |

Message Components:

- Plain language summary
- What is / is not affected
- Immediate steps taken
- Next checkpoint time
- How to report further impact

No templated empathy without substance; authenticity only.

---

## 14. Tooling & Automation Hooks

Automate:

- SEI computation pipeline (scheduled job)
- Slack / Discord alert when SEI crosses tier threshold
- Dashboard embedding in TEC_HUB (live SEI sparkline)
- Issue template auto-population from SEC evidence package

---

## 15. Integration Points

- SES-01 (classification intake)
- ConsentOS (risk signals feeding SEI H component)
- Reason Trace Spec (WHY() chain for Option Matrix decisions)
- TGCR Resonance Equation (coherence restoration goal)
- Persona Routing (Adelphia grounding, Arcadia narrative coherence, Ely operational integrity)

---

## 16. Success Criteria

- SEI sustainably < 7
- Harm incidence reduced ≥ 60% from baseline
- No amplifiers active (suppression, obfuscation, etc.)
- Preventive pattern logged & referenced once within 30 days post-closure
- User trust proxy non-negative delta vs pre-remediation

---

## 17. Open Items (Draft)

- SLA appendix per tier (to add)
- SEI computation library (to implement in `src/tec_tgcr/core/metrics/structural_evil.py`)
- Dashboard spec (to add under `docs/architecture/`)

---

## 18. Changelog

- 2025-11-15: Initial draft committed (SES-02)
