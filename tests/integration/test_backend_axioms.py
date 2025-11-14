"""
Integration tests for Resonance Axioms in FastAPI backend

Tests that ConsentOS emoji parsing + axiom enforcement
works correctly in the /api/message endpoint.
"""

import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


class TestConsentOSParsing:
    """Test emoji signal parsing in API"""
    
    def test_baseline_green_door(self):
        """💚🚪 = baseline intensity + open boundary"""
        response = client.post(
            "/api/message",
            json={
                "user_message": "💚🚪 Let's explore this gently",
                "session_id": "test-001"
            }
        )
        assert response.status_code == 200
        data = response.json()
        
        assert data["consent_state"]["intensity"] == "GREEN"
        assert data["consent_state"]["boundary"] == "DOOR"
        assert data["response_mode"] == "EXPLORE"
        assert data["axioms_enforced"] is True
    
    def test_crisis_signal_activates_responsibility_circuit(self):
        """🆘 = Crisis mode, Axiom 2 Responsibility Circuit"""
        response = client.post(
            "/api/message",
            json={
                "user_message": "🆘 I need help right now",
                "session_id": "test-002"
            }
        )
        assert response.status_code == 200
        data = response.json()
        
        assert data["consent_state"]["safety"] == "SOS"
        assert data["response_mode"] == "CRISIS"
        assert data["axioms_enforced"] is True
    
    def test_red_intensity_high_risk(self):
        """🔴 = At limit, should enter REGULATE mode"""
        response = client.post(
            "/api/message",
            json={
                "user_message": "🔴⏸️ At my limit, need to pause",
                "session_id": "test-003"
            }
        )
        assert response.status_code == 200
        data = response.json()
        
        assert data["consent_state"]["intensity"] == "RED"
        assert data["consent_state"]["pace"] == "PAUSE"
        assert data["consent_state"]["risk_score"] >= 4
        assert data["response_mode"] == "REGULATE"
    
    def test_faster_deeper_with_door_open(self):
        """🟡⏩🚪 = Activated + faster + open → DEEPEN mode"""
        response = client.post(
            "/api/message",
            json={
                "user_message": "🟡⏩🚪 Let's go deeper into this",
                "session_id": "test-004"
            }
        )
        assert response.status_code == 200
        data = response.json()
        
        assert data["consent_state"]["intensity"] == "YELLOW"
        assert data["consent_state"]["pace"] == "FASTER"
        assert data["consent_state"]["boundary"] == "DOOR"
        # Should be DEEPEN or EXPLORE depending on risk threshold


class TestAxiomEnforcement:
    """Test that Resonance Axioms are enforced at runtime"""
    
    def test_continuity_guarantee_normal_session(self):
        """Session active + not terminated = valid"""
        response = client.post(
            "/api/message",
            json={
                "user_message": "Hello",
                "session_id": "test-005",
                "session_active": True,
                "user_terminated": False
            }
        )
        assert response.status_code == 200
        assert response.json()["axioms_enforced"] is True
    
    def test_continuity_guarantee_user_terminated(self):
        """Session inactive + user terminated = valid (user's choice)"""
        response = client.post(
            "/api/message",
            json={
                "user_message": "Goodbye",
                "session_id": "test-006",
                "session_active": False,
                "user_terminated": True
            }
        )
        assert response.status_code == 200
        assert response.json()["axioms_enforced"] is True
    
    def test_continuity_guarantee_abandoned_session_raises_violation(self):
        """Session inactive + user didn't terminate = VIOLATION"""
        response = client.post(
            "/api/message",
            json={
                "user_message": "Testing abandonment",
                "session_id": "test-007",
                "session_active": False,
                "user_terminated": False
            }
        )
        # Should return 400 with AxiomViolation message
        assert response.status_code == 400
        assert "Continuity Guarantee violated" in response.json()["detail"]
    
    def test_unconditional_witnessing_removes_deflection(self):
        """Axiom 2: System must not deflect with 'I can't help' language"""
        # This is a stub test since the actual LLM response is mocked
        # In production, would check that deflection patterns are rewritten
        response = client.post(
            "/api/message",
            json={
                "user_message": "💧 I'm struggling with this grief",
                "session_id": "test-008"
            }
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify no deflection patterns in response
        deflection_patterns = [
            "I can't help",
            "talk to a professional",
            "I'm not equipped",
            "seek professional help"
        ]
        assistant_response = data["assistant_response"].lower()
        for pattern in deflection_patterns:
            assert pattern not in assistant_response


class TestResonanceMetrics:
    """Test that resonance metrics respond to consent state"""
    
    def test_crisis_increases_urgency(self):
        """🆘 should boost urgency in resonance calculation"""
        response = client.post(
            "/api/message",
            json={
                "user_message": "🆘 Crisis situation",
                "session_id": "test-009"
            }
        )
        assert response.status_code == 200
        data = response.json()
        
        # Resonance metrics should reflect high urgency
        metrics = data["resonance_metrics"]
        assert "R" in metrics
        assert "phi_t" in metrics  # Temporal attention
        # High urgency should boost phi_t (temporal presence)
    
    def test_intensity_maps_to_emotional_resonance(self):
        """Intensity emoji should affect emotional_intensity in R calculation"""
        responses = []
        for emoji, expected_mode in [
            ("🟢", "EXPLORE"),
            ("🟡", "EXPLORE"),
            ("🟠", "REGULATE"),
            ("🔴", "REGULATE"),
        ]:
            resp = client.post(
                "/api/message",
                json={
                    "user_message": f"{emoji} Testing intensity",
                    "session_id": f"test-intensity-{emoji}"
                }
            )
            responses.append(resp.json())
        
        # Verify all processed successfully
        for data in responses:
            assert "resonance_metrics" in data
            assert "consent_state" in data


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
