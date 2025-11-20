# Repository labels and persona labels

This file documents the canonical labels used in this repository and provides a simple automation script to create/update them.

Persona labels

- `persona:LuminAI` — Core LuminAI persona: general design/engineering work routed to LuminAI.
- `persona:Airth` — Research guard: citations, evidence reviews, knowledge synthesis.
- `persona:Arcadia` — Platform integrations and UI work.
- `persona:Ely` — Infrastructure, ops, CI, developer experience.
- `persona:Adelphia` — UX, voice, accessibility, companion features.
- `persona:Multi-Persona` — Multi-persona coordination and orchestration.
- `persona:Kaznak` — Experimental and speculative features.
- `persona:The-Mirror` — Evaluation, ethics checks, counterfactuals.
- `persona:The-Reluctant-Steward` — Risk, policy, refusal, and constraints.

Common labels

- `bug` — Something isn't working; a reproducible defect.
- `dependencies` — Pull requests that update dependency files (requirements, package.json).
- `documentation` — Documentation improvements or additions.
- `duplicate` — Duplicate issue or PR.
- `enhancement` — Feature request or enhancement.
- `good first issue` — Well-scoped tasks for newcomers.
- `help wanted` — Assistance requested from contributors.
- `invalid` — Not actionable or off-topic.
- `javascript` — PRs that update JS code.
- `python` — PRs that update Python code.
- `question` — More information requested.
- `wontfix` — Will not be worked on.

Create or update labels (recommended)

We include a helper script at `scripts/create_labels.py` that will create or update these labels using a GitHub Personal Access Token (PAT) available in the environment as `GITHUB_TOKEN`.

Usage (WSL / bash):

```bash
export GITHUB_TOKEN="ghp_xxx"
python scripts/create_labels.py
```

Usage (PowerShell):

```powershell
$env:GITHUB_TOKEN = Read-Host -AsSecureString "Paste PAT"
# convert to string if needed and set as environment variable in plain text before running the script
python scripts/create_labels.py
```

Alternative: use the GitHub CLI (`gh`) to create labels interactively or script them. Example:

```bash
gh auth login
gh label create "persona:Airth" --color 2ecc71 --description "Airth (Research Guard): research, citations, evidence reviews." --repo Elidorascodex/luminai-codex
```

Auto-labeling PRs

The workflow `.github/workflows/auto-label.yml` uses `.github/labeler.yml` to map file path patterns to persona labels. Edit `.github/labeler.yml` to tune the mappings. The workflow runs on PR open/sync events.

If you want me to create the labels in your repository, I can run the script for you — but you'll need to provide a token or run `gh auth login` locally and tell me to run the `gh` commands.
