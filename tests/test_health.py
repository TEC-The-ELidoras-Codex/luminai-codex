import os
from fastapi.testclient import TestClient

# Ensure backend path import works
from backend.main import app

client = TestClient(app)


def test_root_liveness():
    r = client.get("/")
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "running"
    assert "cosmos_connected" in data


def test_health_endpoint():
    r = client.get("/health")
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "healthy"
    assert "frequencies" in data


def test_readiness_structure():
    r = client.get("/readiness")
    assert r.status_code == 200
    data = r.json()
    assert "env" in data and "cosmos" in data and "llm" in data
    assert "readiness" in data
    # readiness may be degraded without secrets; just ensure key fields exist
    assert "missing" in data["env"]


def test_frequency_toggle_unknown():
    r = client.post("/api/frequencies/toggle", params={"frequency_name": "nonexistent"})
    assert r.status_code == 400


def test_frequency_toggle_valid():
    # Pick a known frequency
    r = client.post("/api/frequencies/toggle", params={"frequency_name": "compassion"})
    assert r.status_code == 200
    data = r.json()
    assert data["frequency"] == "compassion"
    assert isinstance(data["active"], bool)
