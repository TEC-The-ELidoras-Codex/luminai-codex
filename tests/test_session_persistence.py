"""Tests for session persistence integration (Cosmos DB graceful fallback).

We do not require a live Cosmos DB; the global cosmos_db instance will be in
"degraded" mode (connected == False) when env vars are absent. Test ensures
routes respond and include cosmos flag.
"""
from fastapi.testclient import TestClient
from backend.main import app
from backend.lib.cosmos_db import cosmos_db

client = TestClient(app)

def test_root_includes_cosmos_flag():
    resp = client.get("/")
    assert resp.status_code == 200
    data = resp.json()
    assert "cosmos_connected" in data
    assert data["cosmos_connected"] in (True, False)

def test_message_route_graceful_without_cosmos():
    # Ensure cosmos not configured for this test context
    assert not cosmos_db.connected
    payload = {
        "user_message": "Hello 🌱",
        "session_id": "test-session-1",
        "context": {"history": []},
        "session_active": True,
        "user_terminated": False
    }
    resp = client.post("/api/message", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["session_id"] == "test-session-1"
    assert "assistant_response" in data
    assert "resonance_metrics" in data
