# Tech 06 — Runtime Setup (Solo Operator)

Use this when spinning up the repo locally or inside a Codespace.

## 1. Prerequisites

- Python 3.11 (venv stored in `.venv/`)
- Node.js 18+ (for frontend + scripts)
- Docker + Docker Compose (full stack + services)
- Bitwarden CLI (optional but recommended for secrets sync)

## 2. Quick Start Commands

```bash
git clone https://github.com/TEC-The-ELidoras-Codex/luminai-codex.git
cd luminai-codex

# Python
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Node
npm install

# Environment
cp .env.example .env.local   # then fill via Tech 07
```

## 3. Run Modes

| Mode | Command | Notes |
| --- | --- | --- |
| FastAPI backend | `uvicorn backend.main:app --reload` | Uses `.env.local`; expects secrets |
| Frontend (Next.js) | `npm run dev` (inside `frontend/`) | Hot reload at `localhost:3000` |
| Docker full stack | `docker-compose up --build` | Spins backend, frontend, Postgres, Redis |
| Harmony Node demo | `node bootstrap.js` | Emits mock modules if API keys missing |

## 4. Useful Scripts

- `python scripts/development/check_env.py --file .env.local` — ensure no `your-` placeholders
- `python scripts/development/setup_local_env.py` — copy secrets from Bitwarden mapping
- `tec-agent` (Typer CLI) — high-level agent orchestration

## 5. Troubleshooting

- Missing Python deps? Delete `.venv` and reinstall.
- `node-gyp` errors? Ensure Xcode build tools / `build-essential` installed.
- Docker port clash? Stop local Postgres/Redis or change ports in `docker-compose.yml`.

For more depth see `GETTING_STARTED.md` + `MULTI_LLM_QUICK_START.md`.
