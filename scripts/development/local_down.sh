#!/usr/bin/env bash
set -euo pipefail

# local_down.sh - Tear down local resonance stack started by local_up.sh
# Usage: ./scripts/development/local_down.sh [--prune]

PRUNE=${1:-""}

echo "[local_down] Stopping containers (backend, frontend, postgres, redis, ollama)..."
docker compose stop backend frontend postgres redis ollama || true

echo "[local_down] Stopping any remaining services in compose file..."
docker compose stop || true

echo "[local_down] Containers stopped."

if [ "$PRUNE" = "--prune" ]; then
  echo "[local_down] Removing containers & anonymous volumes..."
  docker compose down -v || true
  echo "[local_down] Prune complete."
else
  echo "[local_down] (Use --prune to also remove containers and volumes)"
fi
