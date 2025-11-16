#!/usr/bin/env bash
set -euo pipefail

# local_up.sh - Spin up full local resonance stack (Ollama + Postgres + Redis + Backend + Frontend)
# Usage: ./scripts/development/local_up.sh [model]
# Default model: llama3.2:3b (adjust if you prefer another available Ollama model)
MODEL_NAME=${1:-"llama3.2:3b"}

echo "[local_up] Starting LuminAI Codex local stack..."

if ! command -v docker >/dev/null 2>&1; then
  echo "[local_up][error] Docker not found. Please install Docker first." >&2
  exit 1
fi

echo "[local_up] Pulling Ollama image (if missing)..."
docker pull ollama/ollama:latest >/dev/null || true

# Start only core dependencies first so we can pull the model early.
echo "[local_up] Bringing up Ollama container..."
docker compose up -d ollama

# Wait until Ollama health endpoint responds
ATTEMPTS=0
until curl -sf http://localhost:11434/api/tags >/dev/null 2>&1 || [ $ATTEMPTS -ge 20 ]; do
  ATTEMPTS=$((ATTEMPTS+1))
  echo "[local_up] Waiting for Ollama (attempt $ATTEMPTS)..."
  sleep 2
done

if ! curl -sf http://localhost:11434/api/tags >/dev/null 2>&1; then
  echo "[local_up][error] Ollama did not become ready in time." >&2
  exit 1
fi

echo "[local_up] Ensuring model '$MODEL_NAME' is available..."
# Pull model if not listed
if ! curl -s http://localhost:11434/api/tags | grep -q "$MODEL_NAME"; then
  echo "[local_up] Pulling model: $MODEL_NAME"
  curl -s -X POST http://localhost:11434/api/pull -d "{\"name\": \"$MODEL_NAME\"}" || {
    echo "[local_up][warn] Failed to trigger pull via API; you may need to pull manually using: ollama pull $MODEL_NAME" >&2
  }
  echo "[local_up] Waiting for model pull to finish (polling tags)..."
  PULL_WAIT=0
  until curl -s http://localhost:11434/api/tags | grep -q "$MODEL_NAME" || [ $PULL_WAIT -ge 60 ]; do
    PULL_WAIT=$((PULL_WAIT+1))
    sleep 2
  done
fi

if curl -s http://localhost:11434/api/tags | grep -q "$MODEL_NAME"; then
  echo "[local_up] Model '$MODEL_NAME' available."
else
  echo "[local_up][warn] Model '$MODEL_NAME' not confirmed; continuing anyway."
fi

echo "[local_up] Starting remaining services (postgres, redis, backend, frontend)..."
docker compose up -d postgres redis backend frontend

echo "[local_up] Waiting for backend health..."
ATTEMPTS=0
until curl -sf http://localhost:8000/health >/dev/null 2>&1 || [ $ATTEMPTS -ge 30 ]; do
  ATTEMPTS=$((ATTEMPTS+1))
  sleep 2
  echo "[local_up] Backend not ready yet (attempt $ATTEMPTS)..."
fi

if curl -sf http://localhost:8000/health >/dev/null 2>&1; then
  echo "[local_up] Backend healthy."
else
  echo "[local_up][warn] Backend health endpoint not responding; check logs: docker compose logs backend" >&2
fi

echo "[local_up] Stack ready. Summary:"
echo "  Backend:  http://localhost:8000"
echo "  Frontend: http://localhost:3000"
echo "  Ollama:   http://localhost:11434"
echo "  Redis:    redis://localhost:6379"
echo "  Postgres: localhost:5432 (user=luminai password=luminai db=luminai)"
echo "[local_up] To tail logs: docker compose logs -f backend frontend"
echo "[local_up] To stop: ./scripts/development/local_down.sh"
