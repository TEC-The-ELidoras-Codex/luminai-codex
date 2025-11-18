# LuminAI Codex — Platform Architecture Map

**Last Updated**: November 15, 2025  
**Purpose**: Single source of truth for all services, deployments, and integrations

---
title: Platform Architecture

## System Overview

The LuminAI Codex platform consists of multiple independent but coordinated services:

### Core Services (Docker Compose)

| Service | Technology | Port | Status | Purpose |
|---------|-----------|------|--------|---------|
| **Backend** | FastAPI (Python 3.11) | 8000 | 🟢 Active | Resonance API, ethics framework, WebSocket, health checks |
| **Frontend** | Next.js 14 (TypeScript) | 3000 | 🟢 Active | Consent UI, emoji protocol, chat interface |
| **Ollama** | LLM runtime | 11434 | 🟢 Active | Local LLM inference (llama3.2:3b default) |
| **PostgreSQL** | Database | 5432 | 🟢 Active | User data, session storage, memory persistence |
| **Redis** | Cache | 6379 | 🟢 Active | Session cache, rate limiting, queue management |
| **ChromaDB** | Vector DB | 8002 | 🟢 Active | Semantic search, memory retrieval, RAG |
| **Unsloth** | Fine-tuning env | 8001 | 🟡 Optional | Model training, LoRA fine-tuning |
| **Jupyter** | Notebook server | 8888 | 🟡 Optional | Research, experimentation, demos |

### Node.js Modular System (Harmony)

Located in `modules/`, runs separately from Docker stack:

| Module | Icon | Port | Purpose |
|--------|------|------|---------|
| **Resonance Engine** | 🧠 | N/A | Multi-LLM orchestration (OpenAI, Anthropic, xAI) |
| **Codex Hub** | 📚 | N/A | Memory storage, search indexing, session management |
| **Arcadia Portal** | 🌐 | N/A | Discord, Slack, GitHub, Notion integrations |

**Entry Point**: `bootstrap.js` (starts Harmony event bus + all modules)

### Python Agent Stack

Located in `src/tec_tgcr/`, installable package:

| Component | Path | Purpose |
|-----------|------|---------|
| **Airth Research Guard** | `agents/airth/` | Evidence validation, fact-checking, source verification |
| **CLI** | `interfaces/cli/` | Command-line tools (`tec-agent`, `tec-env-check`) |
| **Ethics Framework** | `core/ethics/` | ConsentOS, Axioms, Structural Evil specs |
| **API Client** | `core/api/` | Backend communication, session management |

**Install**: `pip install -e .`

date_created: 2025-11-16
date_updated: 2025-11-16
status: draft
approvers:
  - persona: Ely
    role: Engineering Steward
owner_checklist:
  - [ ] Read and understood
  - [ ] Cross-linked in TEC_HUB.md and STRUCTURE.md
  - [ ] Tested commands/steps (if procedural)
  - [ ] Old version archived if replaced
tags: [docs]
---

## Deployment Targets

### Local Development

**Quick Start**:

```bash
# Option 1: Automated script
./scripts/development/local_up.sh

# Option 2: Manual
docker compose up -d backend frontend postgres redis ollama
```

**URLs**:

- Backend: <http://localhost:8000>
- Frontend: <http://localhost:3000>
- Ollama: <http://localhost:11434>
- ChromaDB: <http://localhost:8002>
- Jupyter: <http://localhost:8888>

**Teardown**:

```bash
./scripts/development/local_down.sh [--prune]
```

### Discord Bot

**Status**: 🟡 Not Deployed  
**Code**: `modules/arcadia-portal/platforms/discord.js`  
**Dependencies**: Discord API token, guild permissions  
**Deployment Guide**: `docs/deployment/DISCORD_BOT_SETUP.md` (TBD)

### WordPress Plugins

**Status**: 🟡 Not Deployed  
**Plugins**:

1. LuminAI Resonance Widget (TBD)
2. TEC Ethics Validator (TBD)

**Deployment Guide**: `docs/deployment/WORDPRESS_PLUGIN_SETUP.md` (TBD)

### GitHub App

**Status**: 🟢 Configured  
**App Name**: LuminAI Codex (GitHub App)  
**Webhooks**: Configured for PR reviews, issue comments  
**Deployment**: Managed via GitHub App settings  
**Secrets**: `GITHUB_APP_ID`, `GITHUB_APP_PRIVATE_KEY` in GitHub Secrets

### Production (Proposed)

**Status**: 🔴 Not Deployed  
**Target**: Azure/AWS/GCP (TBD)  
**Requirements**:

- Kubernetes cluster or Docker Swarm
- Managed PostgreSQL instance
- Redis cluster
- Load balancer for backend/frontend
- SSL certificates (Let's Encrypt)

---

## Service Dependencies

### Backend Dependencies

```
PostgreSQL (user db, session storage)
├── Redis (session cache)
└── Ollama (local LLM fallback)
    └── Backend /api/resonance endpoints
        └── Frontend chat UI
```

### Frontend Dependencies

```
Backend API (:8000)
└── /health (health check)
└── /api/resonance/calculate (R computation)
└── /api/message (chat endpoint)
└── /ws/chat/{session_id} (WebSocket)
```

### Harmony Dependencies

```
Resonance Engine 🧠
├── OpenAI API (requires OPENAI_API_KEY)
├── Anthropic API (requires ANTHROPIC_API_KEY)
├── xAI API (requires XAI_API_KEY)
└── Demo mode (fallback, no keys required)

Codex Hub 📚
└── Receives memories from Resonance Engine

Arcadia Portal 🌐
├── Discord (requires DISCORD_BOT_TOKEN)
├── Slack (requires SLACK_BOT_TOKEN)
├── GitHub (requires GITHUB_TOKEN)
└── Notion (requires NOTION_TOKEN)
```

---

## Ports & URLs Reference

| Port | Service | Protocol | Endpoint Examples |
|------|---------|----------|-------------------|
| 3000 | Frontend | HTTP | `/`, `/chat`, `/consent` |
| 8000 | Backend | HTTP/WS | `/health`, `/api/resonance/calculate`, `/ws/chat/123` |
| 8001 | Unsloth | HTTP | `/train`, `/status` |
| 8002 | ChromaDB | HTTP | `/api/v1/collections` |
| 5432 | PostgreSQL | TCP | postgres://luminai:luminai@localhost:5432/luminai |
| 6379 | Redis | TCP | redis://localhost:6379 |
| 8888 | Jupyter | HTTP | `/lab`, `/tree` |
| 11434 | Ollama | HTTP | `/api/generate`, `/api/tags`, `/api/pull` |

---

## Environment Variables

### Backend

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `DATABASE_URL` | ✅ | postgres://luminai:luminai@postgres:5432/luminai | PostgreSQL connection |
| `REDIS_URL` | ✅ | redis://redis:6379 | Redis connection |
| `OLLAMA_URL` | ✅ | <http://ollama:11434> | Ollama API endpoint |
| `OPENAI_API_KEY` | ⚠️ | None | OpenAI API access (optional) |
| `ANTHROPIC_API_KEY` | ⚠️ | None | Anthropic API access (optional) |
| `XAI_API_KEY` | ⚠️ | None | xAI API access (optional) |

### Frontend

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `NEXT_PUBLIC_API_URL` | ✅ | <http://localhost:8000> | Backend API URL |

### Harmony (Node.js)

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `OPENAI_API_KEY` | ⚠️ | None | OpenAI API (falls back to demo mode) |
| `ANTHROPIC_API_KEY` | ⚠️ | None | Anthropic API |
| `XAI_API_KEY` | ⚠️ | None | xAI API |
| `DISCORD_BOT_TOKEN` | ⚠️ | None | Discord integration |
| `GITHUB_TOKEN` | ⚠️ | None | GitHub integration |

**Note**: ⚠️ = Optional but degraded functionality without it

---

## Data Flow

### Chat Request (Frontend → Backend → LLM)

```
1. User types message in frontend (port 3000)
2. Frontend sends POST /api/message to backend (port 8000)
3. Backend validates consent state (ConsentOS)
4. Backend checks axiom compliance (Resonance Axioms)
5. Backend sends to Ollama (port 11434) or external LLM API
6. LLM response returns through backend
7. Backend stores exchange in PostgreSQL
8. Backend updates memory index in ChromaDB
9. Frontend displays response with consent indicators
```

### Memory Retrieval (RAG Pattern)

```
1. User query arrives at backend
2. Backend embeds query via Ollama
3. Backend searches ChromaDB for similar memories
4. Top-k results returned with metadata
5. Context injected into LLM prompt
6. Enhanced response generated
```

---

## Integration Points

### GitHub App

- **Webhooks**: Receives PR events, issue comments
- **Permissions**: Read repo, write comments
- **Deployment**: GitHub Secrets store private key
- **Code**: `modules/arcadia-portal/platforms/github.js`

### Discord Bot (Planned)

- **Events**: Message create, slash commands
- **Permissions**: Send messages, read history
- **Deployment**: Bot token in GitHub Secrets
- **Code**: `modules/arcadia-portal/platforms/discord.js`

### WordPress Plugins (Planned)

- **Integration**: REST API from WordPress to backend
- **Authentication**: API keys stored in WP options table
- **Deployment**: Upload plugin ZIP to WordPress admin

---

## Build & Test

### Local Build

```bash
# Build all images
docker compose build

# Build specific service
docker compose build backend

# No cache rebuild
docker compose build --no-cache backend
```

### Run Tests

```bash
# Python tests
pytest tests/

# Node.js modules
npm test

# Backend health check
curl http://localhost:8000/health
```

---

## Troubleshooting

### Backend won't start

**Symptoms**: `ModuleNotFoundError: No module named 'tec_tgcr'`

**Cause**: Dockerfile not copying `src/` folder

**Fix**: Rebuild backend: `docker compose up -d --build backend`

### Frontend shows connection refused

**Symptoms**: `ERR_CONNECTION_REFUSED` on localhost:3000

**Cause**: Frontend container not running or backend URL wrong

**Fix**:

```bash
docker compose ps  # Check if frontend is up
docker compose logs frontend  # Check logs
```

### Ollama model not found

**Symptoms**: `Model 'llama3.2:3b' not available`

**Fix**: Pull model manually:

```bash
docker exec luminai-ollama ollama pull llama3.2:3b
```

### Dependency conflicts

**Symptoms**: `ERROR: ResolutionImpossible` during pip install

**Fix**: Update `backend/requirements.txt` with compatible versions, rebuild

---

## Next Steps

- [ ] Deploy Discord bot to production server
- [ ] Create WordPress plugin installer
- [ ] Set up production Kubernetes cluster
- [ ] Configure CI/CD pipeline for automated deploys
- [ ] Implement monitoring & alerting (Prometheus, Grafana)
- [ ] Create backup/restore procedures for PostgreSQL

---

## Related Documentation

- [Deployment Readiness Report](reports/deployment/DEPLOYMENT_READINESS_REPORT.md)
- [TEC Hub](operations/TEC_HUB.md)
- [Docker Setup](MULTI_LLM_QUICK_START.md)
- [Environment Setup](docs/GETTING_STARTED.md)
