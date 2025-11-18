from tec_tgcr.models.emotion import (
    EmotionEvent,
    EmotionType,
    EventSource,
    EmotionPolicyConfig,
)
from tec_tgcr.services.emotion_pipeline import EmotionPipeline, EMOTION_PLAYLIST_MAP


def test_classification_thresholds():
    policy = EmotionPolicyConfig(vital_threshold=0.85, rage_vital_threshold=0.70)
    pipeline = EmotionPipeline(policy=policy)
    e1 = EmotionEvent(
        user_id="u1", emotion=EmotionType.happy, intensity=0.3, source=EventSource.text
    )
    e2 = EmotionEvent(
        user_id="u1", emotion=EmotionType.rage, intensity=0.72, source=EventSource.voice
    )
    e3 = EmotionEvent(
        user_id="u1",
        emotion=EmotionType.lonely,
        intensity=0.55,
        source=EventSource.text,
    )
    c1 = pipeline.ingest_event(e1)
    c2 = pipeline.ingest_event(e2)
    c3 = pipeline.ingest_event(e3)
    assert c1.value == "contextual"
    assert c2.value == "vital"
    assert c3.value == "potential"


def test_generate_creative_playlist_mapping():
    pipeline = EmotionPipeline()
    # Feed events to bias dominance toward rage + lonely
    pipeline.ingest_event(
        EmotionEvent(
            user_id="u2",
            emotion=EmotionType.rage,
            intensity=0.9,
            source=EventSource.text,
        )
    )
    pipeline.ingest_event(
        EmotionEvent(
            user_id="u2",
            emotion=EmotionType.lonely,
            intensity=0.7,
            source=EventSource.voice,
        )
    )
    artifact = pipeline.generate_creative("u2")
    assert artifact.artifact_type.value == "playlist"
    # ensure at least one mapped playlist slug corresponds
    for seed in artifact.emotion_seeds:
        assert EMOTION_PLAYLIST_MAP[seed] in artifact.metadata["playlist_slugs"]


def test_empty_events_fallback():
    pipeline = EmotionPipeline()
    artifact = pipeline.generate_creative("u-no-events")
    assert artifact.metadata["playlist_slug"] == "ambient-presence-default"
