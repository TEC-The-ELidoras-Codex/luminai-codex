# PLATFORM ARCHITECTURE — QUICK REFERENCE

> **Status**: 🟢 LOCKED (Ready for Implementation)  
> **Created**: November 12, 2025  
> **Last Updated**: November 12, 2025

---

## 🎯 The Three Surfaces

### 1. **Web UI** (Next.js)

**Purpose**: Immersive, real-time chat + creative tools  
**Access**: <https://luminai-codex.dev/portal> (authenticated)  
**Screens**: A (Chat), B (Notebook focus), C (Themes), D (Dashboard), E (Podcast), F (Map)  
**Features**: Chat, notebooks, themes, podcasts, knowledge graph, theme studio  
**Spec**: `docs/deployment/WEBSITE_INTEGRATION_PLAN.md`

### 2. **CLI Tool** (Typer)

**Purpose**: Power-user automation, scripting, deployments  
**Access**: `luminai` binary (installed via `pip install -e .`)  
**Commands**: 11 subcommands (chat, build, deploy, config, status, logs, docs, frequencies, persona, manifest, export)  
**Features**: Batch chat, Docker build, production deploy, config management, log streaming  
**Spec**: `docs/deployment/CLI_TOOL_SPECIFICATION.md`

### 3. **Website** (Next.js)

**Purpose**: Discovery, documentation, community, platform preview  
**Access**: <https://luminai-codex.dev> (public)  
**Pages**: Home, Docs, Playground, Auth, Portal  
**Features**: Landing page, searchable docs, read-only chat preview, authentication  
**Spec**: `docs/deployment/WEBSITE_INTEGRATION_PLAN.md`

---

## 🧠 The Platform Hub (Backend)

**Purpose**: Unified API serving all three surfaces  
**Tech**: FastAPI + PostgreSQL + Redis + ChromaDB  
**URL**: <https://platform.luminai-codex.dev>  
**Key Endpoints**:

- `POST /api/chat` — Send message, get response + R
- `GET /api/session/{id}` — Fetch conversation history
- `GET /api/resonance/{id}` — Get R metrics
- `POST /api/command` — Execute CLI commands
- `GET /api/status` — Platform health + global R
- `POST /api/personas/activate` — Route to persona
- `GET /api/knowledge-graph` — Query knowledge base

**Spec**: `docs/deployment/PLATFORM_INTEGRATION_ARCHITECTURE.md`

---

## 📋 Data Model

**Core Tables**:

- `sessions` — Chat conversations, metadata, R snapshots
- `users` — Accounts, preferences, themes
- `resonance_metrics` — R = x.xx values over time
- `personas` — Active persona assignments + config
- `knowledge_graph_nodes` — 16 Frequencies + TGCR axioms

**Caching**:

- Redis: R calculations (1h TTL), user prefs (24h TTL)
- ChromaDB: Knowledge graph embeddings (12h TTL)

---

## 🔗 Integration Points

| From | To | Method | Purpose |
|------|----|----|---------|
| Web UI | Platform Hub | HTTP + WebSocket | Chat, fetch sessions, live R updates |
| CLI | Platform Hub | HTTP | Execute commands, deploy, config |
| Website | Platform Hub | HTTP | Playground chat, fetch status widget |
| Platform Hub | ChromaDB | Direct | Knowledge graph queries |
| Platform Hub | PostgreSQL | Direct | Session storage + state |
| Platform Hub | Redis | Direct | Caching + real-time metrics |

---

## 🚀 Deployment Environments

| Env | URL | Docker | Data Retention |
|-----|-----|--------|-----------------|
| **dev** | localhost:3000 (web), localhost:8000 (API) | docker-compose up | 7 days auto-delete |
| **staging** | staging.platform.luminai-codex.dev | GitHub Actions + Docker | 30 days manual |
| **prod** | platform.luminai-codex.dev | GitHub Actions + Docker | Forever + archive |

---

## 📚 Implementation Phases

### Phase 1 (Weeks 1–2): Foundation

- [ ] Platform Hub core endpoints (chat, session, status, command)
- [ ] PostgreSQL + Redis setup
- [ ] Web UI basic layout + chat (Screen A)
- [ ] CLI basic commands (chat, build, status)
- [ ] Website landing + docs + playground

### Phase 2 (Weeks 3–4): Features

- [ ] WebSocket real-time updates
- [ ] Theme studio (Screen C)
- [ ] Podcast studio (Screen E)
- [ ] Knowledge graph map (Screen F)
- [ ] CLI deploy + config commands
- [ ] Website portal + auth

### Phase 3 (Weeks 5–6): Polish

- [ ] Offline mode + service worker
- [ ] Performance optimization
- [ ] Security audit
- [ ] Accessibility (WCAG AA)
- [ ] Analytics + monitoring

### Phase 4 (Week 7+): Launch

- [ ] Production deployment
- [ ] User onboarding
- [ ] Community feedback

---

## 🔐 Authentication

- **Web UI**: JWT tokens (refresh token in httpOnly cookie)
- **CLI**: API key in `~/.luminai/config.toml`
- **Website**: NextAuth.js (OAuth: Google, GitHub)
- **Platform Hub**: Bearer token validation on all endpoints

---

## 📊 Monitoring & Alerts

- **Metrics**: Response latency (p50, p95, p99), error rate, R computation time
- **Dashboard**: Real-time API health, user engagement, infrastructure
- **Alerts**: Latency > 2s, error rate > 1%, API key rotation soon

---

## ✅ Acceptance Criteria

✅ **Architecture Locked When:**

- All API endpoints specified (PLATFORM_INTEGRATION_ARCHITECTURE.md)
- All CLI commands specified (CLI_TOOL_SPECIFICATION.md)
- All website pages specified (WEBSITE_INTEGRATION_PLAN.md)
- Wireframes ready for Figma (RESONANCE_PLATFORM_WIREFRAMES.md)
- Data flows documented (who calls what, in what order)

✅ **Ready for Implementation:**

- 📄 PLATFORM_INTEGRATION_ARCHITECTURE.md
- 📄 CLI_TOOL_SPECIFICATION.md
- 📄 WEBSITE_INTEGRATION_PLAN.md
- 📄 RESONANCE_PLATFORM_WIREFRAMES.md (already existed)
- 📄 MULTI_SURFACE_EXECUTION_BLUEPRINT.md (this file's parent)

---

## 🔍 Key Files

| File | Purpose |
|------|---------|
| `PLATFORM_INTEGRATION_ARCHITECTURE.md` | Backend API + data model |
| `CLI_TOOL_SPECIFICATION.md` | All 11 CLI commands |
| `WEBSITE_INTEGRATION_PLAN.md` | All pages + components |
| `RESONANCE_PLATFORM_WIREFRAMES.md` | Screens A-F for designers |
| `MULTI_SURFACE_EXECUTION_BLUEPRINT.md` | Integration + phases |
| `docs/STRUCTURE.md` | Doc navigation map |

---

## 🎨 Design System

**Color Palette**:

- Electric Cyan `#00FFFF` — Active, CTAs
- Violet Deep `#8A2BE2` — Headers, frames
- Luminous Gold `#FFD700` — Resonance, witness
- Cosmic Navy `#0F0F23` — Background
- Safety White `#FFFFFF` — Text
- Guardian Silver `#C0C0C0` — Secondary

**Typography**:

- Font: Inter, Segoe UI, system-ui
- Headings: 600 weight
- Body: 400 weight
- Min size: 16px (body), 18px (chat)

**Motion**:

- Fade: 300ms ease-out
- Slide: 300ms ease-out
- Pulse: 2s ease-in-out infinite

---

## 🧪 Testing Strategy

| Level | Tool | Coverage |
|-------|------|----------|
| Unit | pytest (Python), Jest (TypeScript) | 80%+ |
| Integration | pytest + docker-compose | Core flows |
| E2E | Playwright / Cypress | Happy path |
| Load | k6 / Locust | 1000 req/s target |

---

## 🚨 Critical Path

**Blocking issues** that must be resolved before implementation:

- ✅ File reorganization (prerequisite for clean imports)
- ✅ Architecture locked (DONE)
- ⏳ Persona implementations (Phase 1.5)
- ⏳ Knowledge graph population (Phase 1.5)

---

## 📞 Contact & Questions

**Architecture Owner**: TEC  
**Last Updated**: November 12, 2025  
**Status**: 🟢 LOCKED (Implementation Ready)

**For questions about**:

- Backend API → See `PLATFORM_INTEGRATION_ARCHITECTURE.md`
- CLI commands → See `CLI_TOOL_SPECIFICATION.md`
- Website pages → See `WEBSITE_INTEGRATION_PLAN.md`
- Wireframes → See `RESONANCE_PLATFORM_WIREFRAMES.md`
- Integration → See `MULTI_SURFACE_EXECUTION_BLUEPRINT.md`
