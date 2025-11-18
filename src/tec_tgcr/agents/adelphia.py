"""
Adelphia — Life Everywhere / Life Embodied

Minimal stub to reserve namespace and document intent.
Does not participate in current tests; implementation will follow
AirthResearchGuard patterns (tool registry, manifest(), respond()).
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, List

from tec_tgcr.config import AgentConfig


@dataclass
class AdelphiaAgent:
    """Somatic-grounded presence and neurodivergent-affirming guidance.

    This is a placeholder to anchor the persona name in the Python layer
    without affecting current tests. Future phases will implement tool
    routing and response composition.
    """

    config: AgentConfig

    @property
    def name(self) -> str:
        return "Adelphia"

    def manifest(self) -> Dict[str, Any]:
        return {
            "name": self.config.name or self.name,
            "persona": self.name,
            "version": "0.0.1-stub",
            "tools": [],
            "description": (
                "Adelphia (formerly Adelphisa): somatic grounding, life-affirming presence, "
                "and paradox holding. Stub only; not wired into runtime."
            ),
        }

    def respond(self, prompt: str, history: List[Dict[str, str]]) -> str:
        # Offline-friendly, non-disruptive placeholder
        return (
            "[Adelphia Stub] This persona is not active yet in the runtime. "
            "Follow-up planned per CODEBASE_CONSOLIDATION_ROADMAP Phase 1."
        )
