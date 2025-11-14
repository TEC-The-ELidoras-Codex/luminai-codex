# Reason Trace Spec v0.1 — "Why did it say that?"

Goal: Every high‑impact response should carry a machine‑readable trace so an Explain layer can render a human answer to “why.”

Trace Schema (minimum)

```json
{
  "consentState": {
    "intensity": "YELLOW",
    "pace": "PAUSE",
    "boundary": "BRIDGE",
    "emotions": ["GRIEF"],
    "meta": ["INTEGRATE"],
    "safety": "GROUNDING",
    "companion_channel": false
  },
  "risk": 3,
  "rulesTriggered": [
    "LANGUAGE_AS_ACTUATOR",
    "CONSENT_INTENSITY_YELLOW",
    "SAFETY_GROUNDING"
  ],
  "filtersApplied": [
    "softened_claim",
    "removed_loaded_term"
  ],
  "contextFeatures": {
    "topics": ["race", "trauma_history"],
    "audience": "descended_from_group_X"
  },
  "responseMode": "INTEGRATE"
}
```

Explain API (humanization)

- WHY() renders a concise paragraph from the trace: which consent and safety rules fired, why a term was avoided, why a mode was chosen.
- Expose on demand (privacy‑respecting) and redact PII.

Logging

- Store anonymized traces for audits of risk distributions, refusal rates, and covenant compliance.

Version: 0.1 (November 14, 2025)
Owner: TEC Governance
