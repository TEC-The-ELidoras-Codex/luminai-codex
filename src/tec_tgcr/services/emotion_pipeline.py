"""EmotionPipeline service stub.

Transforms EmotionEvents into CreativeArtifacts using mapping heuristics.
"""

from __future__ import annotations

from typing import Dict, List
from datetime import datetime, UTC

from tec_tgcr.models.emotion import (
    EmotionEvent,
    EmotionPolicyConfig,
    EmotionType,
    CreativeArtifact,
    ArtifactType,
    EmotionSession,
    ClassificationLevel,
)

# Static mapping (can be user-override extended later)
EMOTION_PLAYLIST_MAP: Dict[EmotionType, str] = {
    EmotionType.rage: "cathartic-metal-v1",
    EmotionType.happy: "joy-spark-synth",
    EmotionType.hungry: "metabolic-focus-lofi",
    EmotionType.horny: "embodied-presence-flow",
    EmotionType.lonely: "connective-acoustic-ember",
    EmotionType.anxious: "regulated-breath-field",
    EmotionType.playful: "playful-glitch-lab",
    EmotionType.focused: "focus-minimal-drive",
    EmotionType.sad: "comfort-warm-thrum",
}


class EmotionPipeline:
    def __init__(self, policy: EmotionPolicyConfig | None = None):
        self.policy = policy or EmotionPolicyConfig()
        self._events: Dict[str, List[EmotionEvent]] = {}
        self._artifacts: Dict[str, List[CreativeArtifact]] = {}

    def ingest_event(self, event: EmotionEvent) -> ClassificationLevel:
        # Re-classify with current policy (supports dynamic threshold updates)
        event.classification = self.policy.classify(event.emotion, event.intensity)
        self._events.setdefault(event.user_id, []).append(event)
        return event.classification

    def _active_session(self, user_id: str) -> EmotionSession:
        events = self._events.get(user_id, [])[-50:]  # last 50 events window
        return EmotionSession(user_id=user_id, events=events)

    def generate_creative(self, user_id: str) -> CreativeArtifact:
        session = self._active_session(user_id)
        seeds = session.dominant_emotions or []
        if not seeds:
            # Fallback ambient artifact
            artifact = CreativeArtifact(
                user_id=user_id,
                artifact_type=ArtifactType.playlist,
                emotion_seeds=[],
                metadata={
                    "playlist_slug": "ambient-presence-default",
                    "note": "No recent emotion events; offering gentle ambient space",
                },
            )
            return self._store_artifact(user_id, artifact)
        # Build composite playlist suggestions
        playlist_slugs = [
            EMOTION_PLAYLIST_MAP.get(e, "ambient-presence-default") for e in seeds
        ]
        artifact = CreativeArtifact(
            user_id=user_id,
            artifact_type=ArtifactType.playlist,
            emotion_seeds=seeds,
            metadata={
                "playlist_slugs": playlist_slugs,
                "mapping_version": self.policy.mapping_version,
                "generated_at": datetime.now(UTC).isoformat(),
            },
        )
        return self._store_artifact(user_id, artifact)

    def _store_artifact(
        self, user_id: str, artifact: CreativeArtifact
    ) -> CreativeArtifact:
        self._artifacts.setdefault(user_id, []).append(artifact)
        return artifact

    def recent_events(self, user_id: str) -> List[EmotionEvent]:
        return list(self._events.get(user_id, []))

    def artifacts(self, user_id: str) -> List[CreativeArtifact]:
        return list(self._artifacts.get(user_id, []))
