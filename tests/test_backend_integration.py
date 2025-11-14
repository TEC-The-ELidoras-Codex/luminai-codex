"""
Integration test for backend API with full axiom + ConsentOS enforcement.
Tests the complete request/response flow.
"""
import pytest
from fastapi.testclient import TestClient
import sys
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent.parent / "backend"
sys.path.insert(0, str(backend_path))

from main import app

client = TestClient(app)


class TestBackendIntegration:
    """Test full request flow through FastAPI"""
    
    def test_health_endpoint(self):
        """Backend health check works"""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "resonance_engine" in data
    
    def test_message_baseline_green(self):
        """🟢 baseline message → EXPLORE mode"""
        response = client.post(
            "/api/message",
            json={
                "user_message": "🟢 Tell me about resonance",
                "session_id": "test-session-1",
                "session_active": True,
                "user_terminated": False,
            }
        )
        assert response.status_code == 200
        data = response.json()
        
        assert data["consent_state"]["intensity"] == "GREEN"
        assert data["response_mode"] == "EXPLORE"
        assert data["axioms_enforced"] is True
        assert data["consent_state"]["risk_level"] == 0
    
    def test_message_crisis_sos(self):
        """🆘 SOS → CRISIS mode with crisis protocol"""
        response = client.post(
            "/api/message",
            json={
                "user_message": "🆘 I need help",
                "session_id": "test-session-crisis",
                "session_active": True,
                "user_terminated": False,
            }
        )
        assert response.status_code == 200
        data = response.json()
        
        assert data["response_mode"] == "CRISIS"
        assert data["consent_state"]["safety"] == "SOS"
        assert data["consent_state"]["risk_level"] == 5
        assert "I'm here with you" in data["assistant_response"]
    
    def test_message_multiple_emotions(self):
        """💧🔥🌊 multiple emotions parsed correctly"""
        response = client.post(
            "/api/message",
            json={
                "user_message": "💧🔥🌊 feeling everything at once",
                "session_id": "test-session-emotions",
                "session_active": True,
                "user_terminated": False,
            }
        )
        assert response.status_code == 200
        data = response.json()
        
        emotions = data["consent_state"]["emotions"]
        assert len(emotions) == 3
        assert "DROPLET" in emotions
        assert "FIRE" in emotions
        assert "WAVE" in emotions
    
    def test_message_user_request_cluster(self):
        """💚⏩🚪 user's actual request (green/faster/door)"""
        response = client.post(
            "/api/message",
            json={
                "user_message": "💚⏩🚪 continue the testing grounds please and thank you",
                "session_id": "test-session-user",
                "session_active": True,
                "user_terminated": False,
            }
        )
        assert response.status_code == 200
        data = response.json()
        
        # 💚 not in emoji map → defaults to GREEN
        assert data["consent_state"]["intensity"] == "GREEN"
        assert data["consent_state"]["pace"] == "FASTER"
        assert data["consent_state"]["boundary"] == "DOOR"
        assert data["response_mode"] == "EXPLORE"  # Low risk, open boundary
    
    def test_axiom_violation_abandoned_session(self):
        """session_active=False + user_terminated=False → Axiom violation"""
        response = client.post(
            "/api/message",
            json={
                "user_message": "Are you still there?",
                "session_id": "test-session-abandoned",
                "session_active": False,  # Session not active
                "user_terminated": False,  # User didn't end it
            }
        )
        # Axiom violation returns HTTP 400
        assert response.status_code == 400
        data = response.json()
        assert "error" in data
        assert "Continuity Guarantee" in data["error"]
    
    def test_user_terminated_session_allowed(self):
        """session_active=False + user_terminated=True → allowed"""
        response = client.post(
            "/api/message",
            json={
                "user_message": "Goodbye",
                "session_id": "test-session-ended",
                "session_active": False,
                "user_terminated": True,  # User explicitly ended
            }
        )
        assert response.status_code == 200  # User choice is valid
    
    def test_wall_boundary_respected(self):
        """🧱 wall → risk increases, suggestions respect boundary"""
        response = client.post(
            "/api/message",
            json={
                "user_message": "🧱 don't go there",
                "session_id": "test-session-wall",
                "session_active": True,
                "user_terminated": False,
            }
        )
        assert response.status_code == 200
        data = response.json()
        
        assert data["consent_state"]["boundary"] == "WALL"
        assert data["consent_state"]["risk_level"] >= 1  # Wall adds risk
        assert any("boundary" in s.lower() for s in data["consent_state"]["suggestions"])
    
    def test_pause_signal_honored(self):
        """⏸️ pause → grounding suggestions"""
        response = client.post(
            "/api/message",
            json={
                "user_message": "⏸️ need to slow down",
                "session_id": "test-session-pause",
                "session_active": True,
                "user_terminated": False,
            }
        )
        assert response.status_code == 200
        data = response.json()
        
        assert data["consent_state"]["pace"] == "PAUSE"
        assert any("pause" in s.lower() or "grounding" in s.lower() 
                  for s in data["consent_state"]["suggestions"])
    
    def test_resonance_metrics_included(self):
        """Response includes TGCR resonance metrics"""
        response = client.post(
            "/api/message",
            json={
                "user_message": "Test resonance calculation",
                "session_id": "test-session-metrics",
                "session_active": True,
                "user_terminated": False,
            }
        )
        assert response.status_code == 200
        data = response.json()
        
        metrics = data["resonance_metrics"]
        assert "R" in metrics
        assert "phi_e" in metrics
        assert "phi_t" in metrics
        assert "psi_r" in metrics
        assert metrics["R"] >= 0  # Resonance should be non-negative


class TestConsentOSBackendIntegration:
    """Test ConsentOS emoji parsing through backend"""
    
    def test_all_intensity_levels(self):
        """All 5 intensity levels work through API"""
        for emoji, level in [("🟢", "GREEN"), ("🟡", "YELLOW"), ("🟠", "ORANGE"), 
                            ("🔴", "RED"), ("🟣", "VIOLET")]:
            response = client.post(
                "/api/message",
                json={
                    "user_message": f"{emoji} test",
                    "session_id": f"test-intensity-{level}",
                    "session_active": True,
                    "user_terminated": False,
                }
            )
            assert response.status_code == 200
            assert response.json()["consent_state"]["intensity"] == level
    
    def test_meta_signals(self):
        """Meta signals (🪞👁️) work through API"""
        response = client.post(
            "/api/message",
            json={
                "user_message": "🪞 mirror me please",
                "session_id": "test-meta",
                "session_active": True,
                "user_terminated": False,
            }
        )
        assert response.status_code == 200
        data = response.json()
        
        assert "MIRROR" in data["consent_state"]["meta"]
        assert any("mirror" in s.lower() or "reflect" in s.lower() 
                  for s in data["consent_state"]["suggestions"])


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
