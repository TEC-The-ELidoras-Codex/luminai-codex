# Tech 08 — Docker & Stack Overview

## Compose Targets

`docker-compose.yml` starts:

| Service | Purpose | Ports | Notes |
| --- | --- | --- | --- |
| `backend` | FastAPI Resonance API | 8000 | Mounts repo, hot reload |
| `frontend` | Next.js UI | 3000 | Proxies API via `/api/*` |
| `postgres` | Storage for sessions + transcripts | 5432 | Data stored in `docker-data/postgres` |
| `redis` | Caching + websocket fan-out | 6379 | Optional but recommended |

Bring everything up:

```bash
docker-compose up --build
```

Stop + clean volumes:

```bash
docker-compose down -v
```

## Specialized Images

- `docker/Dockerfile.unsloth` — weights download for the resonance notebook.
- `docker/unsloth/start.sh` — entrypoint to run notebooks with GPU acceleration.
- `docker/Dockerfile` (root) — production FastAPI container (used by Heroku/Render/etc).

## Live Reload

- Python backend uses `uvicorn --reload`.
- Frontend uses `npm run dev`.
- To tie them together inside Docker, mount the repo and set `CHOKIDAR_USEPOLLING=1` for WSL/macOS.

## Debug Tips

- Container not seeing env vars? Add them to `.env.docker` and reference via `env_file`.
- Failing builds on Codespaces? Enable container caching in the Codespace UI (screenshot in issue #142).
- Running large downloads? Use `docker compose run --rm unsloth ./start.sh` so you can resume later.
