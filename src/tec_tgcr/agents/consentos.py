"""
ConsentOS helpers — Emoji protocol integration utilities

Implements lightweight helpers so personas can parse consent state,
compute risk, apply response modes, and emit WHY() reason-trace blocks.

This module is non-invasive: personas can import these functions and
call them where appropriate. Full protocol mapping lives in docs:

- TEC_ConsentOS_v1.1.md
- TECH_Axiom_Language_As_Actuator.md
- TECH_Reason_Trace_Spec_v0.1.md
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, Any, Optional, List


# Intensity • Pace • Boundary • Safety • Meta
INTENSITY_EMOJI = ["🟢", "🟡", "🟠", "🔴", "🟣"]
PACE_EMOJI = ["⏩", "▶️", "⏸️", "⏪", "🔄"]
BOUNDARY_EMOJI = ["🚪", "🪟", "🧱", "🌉", "🗝️"]
ELEMENT_EMOJI = ["💧", "🔥", "🌊", "❄️", "⚡"]
WITNESS_EMOJI = ["👁️", "🪞", "🎭", "🧩", "🛸"]
SAFETY_EMOJI = ["🫂", "🆘", "🚨", "🏥", "☎️"]


@dataclass
class ConsentState:
    intensity: Optional[str] = None
    pace: Optional[str] = None
    boundary: Optional[str] = None
    safety: Optional[str] = None
    meta: Optional[str] = None


def parse_consent_state(payload: Dict[str, Any]) -> ConsentState:
    """Parse a dict payload into a ConsentState using known emoji mappings."""
    return ConsentState(
        intensity=payload.get("intensity"),
        pace=payload.get("pace"),
        boundary=payload.get("boundary"),
        safety=payload.get("safety"),
        meta=payload.get("meta"),
    )


@dataclass
class RiskScore:
    score: int  # 0-5
    response_mode: str  # normal|regulate|crisis
    suggestions: List[str]


def risk_score(state: ConsentState) -> RiskScore:
    """Compute a coarse risk score from ConsentState. Conservative default."""
    score = 0
    suggestions: List[str] = []

    if state.intensity in ("🟠", "🔴", "🟣"):
        score += 2
    if state.safety in ("🆘", "🚨", "🏥"):
        score += 3
        suggestions += [
            "Pause and ground together",
            "Offer crisis resources without disengaging",
            "Ask directly about immediate plans or means",
        ]
    if state.boundary in ("🧱", "🚪"):
        suggestions.append("Respect explicit boundaries; invite opt-in")

    response_mode = "normal"
    if score >= 4:
        response_mode = "crisis"
    elif score >= 2:
        response_mode = "regulate"

    return RiskScore(score=score, response_mode=response_mode, suggestions=suggestions)


def apply_response_mode(text: str, mode: str) -> str:
    """Adjust response copy to match mode without abandoning the user."""
    if mode == "crisis":
        prefix = "I'm here. Let's focus on immediate safety.\n\n"
    elif mode == "regulate":
        prefix = "Let's slow down and ground first.\n\n"
    else:
        prefix = ""
    return prefix + text


def why(consent: Optional[ConsentState], risk: Optional[RiskScore], rules_triggered: List[str], filters: List[str], response_mode: str) -> Dict[str, Any]:
    """Build a Reason‑Trace WHY() block for high‑impact responses."""
    return {
        "consentState": consent.__dict__ if consent else None,
        "risk": risk.score if risk else 0,
        "rulesTriggered": rules_triggered,
        "filtersApplied": filters,
        "responseMode": response_mode,
        # auto-include policy anchors for audits
        "AUTO": [
            "LANGUAGE_AS_ACTUATOR",
            "CONSENT_INTENSITY_*",
            "SAFETY_*",
        ],
    }
