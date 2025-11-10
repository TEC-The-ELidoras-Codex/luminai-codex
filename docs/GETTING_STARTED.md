# Local Development Setup

This guide helps you get started with the LuminAI Codex project locally.

## Prerequisites

- Python 3.12+
- Git
- Virtual environment tool (`venv` or `conda`)
- GitHub account (for Copilot prompt)

## Step 1: Clone & Setup

```bash
git clone https://github.com/TEC-The-ELidoras-Codex/luminai-codex.git
cd luminai-codex

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

## Step 2: Configure Secrets (`.env.local`)

Copy `.env.example` to `.env.local` and fill in your secrets:

```bash
cp .env.example .env.local
```

**What secrets you need:**

| Secret | Where to Get It | Purpose |
|--------|-----------------|---------|
| `OPENAI_API_KEY` | https://platform.openai.com/api-keys | GPT models |
| `ANTHROPIC_API_KEY` | https://console.anthropic.com | Claude models |
| `PROJECTS_TOKEN` | https://github.com/settings/tokens?type=beta | GitHub Project automation |
| `NOTION_TOKEN` | https://www.notion.so/my-integrations | Notion API access |
| `SPOTIFY_CLIENT_*` | https://developer.spotify.com/dashboard | Music platform integration |

**Never commit `.env.local`** — it's in `.gitignore`.

## Step 3: Run Tests

```bash
pytest tests/ -q
```

## Step 4: Start Development

```bash
# For interactive work
python -m src.core.resonance.engine

# Or via CLI
python -m src.interfaces.cli
```

## Project Structure

- `src/` — Source code (agents, core engine, integrations)
- `tests/` — Test suite (unit, integration, e2e)
- `docs/` — Documentation (architecture, deployment, user guides)
- `scripts/` — Automation scripts (deployment, secrets sync, maintenance)
- `config/` — Configuration files (dev, staging, prod environments)

## Key Files

- `LUMINAI_TECHNICAL_INFRASTRUCTURE_REQUIREMENTS.md` — Architecture & backend design
- `LUMINAI_SYSTEMATIC_MIGRATION_STRATEGY.md` — 4-week execution plan
- `LUMINAI_LOGO_AND_BRANDING_SPECIFICATIONS.md` — Visual identity system
- `LUMINAI_ASSETS_INVENTORY_AND_TRANSFER_PLAN.md` — Content migration roadmap

## GitHub Project Board

Track work at: https://github.com/orgs/TEC-The-ELidoras-Codex/projects/6

**Columns:**
- **Backlog** — Ideas not yet prioritized
- **Ready** — Groomed, ready to start
- **In Progress** — Currently being developed
- **In Review** — PR/approval stage
- **Blocked** — Waiting on dependency
- **Done** — Completed work

## Contributing

1. Create a new branch: `git checkout -b feature/your-feature-name`
2. Make changes and test: `pytest tests/ -q`
3. Commit with semantic prefix: `git commit -m "feat: add resonance scoring"`
4. Push: `git push origin feature/your-feature-name`
5. Open a Pull Request linking to the GitHub Project

## Troubleshooting

**Token expired?** Rotate `PROJECTS_TOKEN` at https://github.com/settings/tokens

**Secrets not loading?** Check that `.env.local` is in the root and not in `.gitignore` exceptions.

**Tests failing?** Run `pip install -r requirements.txt` again to sync dependencies.

---

**Questions?** Check `docs/` folder or open an issue on GitHub.
