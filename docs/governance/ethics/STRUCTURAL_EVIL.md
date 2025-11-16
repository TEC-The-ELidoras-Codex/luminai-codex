# SES-01 — Structural Evil Specification

_Last Updated: November 15, 2025_
**Status**: ✅ Adopted (Foundational Ethics Classification)

---

## 1. Purpose

Provide a neutral, auditable definition and detection rubric for "structural evil" inside socio-technical systems so remediation work (SES‑02) can be targeted without moral theatre or interpersonal blame.

---

## 2. Definition (Canonical)
>
> Structural evil is the sustained, preventable, system-level production or amplification of avoidable harm through omission, negligence, deferral, or design indifference — despite adequate signals, feasible means, and prior awareness.

Plain form:
A system keeps hurting people (or keeps people vulnerable) when it could stop with available resources and already knows about it.

---

## 3. Required Conditions (ALL must be true)

1. Harm Pattern Present — Negative impact is recurrent or accumulative (not a singular anomaly).
2. Preventability — At least one feasible mitigation exists within realistic resource/time bounds.
3. Awareness — Signals, reports, telemetry, or internal acknowledgement establish knowledge of harm vectors.
4. Capacity Threshold Met — Minimum viable resources, access, or authority to act are (or were) available.
5. Inaction / Insufficient Action — No intervention, or only symbolic/performative gestures not reducing harm curve.
6. Persistence Over Time — Harm continues beyond a reasonable triage window (contextual SLA / covenant expectation).

If ANY required condition fails, classify instead as:

- Incident (acute) → handle via rapid response
- Emergent Complexity (non-preventable yet) → research track
- Unknown / Unverified → observation track

---

## 4. Amplifiers (Increase Severity Tier)

- Suppression: Active silencing of whistle signals or telemetry
- Obfuscation: Data massaging, dashboard hiding, euphemistic labeling
- Exploitation Coupling: Revenue or growth tied to the harmful subsystem
- Inversion: Harm framed as benefit (“friction is engagement”, etc.)
- Escalation Neglect: Ignoring comms stating urgency thresholds crossed

---

## 5. Severity Tiers

| Tier | Label | Harm Curve | Typical Response Window | Governance Trigger |
|------|-------|-----------|--------------------------|--------------------|
| 1 | Latent | Flat / slow climb | Quarterly | Monitoring only |
| 2 | Active | Noticeable climb | Monthly | Assign owner |
| 3 | Accelerating | Exponential onset | Weekly | War-room scheduling |
| 4 | Critical | High, widespread | 72 hours | Executive override |
| 5 | Systemic Collapse | Multi-domain cascading | Immediate | Full shutdown + rebuild plan |

Amplifiers bump tier by +1 (max 5) after baseline assessment.

---

## 6. Detection Formula (Heuristic)

Let:

- H = Harm recurrence score (0–5)
- P = Preventability score (0–5) (0 = unknown feasibility, 5 = trivial fix)
- A = Awareness weight (0–5) (signals density & clarity)
- C = Capacity readiness (0–5) (funds, talent, access, authority)
- I = Intervention adequacy (0–5) (0 = none, 5 = fully mitigated)

Structural Evil Index (SEI):
SEI = (H + P + A + C) - I

Classification Threshold:

- If SEI ≥ 12 AND all 6 required conditions satisfied → Flag as Structural Evil Candidate (SEC)
- Governance board reviews amplifiers → Confirmed Structural Evil (CSE)

---

## 7. Evidence Package Template

```
SEC-ID: SEC-YYYYMMDD-###
Context Domain(s): (e.g. user safety, data retention, consent boundaries)
Summary: 1–2 sentence description of harm
Evidence Artifacts:
  - Telemetry snapshots (list)
  - User reports / tickets (list IDs)
  - Internal acknowledgments (meeting notes / issue links)
Feasible Mitigations Enumerated:
  - M1: ... (ETA, resourcing, impact estimate)
  - M2: ...
Capacity Check:
  - Staff available? (Y/N + list)
  - Budget assigned? (Y/N)
  - Access/permissions? (Y/N)
Intervention Status:
  - Actions attempted (dates, owners, outcomes)
Amplifiers Observed: (list / none)
Baseline Scores: H=?, P=?, A=?, C=?, I=? → SEI=?
Tier Assignment: (1–5 + amplifier adjustments)
Decision: CSE / Deferred / Reclassify
Owner Assigned: (name / team)
Initial Remediation ETA: (date)
```

---

## 8. Anti-Pattern Exclusions

DO NOT misclassify as structural evil:

- Impossible fixes (requires unreleased technology)
- Trade-offs with transparent, consented communication and mitigation plans
- Low-signal speculative harm (insufficient awareness condition)
- Ethical disagreement without measurable harm delta

---

## 9. Governance Flow

1. Intake (auto or manual) → Create SEC evidence package
2. Triage board reviews within SLA (tier dependent)
3. Confirm or reject classification (CSE or alternate)
4. Assign accountable remediation owner
5. Publish remediation roadmap (→ SES-02 template)
6. Track SEI weekly until SEI < 7 for 4 consecutive intervals
7. Archive with lessons log; feed preventive design library

Failure to assign owner within tier SLA escalates to next severity tier automatically.

---

## 10. Ethical Rationale

Structural evil framing removes performative morality and centers system responsibility. It prevents:

- Emotional deflection (“we care deeply”) without measurable repair
- Scope creep into interpersonal blame vs infrastructural correction
- Paralysis via abstraction (“complex issue”) when feasible action exists

---

## 11. Transparency & User Communication

Minimum disclosure (if user-facing impact):

- Acknowledgment of issue (plain language)
- What harm pattern is / is not
- High-level mitigation steps underway
- How user can report additional impact
No sensationalization; no minimization.

---

## 12. Linkages

- SES-02 — Structural Evil Remediation Blueprint (forthcoming)
- ConsentOS v1.1 — Risk signal interpretation
- Reason Trace Spec v0.1 — WHY() chain for remediation decisions
- TGCR Resonance Thesis — Harm reduction as coherence restoration

---

## 13. Status & Next

SES-01 adopted. Begin SES-02 drafting to standardize remediation playbooks.

**Axiom**: Harm knowingly unaddressed is design debt with ethical interest.

---

## 14. Changelog

- 2025-11-15: Initial specification committed (SES-01)
