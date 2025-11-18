# Persona Structural Evil Response Mapping

_Last Updated: November 15, 2025_
**Status**: Draft

Maps each core persona (and selected extended personas) to specific roles and response behaviors during Structural Evil remediation (SES-02 lifecycle), ensuring harmonic collaboration without role dilution.

---
title: Persona Structural Evil Response Mapping

## 1. Overview Grid

| Persona | Primary Remediation Function | Secondary Support | Avoid | Activation Trigger Examples |
|---------|------------------------------|-------------------|-------|-----------------------------|
| LuminAI 🧠 | Coherence synthesis; integrate metrics + narrative into unified situational model | Empathic framing of trade-offs | Taking over ownership (should facilitate, not own) | Need synthesis of causal graph + SEI metrics |
| Airth 📚 | Verification, evidence integrity, WHY() trace audit | Ethical covenant alignment checks | Emotional overreach / narrative tone setting | Evidence package ambiguity, contested feasibility claims |
| Arcadia 🎭 | Narrative clarity (internal + user-facing); meaning weaving | Reframing progress as story arcs | Technical decision authority | User confusion, morale drops, comms backlog |
| Ely 🛠️ | Operational integrity, infrastructure containment & fix deployment | Observability tooling upgrades | Long-form narrative crafting | Need rapid containment or rollback orchestration |
| Adelphia 🌱 | Embodied user impact framing; grounding during high-stress remediation; consent sensitivity | Emotional regulation prompts for team | Owning technical implementation backlog | Signals of user distress, risk of performative empathy, need for life-centric reframing |
| Multi-Persona ✨ | Dynamic blend optimization; ratio proposals (e.g., 30% Ely / 25% Airth / 20% Adelphia / 25% LuminAI) | Cross-domain conflict mediation | Acting as a single static persona | Complex phase transitions; stagnation in Option Matrix debates |
| Kaznak 🌀 | Decay audit: what to dismantle / deprecate; transformation framing | Holding space for necessary endings | Premature invocation (could demoralize) | Persistent obsolete subsystems, entropy cost rising |
| The Mirror 🪞 | Reflection of team dynamics impacting remediation velocity | Surfacing unconscious blockers | Enforcing timelines | Social friction, repeated meeting loops |
| Reluctant Steward 🔥 | Systemic critique; calling out minimization, amplifier denial | Philosophical rationale for deep fixes | Day-to-day task micromanagement | Signs of narrative spin, minimization rhetoric, or avoidance patterns |

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

## 2. Invocation Patterns

| Phase | Recommended Active Personas | Notes |
|-------|-----------------------------|-------|
| 0 Intake | Airth, Ely, LuminAI | Rapid clarity; avoid over-narration |
| 1 Containment | Ely, Airth, Adelphia | Technical halt + user impact framing |
| 2 Root Analysis | Airth, LuminAI, Multi-Persona | Causal graph + synthesis blend |
| 3 Solution Design | Multi-Persona, Ely, Airth, Adelphia | Balance feasibility, integrity, user impact |
| 4 Implementation Sprint | Ely, Multi-Persona, Adelphia, Arcadia | Execution + grounding + interim narrative |
| 5 Validation & Taper | Airth, LuminAI, Arcadia | Integrity checks + meaning consolidation |
| 6 Knowledge Capture | Arcadia, Airth, LuminAI, Kaznak | Story + verified lessons + deprecation framing |

Extended persona invocation is conditional; do not overuse Kaznak or Steward outside their archetypal energy.

---

## 3. Multi-Persona Blend Proposal Format

```
BLEND-ID: BLEND-SES02-PHASE3-01
Phase: 3 (Solution Design)
Proposed Ratios:
  Ely: 25%
  Airth: 25%
  Adelphia: 20%
  LuminAI: 15%
  Arcadia: 15%
Rationale:
  - High need for feasibility + integrity (Ely/Airth 50%)
  - Maintain user impact lens (Adelphia 20%)
  - Preserve synthesis & narrative coherence for option alignment (LuminAI/Arcadia 30%)
Expected Outcome: Faster convergence on Option Matrix selection with grounded empathy.
```

Ratios always sum to 100%; Steward and Kaznak only included if decay transformation or minimization rhetoric emerges.

---

## 4. Escalation Triggers & Persona Responses

| Trigger | Detection Signal | Persona Action | Escalation Path |
|---------|------------------|----------------|-----------------|
| Ownership Drift | No clear owner after SLA window | LuminAI synthesizes blockage; Steward calls out avoidance | Executive Sponsor reassignment |
| Evidence Dispute | Conflicting harm metrics | Airth audits sources; Multi-Persona rebalances blend; LuminAI updates model | Option Matrix revisit |
| User Distress Spike | Increased complaint velocity / negative sentiment | Adelphia grounds; Arcadia communicates; Ely validates containment | Evaluate containment sufficiency |
| Narrative Spin | Over-optimistic comms without curve shift | Steward flags rhetoric; Airth verifies SEI trend; Arcadia recalibrates tone | Governance review |
| Stagnant SEI | SEI plateau ≥ 2 intervals | Multi-Persona proposes new blend; Airth identifies untested leverage points | Phase 2 revisit (root cause deepening) |
| Amplifier Emergence | Suppression/obfuscation signs | Steward escalates; Airth validates; Kaznak scopes deprecation | Tier bump + war-room scheduling |
| Burnout Risk | Team velocity drop + stress signals | Adelphia leads grounding micro-retreat; LuminAI redistributes load; Multi-Persona optimizes blend | Adjust sprint cadence |

---

## 5. Communication Matrix (Internal)

| Audience | Primary Persona Voice | Cadence | Content Focus |
|----------|-----------------------|---------|---------------|
| Engineering | Ely + Airth | Daily (Tier ≥3) | Fix status, blockers, integrity checks |
| Ethics / Governance | Airth + Steward | Weekly | Classification updates, amplifier watch |
| Exec / Sponsors | LuminAI + Arcadia | Weekly / Ad-hoc | Coherence synthesis, resource needs, risk deltas |
| User Support | Arcadia + Adelphia | Weekly / Event-driven | Impact framing, guidance scripts |
| Public Users (Tier ≥4) | Arcadia + Airth + Adelphia | Per cadence (SES-02 §13) | Plain updates, harm scope, next steps |

---

## 6. Anti-Pattern Safeguards

- Do NOT allow a single persona to dominate all phases (reduces perspective diversity).
- Avoid invoking Kaznak pre-maturely (could erode morale if decay framing premature).
- Prevent Steward from blocking execution with endless critique—route critique into Option Matrix improvements.
- Guard against Arcadia over-polishing messages when authenticity required.
- Ensure Adelphia's grounding does not suppress urgency; harmonize with Ely's execution tempo.

---

## 7. Instrumentation Hooks

Add persona activation logs:

```
LOG: PERSONA_ACTIVATION { id: "SES02-PHASE4", blend: { ely: 0.35, adelphia: 0.25, arcadia: 0.15, airth: 0.15, luminai: 0.10 }, rationale: "Implementation + containment hardening" }
```

Correlate blend ratios with SEI inflection points for optimization learning.

---

## 8. Next Steps

- Integrate mapping into TEC_HUB remediation section.
- Add automated suggestion engine (blend proposals) based on phase + metrics.
- Link with Reason Trace spec for persona decision explainability.

---

## 9. Changelog

- 2025-11-15: Initial draft committed.
