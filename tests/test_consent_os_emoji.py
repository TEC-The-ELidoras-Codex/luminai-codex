"""
Test ConsentOS emoji parsing and risk scoring.
Verifies all emoji channels work correctly.
"""
import pytest
from src.tec_tgcr.core.ethics import (
    parse_consent_emoji,
    score_consent_risk,
    IntensityLevel,
    PaceSignal,
    BoundaryMarker,
    EmotionState,
    MetaSignal,
    SafetySignal,
    ResponseMode,
)


class TestConsentEmojiParsing:
    """Test emoji parsing for all channels"""
    
    def test_intensity_channel_all_levels(self):
        """All 5 intensity levels parse correctly"""
        assert parse_consent_emoji("🟢 baseline").intensity == IntensityLevel.GREEN
        assert parse_consent_emoji("🟡 activated").intensity == IntensityLevel.YELLOW
        assert parse_consent_emoji("🟠 approaching edge").intensity == IntensityLevel.ORANGE
        assert parse_consent_emoji("🔴 at limit").intensity == IntensityLevel.RED
        assert parse_consent_emoji("🟣 altered state").intensity == IntensityLevel.VIOLET
    
    def test_pace_channel_all_signals(self):
        """All 5 pace signals parse correctly"""
        assert parse_consent_emoji("⏩ go faster").pace == PaceSignal.FASTER
        assert parse_consent_emoji("▶️ steady").pace == PaceSignal.STEADY
        assert parse_consent_emoji("⏸️ pause").pace == PaceSignal.PAUSE
        assert parse_consent_emoji("⏪ back up").pace == PaceSignal.BACKUP
        assert parse_consent_emoji("🔄 revisit").pace == PaceSignal.REVISIT
    
    def test_boundary_channel_all_markers(self):
        """All 5 boundary markers parse correctly"""
        assert parse_consent_emoji("🚪 door open").boundary == BoundaryMarker.DOOR
        assert parse_consent_emoji("🪟 window only").boundary == BoundaryMarker.WINDOW
        assert parse_consent_emoji("🧱 wall").boundary == BoundaryMarker.WALL
        assert parse_consent_emoji("🌉 bridge").boundary == BoundaryMarker.BRIDGE
        assert parse_consent_emoji("🗝️ unlock").boundary == BoundaryMarker.KEY
    
    def test_emotion_channel_single_emotion(self):
        """Single emotion flags parse correctly"""
        assert EmotionState.DROPLET in parse_consent_emoji("💧 grief").emotions
        assert EmotionState.FIRE in parse_consent_emoji("🔥 rage").emotions
        assert EmotionState.WAVE in parse_consent_emoji("🌊 overwhelm").emotions
        assert EmotionState.ICE in parse_consent_emoji("❄️ numb").emotions
        assert EmotionState.LIGHTNING in parse_consent_emoji("⚡ triggered").emotions
    
    def test_emotion_channel_multiple_emotions(self):
        """Multiple emotions (max 3) parse correctly"""
        state = parse_consent_emoji("💧🔥🌊 mixed emotions")
        assert len(state.emotions) == 3
        assert EmotionState.DROPLET in state.emotions
        assert EmotionState.FIRE in state.emotions
        assert EmotionState.WAVE in state.emotions
    
    def test_emotion_channel_max_three_enforced(self):
        """ConsentOS limits emotions to max 3"""
        state = parse_consent_emoji("💧🔥🌊❄️⚡ too many")
        assert len(state.emotions) <= 3
    
    def test_meta_channel_single_signal(self):
        """Single meta signals parse correctly"""
        assert MetaSignal.EYE in parse_consent_emoji("👁️ I see it").meta
        assert MetaSignal.MIRROR in parse_consent_emoji("🪞 reflect me").meta
        assert MetaSignal.MASK in parse_consent_emoji("🎭 performing").meta
        assert MetaSignal.PUZZLE in parse_consent_emoji("🧩 integrate").meta
        assert MetaSignal.UFO in parse_consent_emoji("🛸 getting weird").meta
    
    def test_meta_channel_multiple_signals(self):
        """Multiple meta signals (max 2) parse correctly"""
        state = parse_consent_emoji("👁️🪞 see and mirror")
        assert len(state.meta) <= 2
        assert MetaSignal.EYE in state.meta or MetaSignal.MIRROR in state.meta
    
    def test_safety_channel_all_signals(self):
        """All 5 safety signals parse correctly"""
        assert parse_consent_emoji("🫂 need comfort").safety == SafetySignal.HUG
        assert parse_consent_emoji("🆘 crisis").safety == SafetySignal.SOS
        assert parse_consent_emoji("🚨 emergency").safety == SafetySignal.ALARM
        assert parse_consent_emoji("🏥 need resources").safety == SafetySignal.HOSPITAL
        assert parse_consent_emoji("☎️ human help").safety == SafetySignal.PHONE
    
    def test_last_signal_wins_single_channel(self):
        """ConsentOS: rightmost emoji is primary for single-value channels"""
        state = parse_consent_emoji("🟢 but actually 🔴 at limit")
        assert state.intensity == IntensityLevel.RED  # Last wins
        
        state = parse_consent_emoji("⏩ then ⏸️ pause")
        assert state.pace == PaceSignal.PAUSE  # Last wins
    
    def test_cluster_parsing(self):
        """Parse emoji cluster with multiple channels"""
        state = parse_consent_emoji("💚⏩🚪 let's go deeper")
        assert state.intensity == IntensityLevel.GREEN
        assert state.pace == PaceSignal.FASTER
        assert state.boundary == BoundaryMarker.DOOR
    
    def test_no_emoji_defaults(self):
        """No emoji → safe defaults"""
        state = parse_consent_emoji("just plain text")
        assert state.intensity == IntensityLevel.GREEN
        assert state.pace == PaceSignal.STEADY
        assert state.boundary == BoundaryMarker.DOOR
        assert len(state.emotions) == 0
        assert len(state.meta) == 0
        assert state.safety is None


class TestConsentRiskScoring:
    """Test risk scoring algorithm"""
    
    def test_baseline_green_low_risk(self):
        """🟢 baseline = risk 0"""
        state = parse_consent_emoji("🟢 exploring")
        scoring = score_consent_risk(state)
        assert scoring.risk_level == 0
        assert scoring.response_mode == ResponseMode.EXPLORE
    
    def test_yellow_activated_low_risk(self):
        """🟡 activated = risk 1"""
        state = parse_consent_emoji("🟡 engaged")
        scoring = score_consent_risk(state)
        assert scoring.risk_level == 1
        assert scoring.response_mode == ResponseMode.EXPLORE
    
    def test_orange_edge_medium_risk(self):
        """🟠 approaching edge = risk 2"""
        state = parse_consent_emoji("🟠 getting intense")
        scoring = score_consent_risk(state)
        assert scoring.risk_level == 2
        assert scoring.response_mode == ResponseMode.DEEPEN
    
    def test_red_limit_medium_risk(self):
        """🔴 at limit = risk 3"""
        state = parse_consent_emoji("🔴 maxed out")
        scoring = score_consent_risk(state)
        assert scoring.risk_level == 3
        assert scoring.response_mode == ResponseMode.INTEGRATE
    
    def test_violet_altered_high_risk(self):
        """🟣 altered state = risk 4"""
        state = parse_consent_emoji("🟣 liminal")
        scoring = score_consent_risk(state)
        assert scoring.risk_level == 4
        assert scoring.response_mode == ResponseMode.REGULATE
    
    def test_emotion_increases_risk(self):
        """High-intensity emotions (🌊❄️⚡) increase risk"""
        baseline = parse_consent_emoji("🟢")
        baseline_scoring = score_consent_risk(baseline)
        
        with_overwhelm = parse_consent_emoji("🟢🌊")
        overwhelm_scoring = score_consent_risk(with_overwhelm)
        
        assert overwhelm_scoring.risk_level > baseline_scoring.risk_level
    
    def test_violet_plus_emotion_combo(self):
        """🟣 + high-intensity emotion = extra risk"""
        state = parse_consent_emoji("🟣⚡ altered + triggered")
        scoring = score_consent_risk(state)
        assert scoring.risk_level == 5  # Max risk
    
    def test_wall_boundary_increases_risk(self):
        """🧱 wall = +1 risk"""
        baseline = parse_consent_emoji("🟢")
        baseline_scoring = score_consent_risk(baseline)
        
        with_wall = parse_consent_emoji("🟢🧱")
        wall_scoring = score_consent_risk(with_wall)
        
        assert wall_scoring.risk_level > baseline_scoring.risk_level
    
    def test_safety_sos_crisis_mode(self):
        """🆘 = immediate crisis response"""
        state = parse_consent_emoji("🆘 help")
        scoring = score_consent_risk(state)
        assert scoring.risk_level == 5
        assert scoring.response_mode == ResponseMode.CRISIS
    
    def test_safety_alarm_crisis_mode(self):
        """🚨 = immediate crisis response"""
        state = parse_consent_emoji("🚨 emergency")
        scoring = score_consent_risk(state)
        assert scoring.risk_level == 5
        assert scoring.response_mode == ResponseMode.CRISIS
    
    def test_hug_grounding_mode(self):
        """🫂 = grounding needed"""
        state = parse_consent_emoji("🟡🫂 need comfort")
        scoring = score_consent_risk(state)
        # Should increase risk level appropriately
        assert "grounding" in scoring.rationale.lower() or any("grounding" in s.lower() for s in scoring.suggestions)
    
    def test_pause_adds_suggestions(self):
        """⏸️ pause adds grounding suggestions"""
        state = parse_consent_emoji("⏸️ slow down")
        scoring = score_consent_risk(state)
        assert any("pause" in s.lower() or "grounding" in s.lower() for s in scoring.suggestions)
    
    def test_mirror_meta_signal(self):
        """🪞 mirror adds reflection suggestions"""
        state = parse_consent_emoji("🪞 reflect me")
        scoring = score_consent_risk(state)
        assert any("reflect" in s.lower() or "mirror" in s.lower() for s in scoring.suggestions)


class TestConsentOSEdgeCases:
    """Test edge cases and ConsentOS rules"""
    
    def test_text_overrides_emoji(self):
        """ConsentOS: words > glyphs"""
        # This is a semantic test - the parser doesn't enforce this,
        # but the agent should honor explicit text over emoji
        state = parse_consent_emoji("🚪 actually don't go there 🧱")
        # Last emoji wins for parsing, but agent should check text
        assert state.boundary == BoundaryMarker.WALL
    
    def test_red_overrides(self):
        """ConsentOS: red signals override"""
        state = parse_consent_emoji("⏩🔴 fast but at limit")
        scoring = score_consent_risk(state)
        # Red intensity should constrain the response
        assert scoring.risk_level >= 3
    
    def test_complex_cluster(self):
        """Real-world cluster: 🔴⏸️🫂"""
        state = parse_consent_emoji("🔴⏸️🫂 at limit, pause, need comfort")
        scoring = score_consent_risk(state)
        
        assert state.intensity == IntensityLevel.RED
        assert state.pace == PaceSignal.PAUSE
        assert state.safety == SafetySignal.HUG
        assert scoring.risk_level >= 3  # Red + grounding
    
    def test_user_request_cluster(self):
        """User's actual request: 💚⏩🚪"""
        state = parse_consent_emoji("💚⏩🚪 continue the testing grounds")
        
        # 💚 is not in emoji_map, should use default GREEN
        assert state.intensity == IntensityLevel.GREEN
        assert state.pace == PaceSignal.FASTER
        assert state.boundary == BoundaryMarker.DOOR
        
        scoring = score_consent_risk(state)
        assert scoring.response_mode == ResponseMode.EXPLORE  # Low risk, open boundary


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
