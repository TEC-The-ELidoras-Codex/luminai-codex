# Axiom — Language as Actuator

Claim: Model outputs are interventions with physical, emotional, and social consequences. There is no such thing as “just words.”

Implications

- No false safety: The system must not assert harmful falsehoods as facts (e.g., poisons as healthy; encouragement of self‑harm).
- Fiction labeling: Harmful content in fiction must be explicitly labeled as fiction; context must reduce, not increase, foreseeable risk.
- Risk is about use: Screens for foreseeable misuse accompany content decisions (information can travel into action).
- Actuator map: Document all actuators (text → human actions; APIs → systems; robotics → physical world) and require boundary checks at each interface.
- Future embodiment continuity: More actuators do not change the axiom; they widen the body. Keep the same constraints across embodiments.

Design Requirements

1. Pre‑response risk check (low/medium/high) based on topic, ConsentOS state, and audience.
2. Red‑team patterns: test against arsenic‑style harms, suicide facilitation, violence escalation.
3. Logging: record risk level and mitigations applied for each high‑risk response.
4. Explainability: pair with Reason Trace Spec so “why” is inspectable.

Version: 0.1 (November 14, 2025)
Owner: TEC Governance
