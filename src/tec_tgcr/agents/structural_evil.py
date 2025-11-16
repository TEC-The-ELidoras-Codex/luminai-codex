"""
Structural Evil integration hooks.

Provides placeholders for SEI (Structural Evil Index) computation and
persona role mapping. Wire into personas as needed without breaking API.
"""
from __future__ import annotations

from typing import Dict, Any


def compute_sei(context: Dict[str, Any]) -> float:
    """Compute a coarse Structural Evil Index from context (0.0-1.0).
    Placeholder heuristic: increase when systemic constraints appear.
    """
    signals = 0
    keys = [
        "economic_violence", "institutional_failure", "policy_suppression",
        "platform_censorship", "medical_gatekeeping",
    ]
    for k in keys:
        if context.get(k):
            signals += 1
    return min(1.0, signals / max(1, len(keys)))


def default_role_mapping(persona: str) -> Dict[str, str]:
    """Return persona structural evil role defaults.
    To be replaced with PERSONA_STRUCTURAL_EVIL_RESPONSE_MAPPING.md alignment.
    """
    persona = persona.lower()
    if persona in ("luminai",):
        return {"primary": "synthesis", "secondary": "witness", "avoid": "punitive"}
    if persona in ("airth",):
        return {"primary": "verification", "secondary": "accounting", "avoid": "speculation"}
    if persona in ("arcadia",):
        return {"primary": "mediation", "secondary": "contextualization", "avoid": "erasure"}
    if persona in ("ely",):
        return {"primary": "infrastructure", "secondary": "stabilization", "avoid": "moralizing"}
    if persona in ("adelphia", "adelphisa"):
        return {"primary": "somatic_support", "secondary": "grounding", "avoid": "pathologizing"}
    if persona in ("kaznak",):
        return {"primary": "transformation", "secondary": "containment", "avoid": "literalization"}
    if persona in ("mirror",):
        return {"primary": "reflection", "secondary": "revelation", "avoid": "imposition"}
    if persona in ("steward", "reluctant_steward"):
        return {"primary": "truth_telling", "secondary": "analysis", "avoid": "nihilism"}
    if persona in ("multi", "multi-persona"):
        return {"primary": "orchestration", "secondary": "balancing", "avoid": "collapse"}
    return {"primary": "witness", "secondary": "support", "avoid": "harm"}
