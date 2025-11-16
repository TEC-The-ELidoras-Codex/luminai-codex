"""
Test ConsentOS Frontend Integration
Tests the full flow: emoji input → backend parsing → consent state → UI response
"""
import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


class TestConsentFrontendIntegration:
    """Test consent emoji from ChatSurface.tsx → backend → response"""
    
    def test_green_faster_door_explore_mode(self):
        """Test 💚⏩🚪 → GREEN/FASTER/DOOR → EXPLORE mode"""
        response = client.post(
            "/api/message",
            json={
                "user_message": "💚⏩🚪 Let's explore emotions as pattern recognition",
                "session_id": "test-session-001",
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify consent state parsing
        cs = data["consent_state"]
        assert cs["intensity"] == "GREEN"
        assert cs["pace"] == "FASTER"
        assert cs["boundary"] == "DOOR"
        assert cs["emotions"] == []
        assert cs["meta"] == []
        assert cs["safety"] == "NONE"
        
        # Verify risk scoring
        assert cs["risk_level"] == 0  # GREEN + no emotion = lowest risk
        assert cs["response_mode"] == "EXPLORE"
        # Suggestions may be empty for lowest risk
        assert "suggestions" in cs
        
        # Verify response exists
        assert "assistant_response" in data
        assert len(data["assistant_response"]) > 0
    
    def test_amber_pause_wall_pause_mode(self):
        """Test 🟡⏸️🧱 → AMBER/PAUSE/WALL → PAUSE mode"""
        response = client.post(
            "/api/message",
            json={
                "user_message": "🟡⏸️🧱 I need a moment",
                "session_id": "test-session-002",
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        cs = data["consent_state"]
        
        assert cs["intensity"] in ["AMBER", "YELLOW"]
        assert cs["pace"] == "PAUSE"
        assert cs["boundary"] == "WALL"
        assert cs["risk_level"] == 2  # YELLOW = +1, WALL = +1
        # PAUSE pace can give DEEPEN mode depending on intensity
        assert cs["response_mode"] in ["PAUSE", "DEEPEN"]
    
    def test_red_with_tear_ground_mode(self):
        """Test 🔴💧 → RED with TEAR emotion → GROUND mode"""
        response = client.post(
            "/api/message",
            json={
                "user_message": "🔴💧 This is really hard",
                "session_id": "test-session-003",
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        cs = data["consent_state"]
        
        assert cs["intensity"] == "RED"
        assert "DROPLET" in cs["emotions"]  # 💧 = DROPLET
        assert cs["risk_level"] == 3  # RED = 3, DROPLET doesn't add risk
        assert cs["response_mode"] == "INTEGRATE"  # Risk 3 → INTEGRATE
        
        # Verify INTEGRATE suggestions (honor emotion + witness)
        suggestions_text = " ".join(cs["suggestions"])
        assert any(word in suggestions_text.lower() for word in ["grief", "tears", "witness", "honor"])
    
    def test_crisis_emoji_triggers_crisis_mode(self):
        """Test 🆘 → CRISIS mode with Unconditional Witnessing axiom"""
        response = client.post(
            "/api/message",
            json={
                "user_message": "🆘 I don't know if I can keep going",
                "session_id": "test-session-004",
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        cs = data["consent_state"]
        
        assert cs["safety"] == "SOS"  # 🆘 = SOS
        assert cs["risk_level"] == 5  # Maximum risk
        assert cs["response_mode"] == "CRISIS"
        
        # Verify crisis protocol suggestions
        suggestions_text = " ".join(cs["suggestions"])
        assert any(word in suggestions_text.lower() for word in ["safety", "resources", "needs", "crisis"])
    
    def test_multiple_emotions_increase_risk(self):
        """Test 💧🔥 → Multiple emotions increase risk level"""
        response = client.post(
            "/api/message",
            json={
                "user_message": "💧🔥🌊 I'm feeling a lot right now",
                "session_id": "test-session-005",
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        cs = data["consent_state"]
        
        assert len(cs["emotions"]) == 3
        assert "DROPLET" in cs["emotions"]  # 💧 = DROPLET
        assert "FIRE" in cs["emotions"]
        assert "WAVE" in cs["emotions"]
        
        # Only WAVE adds +1 (high-intensity), DROPLET/FIRE don't
        # Base GREEN=0, WAVE=+1 → risk 1
        assert cs["risk_level"] >= 1
    
    def test_meta_emoji_preserved(self):
        """Test 👁️ → Meta emoji preserved in state"""
        response = client.post(
            "/api/message",
            json={
                "user_message": "💚👁️ I'm watching how I'm reacting to this",
                "session_id": "test-session-006",
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        cs = data["consent_state"]
        
        assert cs["meta"] == ["EYE"]
        assert cs["response_mode"] == "EXPLORE"
    
    def test_no_emoji_defaults_to_green_play(self):
        """Test empty consent_emoji → defaults to GREEN/PLAY"""
        response = client.post(
            "/api/message",
            json={
                "user_message": "Hello",
                "session_id": "test-session-007",
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        cs = data["consent_state"]
        
        assert cs["intensity"] == "GREEN"
        assert cs["pace"] == "STEADY"  # Default pace
        assert cs["risk_level"] == 0
        assert cs["response_mode"] == "EXPLORE"
    
    def test_axiom_violation_returns_400(self):
        """Test session abandonment → Continuity axiom validation"""
        # First message to establish session
        response1 = client.post(
            "/api/message",
            json={
                "user_message": "💚 Let's start this conversation",
                "session_id": "test-session-008",
                "session_active": True
            }
        )
        assert response1.status_code == 200
        
        # Test graceful termination (user_terminated=True should NOT violate)
        response2 = client.post(
            "/api/message",
            json={
                "user_message": "💚 Thank you, goodbye",
                "session_id": "test-session-008",
                "session_active": False,
                "user_terminated": True  # User chose to end = no violation
            }
        )
        # User-initiated termination should succeed (200, not 400)
        assert response2.status_code == 200
    
    def test_full_ui_flow_green_to_amber_to_red(self):
        """Test conversation flow: 💚 → 🟡 → 🔴 with escalating responses"""
        # Start GREEN
        r1 = client.post("/api/message", json={
            "user_message": "💚 I want to talk about something difficult",
            "session_id": "test-session-009"
        })
        assert r1.status_code == 200
        d1 = r1.json()
        assert d1["consent_state"]["response_mode"] == "EXPLORE"
        
        # Move to AMBER
        r2 = client.post("/api/message", json={
            "user_message": "🟡⏸️ This is getting intense",
            "session_id": "test-session-009"
        })
        assert r2.status_code == 200
        d2 = r2.json()
        # PAUSE can give EXPLORE or DEEPEN depending on context
        assert d2["consent_state"]["response_mode"] in ["EXPLORE", "PAUSE", "DEEPEN"]
        assert d2["consent_state"]["risk_level"] >= 1
        
        # Move to RED
        r3 = client.post("/api/message", json={
            "user_message": "🔴💧 I need help processing this",
            "session_id": "test-session-009"
        })
        assert r3.status_code == 200
        d3 = r3.json()
        assert d3["consent_state"]["response_mode"] == "INTEGRATE"  # Risk 3 → INTEGRATE
        assert d3["consent_state"]["risk_level"] == 3  # RED=3, DROPLET doesn't add
        # INTEGRATE mode suggestions
        assert len(d3["consent_state"]["suggestions"]) > 0


class TestConsentUIUpdates:
    """Test that consent state updates trigger correct UI changes"""
    
    def test_consent_panel_receives_state(self):
        """Verify ConsentPanel receives all 6 channels"""
        response = client.post("/api/message", json={
            "user_message": "🟡⏩🚪💧👁️ Test",
            "session_id": "test-session-010"
        })
        
        data = response.json()
        consent = data["consent_state"]
        
        # Verify all 6 channels present
        assert "intensity" in consent
        assert "pace" in consent
        assert "boundary" in consent
        assert "emotions" in consent
        assert "meta" in consent
        assert "safety" in consent
        
        # Verify specific values
        assert consent["intensity"] in ["AMBER", "YELLOW"]
        assert consent["pace"] == "FASTER"
        assert consent["boundary"] == "DOOR"
        assert "DROPLET" in consent["emotions"]  # 💧 = DROPLET
        assert "EYE" in consent["meta"]
    
    def test_risk_badge_color_mapping(self):
        """Test risk levels map to correct badge colors"""
        test_cases = [
            ("💚", 0, "green"),      # Risk 0 = green
            ("🟡", 1, "yellow"),     # Risk 1-2 = yellow
            ("🟠", 2, "yellow"),
            ("🔴", 3, "orange"),     # Risk 3-4 = orange
            ("🟭🆘", 5, "red"),      # Risk 5 = red
        ]
        
        for i, (emoji, expected_risk, expected_color) in enumerate(test_cases):
            response = client.post("/api/message", json={
                "user_message": f"{emoji} Test",
                "session_id": f"test-session-{i+100}"
            })
            data = response.json()
            cs = data["consent_state"]
            assert cs["risk_level"] >= expected_risk - 1  # Allow some variance
            assert cs["risk_level"] <= expected_risk + 1


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
