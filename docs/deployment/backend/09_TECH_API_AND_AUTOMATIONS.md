# Tech 09 — API & Automation Playbook

## FOLD Research API

Extracted from `_TRANSFER_STAGING/docs_incoming/FOLD_RESEARCH_API.md`

- **Base URL**: `https://elidorascodex.com/wp-json/tec-tgcr/v1`
- **Auth**: `Authorization: Bearer fold_sk_...`
- Capabilities: motif search, resonance scoring, artist analysis, fan discourse analysis, circadian ritual tracking.
- Store keys in Bitwarden (`project UUID 4811be94-254e-465c-8ea6-b363013aaef8`).

Example:

```bash
curl -H "Authorization: Bearer fold_sk_KEY" \
     https://elidorascodex.com/wp-json/tec-tgcr/v1/cards
```

## WordPress / Arcadia Bridge

- Credentials: `TEC_WPCOM_API_PASS`, `WPCOM_SSH_USER`.
- Used for publishing docs + resonance cards to the WordPress front-end.
- Rotate credentials whenever staging directories leak.

## GitHub Webhook Automation

Summarized from `docs/deployment/GITHUB_WEBHOOK_SETUP.md`:

- Endpoint: `/api/webhook/github`
- Events: push, pull_request (merged), release.
- Flow: GitHub payload → signature validation → docs diff → search index rebuild → notify website.
- Deploy via FastAPI (Heroku/Docker/AWS Lambda). Keep `GITHUB_WEBHOOK_SECRET` synced between GitHub + backend.

## Project Coordination (Project #6)

From `_TRANSFER_STAGING/docs_incoming/COORDINATION_INTEGRATION.md`:

- Central board: `https://github.com/orgs/TEC-The-ELidoras-Codex/projects/6`
- Workflow: Backlog → Ready → In Progress → Review → Blocked → Done.
- `PROJECTS_TOKEN` rotates every 90 days; scopes `repo` + `project`.
- Use `docs/PROJECT_AUTOMATIONS.md` for recipes (issue auto-move, release gating).

## Context Package Automation

- Hook `ContextPackage` (see `05_CORE_CONTEXT_PACKAGE_SPEC.md`) into every API call.
- Store records in Aqueduct “Springs.”
- Validate lineage + consent before calling downstream providers (OpenAI, WordPress, Spotify).

## Reminder

Automations should always emit provenance cards (what automation ran, by whom, for which issue) so humans can audit them later.
