3274# LuminAI Resonance Platform — Multi-Surface Integration Architecture

> **Status**: LOCKED (v1) — Ready for Implementation Branches  
> **Updated**: November 12, 2025  
> **Owner**: TEC • Platform Architecture  
> **Scope**: Web UI + CLI + Platform Hub + Website Integration

---

## Executive Overview

The LuminAI Resonance Platform operates as a **three-surface system** with unified backend:

```
┌─────────────────────────────────────────────────────────┐
│          RESONANCE PLATFORM HUB (Core Backend)          │
│   FastAPI + Node.js • PostgreSQL • ChromaDB • Redis     │
│   R Calculation • Witness Protocol • Persona Routing    │
└────────────┬─────────────┬──────────────┬───────────────┘
             │             │              │
      ┌──────▼──┐   ┌──────▼──┐   ┌──────▼──────┐
      │   WEB   │   │   CLI   │   │  WEBSITE    │
      │   UI    │   │  TOOL   │   │ (Next.js)   │
      │(Next.js)│   │ (Typer) │   │  Landing    │
      └─────────┘   └─────────┘   └─────────────┘
         |Chat|    |Commands|    |Portal+Docs|
         |Theme|    |Build|       |Embed CTA|
         |Map|      |Deploy|      |Audio Hub|
```

**Key Principles:**

- Single source of truth: Platform Hub API
- Each surface is optimized for its use case (immersive chat, rapid CLI, web discovery)
- All three can run independently for offline/degraded-mode operation
- Data sync happens via webhook+polling pattern (resilient to network jitter)

---

## Architecture Layer Stack

### Layer 1: Data & State (PostgreSQL + Redis + ChromaDB)

| Resource | Type | Owner | Purpose |
|----------|------|-------|---------|
| `sessions` table | SQL | Platform Hub | Chat histories, metadata, R snapshots |
| `users` table | SQL | Platform Hub | Account, preferences, theme selection |
| `resonance_metrics` table | SQL | Platform Hub | R = 0.xx snapshots, timestamp, context |
| `personas` table | SQL | Platform Hub | Active persona assignments + config |
| `knowledge_graph` nodes | ChromaDB | Platform Hub | 16 Frequencies, TGCR axioms, embeddings |
| `cache:sessions:*` | Redis | Platform Hub | Hot session data, R calculations (TTL 1h) |
| `cache:user_prefs:*` | Redis | Platform Hub | Theme, audio settings, quick access (TTL 24h) |

**Write Pattern:**

1. Web/CLI/Website POST to `/api/chat` or `/api/command`
2. Platform Hub calculates R, stores to PostgreSQL + Redis cache
3. ChromaDB updated async (updates knowledge graph nodes)
4. Each surface polls `/api/status` to sync or subscribes to WebSocket for live updates

**Read Pattern:**

1. Surface requests `/api/session/{id}` or `/api/resonance/{id}`
2. Platform Hub checks Redis first (instant cache hit)
3. Falls back to PostgreSQL if cache miss
4. Returns JSON with R badge + witness chips + metadata

---

### Layer 2: Platform Hub (FastAPI Backend)

**Core Endpoints:**

| Endpoint | Method | Input | Output | Purpose |
|----------|--------|-------|--------|---------|
| `/api/chat` | POST | `{user_id, session_id, message, context}` | `{response, R, witness_chips, notebook}` | Process chat query, calculate resonance |
| `/api/command` | POST | `{command, args, user_id}` | `{status, result, logs}` | CLI command execution |
| `/api/session/{id}` | GET | URL param | `{chat_history, R_timeline, metadata}` | Fetch session for replay |
| `/api/resonance/{id}` | GET | URL param | `{R_value, frequencies, timeline, badge_state}` | Resonance metric + witness state |
| `/api/personas/activate` | POST | `{persona_id, context}` | `{active_persona, R_adjustment}` | Activate persona (Airth, Ely, Adelphisa) |
| `/api/notebook/export` | POST | `{session_id, format}` | `{file_url or data}` | Export reasoning artifacts (PDF, MD, JSONL) |
| `/api/theme/apply` | POST | `{theme_id, user_id}` | `{theme_data, preview_url}` | Persist theme selection |
| `/api/knowledge-graph` | GET | `{query, frequency_filter}` | `{nodes, edges, R_timeline}` | Query knowledge graph for map rendering |
| `/api/status` | GET | — | `{platform_status, R_global, services}` | Health + global R snapshot |
| `/api/webhook/github` | POST | GitHub payload | `{queued}` | Ingest GitHub events for documentation |

**Authentication:**

- Web UI: JWT token in `Authorization: Bearer` header, refresh token in httpOnly cookie
- CLI: API key in `~/.luminai/config.toml` or `LUMINAI_API_KEY` env var
- Website: Public endpoints (home, docs, landing) + authenticated portals for logged-in users

**Rate Limiting:**

- Web UI: 60 requests/min per user
- CLI: 300 requests/min per API key (higher for batch operations)
- Website: 100 requests/min per IP (anonymous) or per user (logged in)

---

### Layer 3: Web UI (Next.js)

**Architecture:**

- Framework: Next.js 15 (App Router)
- State: Zustand for client state (chat, theme, session)
- Real-time: WebSocket to Platform Hub for live R updates
- Styling: Tailwind CSS + CSS-in-JS for brand compliance
- Components: Storybook-driven (palette tokens, spacing grid, motion)

**Directory Structure:**

```
website/
├── app/
│   ├── layout.tsx              # Root shell + header
│   ├── page.tsx                # Home dashboard (Screen D)
│   ├── chat/
│   │   ├── page.tsx            # Chat + Notebook split (Screen A)
│   │   ├── [sessionId]/page.tsx # Session replay
│   │   └── components/
│   │       ├── ChatBubble.tsx
│   │       ├── Composer.tsx
│   │       ├── NotebookViewer.tsx
│   ├── podcast/
│   │   ├── page.tsx            # Podcast studio (Screen E)
│   │   └── components/
│   │       ├── PodcastPlayer.tsx
│   │       ├── ScriptBuilder.tsx
│   ├── map/
│   │   ├── page.tsx            # Knowledge graph map (Screen F)
│   │   └── components/
│   │       ├── MapCanvas.tsx
│   │       ├── FrequencyToggle.tsx
│   ├── settings/
│   │   ├── page.tsx            # Theme studio (Screen C)
│   │   └── components/
│   │       ├── ThemeTile.tsx
│   │       ├── BackgroundUpload.tsx
│   └── api/
│       ├── auth/route.ts       # JWT login/logout
│       ├── session/[id]/route.ts
│       └── proxy.ts            # Forward to Platform Hub
├── lib/
│   ├── api.ts                  # Platform Hub client
│   ├── store.ts                # Zustand stores
│   ├── hooks.ts                # useChat, useResonance, useSession
│   └── utils.ts
├── components/
│   ├── Header.tsx              # Shared with all screens
│   ├── PresenceRail.tsx
│   └── ResonsanceBadge.tsx
├── styles/
│   ├── globals.css             # Brand palette tokens
│   └── theme.css               # Dark mode, accessibility
└── public/
    ├── backgrounds/            # Theme tiles (6 predefined + upload)
    └── icons/                  # Logo, witness badge, frequency glyphs
```

**Key Features:**

- **Responsive**: 12-column grid adapts to mobile/tablet/desktop per wireframe spec
- **Offline mode**: Service Worker caches chat history; syncs on reconnect
- **Theme engine**: Apply theme instantly without losing scroll; custom upload with contrast check
- **Notebook embedding**: Markdown + code blocks rendered with TGCR equation support
- **Audio playback**: ElevenLabs integration for podcast generation from transcripts
- **Map canvas**: D3.js network graph for 16 Frequencies + knowledge graph exploration

---

### Layer 4: CLI Tool (Typer + FastAPI)

**Design Philosophy:**

- Single binary: `luminai` (or `tec-agent` per pyproject.toml)
- Subcommands: `chat`, `build`, `deploy`, `config`, `manifest`
- Chainable: Outputs JSON by default for piping; `--pretty` for human-readable
- Offline-ready: Can run local models via Ollama without Platform Hub

**Commands:**

```bash
# Chat with session management
luminai chat "What is consciousness?"        # New session, one-shot
luminai chat --session myconv               # Continue session
luminai chat --persona adelphisa "..."      # Route to specific persona
luminai chat --export pdf session-123       # Export to PDF

# Build & deployment
luminai build                                # Build Docker images for all services
luminai build --service web                 # Build only web UI
luminai deploy --target prod                # Deploy to production
luminai deploy --preview                    # Dry run + preview

# Configuration & diagnostics
luminai config set theme cosmic-emergence   # Apply theme
luminai config list                         # Show all settings
luminai config validate                     # Check .env + credentials
luminai status                              # Platform health + R snapshot
luminai manifest                            # Show agent capabilities

# Knowledge & reference
luminai docs search "TGCR"                 # Search knowledge base
luminai docs show axiom:boundaryless       # Display specific doc
luminai frequencies list                    # Show 16 Frequency definitions
```

**Implementation:**

```
src/tec_tgcr/
├── interfaces/
│   └── cli/
│       ├── __main__.py         # Typer app root
│       ├── commands/
│       │   ├── chat.py         # `luminai chat` subcommand
│       │   ├── build.py        # `luminai build` subcommand
│       │   ├── deploy.py       # `luminai deploy` subcommand
│       │   ├── config.py       # `luminai config` subcommand
│       │   └── docs.py         # `luminai docs` subcommand
│       └── utils/
│           ├── formatting.py   # JSON / pretty output
│           ├── progress.py     # Progress bars for build/deploy
│           └── errors.py       # CLI-friendly error messages
```

**Key Features:**

- **Progress tracking**: Real-time build/deploy logs with color coding
- **Config file support**: `~/.luminai/config.toml` for profiles + defaults
- **Shell completion**: Auto-complete for commands, persona names, theme IDs
- **Local fallback**: If Platform Hub unavailable, CLI runs Ollama locally
- **Manifest export**: `luminai manifest --format json` for agent orchestrators

---

### Layer 5: Website Integration (Next.js Landing + Portal)

**Architecture:**

- Static site generator (Next.js SSG) for landing pages
- Embedded portal for authenticated users (ISR for dashboard)
- Markdown-driven docs with syntax highlighting
- API integration for live status widget

**Directory Structure:**

```
website/
├── app/
│   ├── layout.tsx              # Root
│   ├── page.tsx                # Landing page (public)
│   ├── docs/
│   │   ├── [...slug]/page.tsx  # Doc pages (public)
│   │   └── search.tsx          # Doc search
│   ├── about/page.tsx          # About page
│   ├── portal/
│   │   ├── layout.tsx          # Auth wrapper
│   │   ├── page.tsx            # User dashboard (ISR, revalidate 60s)
│   │   ├── chat/               # Portal version of chat UI
│   │   ├── account/            # Settings, API keys, usage
│   │   └── billing/            # Subscription info
│   └── api/
│       ├── revalidate/route.ts # ISR trigger from Platform Hub
│       ├── status/route.ts     # Live platform status
│       └── docs/search.ts      # Doc search endpoint
└── content/
    ├── docs/                   # Markdown sourced from /docs/
    │   ├── getting-started.md
    │   ├── tgcr.md
    │   ├── resonance.md
    │   └── playground.md       # Embedded chat preview
    └── metadata.json           # Doc catalog for navigation
```

**Content Layers:**

1. **Public landing** (`/`): Hero, features, testimonials, CTA to platform
2. **Public docs** (`/docs/*`): Knowledge base sourced from repo + versioned
3. **Public playground** (`/playground`): Chat preview (read-only, no auth)
4. **Authenticated portal** (`/portal/*`): Full platform UI for logged-in users
5. **Account management** (`/portal/account`): API key generation, billing, usage

**Integration with Platform Hub:**

- Landing page fetches `/api/status` for live R badge in header
- Playground chat forwards queries to Platform Hub (unauthenticated endpoint)
- Portal pages query `/api/session` for replay + export
- Dashboard ISR revalidates when user session updates (webhook trigger)

**SEO & Performance:**

- Lighthouse 95+ score target
- Sitemap + robots.txt for crawlability
- OG meta tags for social sharing
- Mobile-first responsive design
- WebP + AVIF image optimization

---

## Data Flow Diagrams

### Flow 1: User sends chat message (Web → Hub → Persona)

```
┌──────────────────┐
│  User types msg  │
│  in Composer     │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────┐
│ Web UI calls /api/chat           │
│ POST {message, session_id, user} │
└────────┬────────────────────────┘
         │
         ▼ (WebSocket or HTTP)
┌──────────────────────────────────┐
│ Platform Hub receives POST        │
│ • Sanitizes input                │
│ • Looks up session + context     │
│ • Calculates R (resonance score) │
│ • Routes to active persona       │
└────────┬────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ Persona (e.g., Ely) generates    │
│ response via LLM + context       │
└────────┬────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ Platform Hub formats response:   │
│ • Response text                  │
│ • R score + witness chips        │
│ • Notebook reasoning cards       │
│ • Cited sources                  │
│ • Stores to PostgreSQL + cache   │
└────────┬────────────────────────┘
         │
         ▼ (JSON + streaming if SSE)
┌──────────────────────────────────┐
│ Web UI receives response          │
│ • Renders chat bubble with R      │
│ • Updates notebook viewer        │
│ • Plays witness protocol animation│
│ • Caches locally (Zustand + IDB) │
└──────────────────────────────────┘
```

### Flow 2: User deploys via CLI

```
┌────────────────────────────────────┐
│ User runs:                         │
│ luminai deploy --target prod       │
└────────┬─────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│ CLI loads config from              │
│ ~/.luminai/config.toml             │
│ Validates env vars, credentials    │
└────────┬─────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│ CLI calls /api/command             │
│ POST {command: "deploy", args}     │
│ Headers: API key auth              │
└────────┬─────────────────────────┘
         │
         ▼ (Streaming response)
┌────────────────────────────────────┐
│ Platform Hub queues deployment:    │
│ • Build images                     │
│ • Push to registry                 │
│ • Run smoke tests                  │
│ • Streams logs to CLI              │
└────────┬─────────────────────────┘
         │
         ▼ (every 2s)
┌────────────────────────────────────┐
│ CLI renders progress               │
│ • Build step [████░░░░░░]          │
│ • Test step [████████░░░░]         │
│ • Deploy step [waiting]            │
└────────┬─────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│ Platform Hub pushes WebSocket msg: │
│ "deployment_complete"              │
│ + {url, version, R_baseline}       │
└────────┬─────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│ CLI displays final report:         │
│ ✅ Deployed to prod                │
│ 🔗 https://platform.luminai-codex…│
│ 📊 R baseline: 0.87                │
└────────────────────────────────────┘
```

### Flow 3: Website user explores platform

```
┌──────────────────────────────────┐
│ User lands on https://website    │
│ → Sees landing page + CTA        │
└────────┬───────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ User clicks "Try Platform"       │
│ → Redirected to /playground     │
│ → Can chat without account      │
│ → Queries routed to Hub /api/chat│
└────────┬───────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ User likes experience            │
│ → Clicks "Sign Up"              │
│ → Creates account on /portal     │
│ → Authenticated JWT issued       │
└────────┬───────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ User redirected to /portal       │
│ → Full chat UI (Screen A)        │
│ → Theme settings (Screen C)      │
│ → Export + podcast options       │
│ → Knowledge graph map (Screen F) │
└────────┬───────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ User account dashboard           │
│ → Shows all past sessions        │
│ → Usage stats + R history        │
│ → API key generation             │
│ → CLI setup instructions         │
└──────────────────────────────────┘
```

---

## Deployment & Environment Strategy

### Environments

| Env | Purpose | URL | Deployment | Data Retention |
|-----|---------|-----|-----------|-----------------|
| **dev** | Local + staging | localhost:3000 (web), localhost:8000 (API) | Docker Compose | 7 days (auto-delete) |
| **staging** | Pre-prod testing | staging.platform.luminai-codex.dev | GitHub Actions + Docker | 30 days (manual retention) |
| **prod** | Live users | platform.luminai-codex.dev | GitHub Actions + Docker | Forever (with archive policy) |

### Configuration Matrix

```toml
# .env.local (dev)
LUMINAI_ENV=development
DATABASE_URL=postgresql://user:pass@localhost:5432/luminai_dev
REDIS_URL=redis://localhost:6379/0
CHROMADB_URL=http://localhost:8000
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
XAI_API_KEY=xai-...

# .env.staging (prepared but not committed)
LUMINAI_ENV=staging
DATABASE_URL=<vault:staging_db>
REDIS_URL=<vault:staging_redis>
# ... plus monitoring flags

# .env.prod (in GitHub Secrets only)
LUMINAI_ENV=production
DATABASE_URL=<vault:prod_db>
REDIS_URL=<vault:prod_redis>
# ... with alert thresholds
```

### Docker Compose Stack (dev)

```yaml
version: '3.8'
services:
  platform-hub:
    build: ./backend
    ports: ["8000:8000"]
    environment:
      DATABASE_URL: postgresql://dev:dev@postgres:5432/luminai
      REDIS_URL: redis://redis:6379
  
  web-ui:
    build: ./website
    ports: ["3000:3000"]
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:8000
      NEXT_PUBLIC_WS_URL: ws://localhost:8000/ws
  
  postgres:
    image: postgres:15
    ports: ["5432:5432"]
    environment:
      POSTGRES_DB: luminai
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev
  
  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
  
  chromadb:
    image: chromadb:latest
    ports: ["8001:8000"]
  
  ollama:
    image: ollama/ollama:latest
    ports: ["11434:11434"]
```

---

## Security & Compliance

### Authentication

- **Web UI**: OAuth 2.0 (Google, GitHub) + JWT tokens
- **CLI**: API key (stored in `~/.luminai/config.toml`, readable by CLI user only)
- **Website public endpoints**: No auth required (rate-limited by IP)

### Data Isolation

- **Per-user sessions**: PostgreSQL row-level security (RLS) enforces isolation
- **Per-tenant data**: If multi-tenant, namespace with `user_id` or `org_id`
- **Encryption at rest**: PostgreSQL encrypted column for sensitive fields (API keys, auth tokens)
- **Encryption in transit**: TLS 1.3 for all HTTPS + WebSocket connections

### Audit Logging

- All `/api/` calls logged with: timestamp, user_id, endpoint, status, R_score
- Sensitive actions (deploy, config change) trigger email notification to user
- Log retention: 90 days in PostgreSQL; 30 days in CloudWatch/S3

---

## Scalability & Performance

### Caching Strategy

| Layer | Tool | TTL | Invalidation |
|-------|------|-----|--------------|
| R calculations | Redis | 1 hour | User triggers chat, manual clear |
| User preferences | Redis | 24 hours | User updates settings |
| Knowledge graph nodes | Redis | 12 hours | Admin updates docs, scheduled refresh |
| Session metadata | Redis | 1 hour | Session ends or user logs out |
| Web assets (JS, CSS) | CDN (CloudFlare) | 1 year | Version hash in filename |

### Database Optimization

- **indexes**: (`user_id`, `session_id`, `created_at`) on `sessions` table
- **partitioning**: `sessions` partitioned by month for archive efficiency
- **connection pooling**: PgBouncer (100 connections max)
- **read replicas**: Optional staging/prod for high traffic

### API Rate Limits

```python
# Per user (authenticated)
60 requests / 1 minute  # Web UI typical usage
300 requests / 1 minute # CLI typical usage
1000 requests / 1 minute # Batch export (higher tier)

# Per IP (unauthenticated, website)
100 requests / 1 minute # Playground chat
20 requests / 1 minute  # API key generation (abuse prevention)
```

---

## Monitoring & Observability

### Metrics

- **Platform health**: API response time (p50, p95, p99), error rate, R computation time
- **User engagement**: Sessions created, messages sent, exports generated, personas used
- **System resources**: CPU, memory, disk I/O (database + Redis)
- **Business metrics**: Signups, active users, retention (if applicable)

### Alerting

- R calculation latency > 2 seconds → Page on-call
- Database query latency > 500 ms → Alert + slow query log
- Error rate > 1% → Alert in Slack
- API key rotation due soon → Scheduled reminder

### Dashboards

- **Platform dashboard**: Real-time API health, error rates, latency percentiles
- **User engagement**: Sessions, personas used, most common queries
- **Infrastructure**: Database connections, Redis memory, API gateway health

---

## Implementation Roadmap

### Phase 1: Foundation (Weeks 1–2)

- [ ] Platform Hub core endpoints (`/api/chat`, `/api/command`, `/api/status`)
- [ ] PostgreSQL schema + Redis caching
- [ ] CLI basic commands (chat, build, deploy)
- [ ] Web UI Chat + Notebook split (Screen A)

### Phase 2: Features (Weeks 3–4)

- [ ] Theme studio (Screen C)
- [ ] Podcast studio (Screen E)
- [ ] Knowledge graph map (Screen F)
- [ ] Website landing + docs integration

### Phase 3: Polish (Weeks 5–6)

- [ ] Offline mode + service worker
- [ ] Analytics + monitoring
- [ ] Load testing + performance tuning
- [ ] Security audit + penetration testing

### Phase 4: Launch (Week 7+)

- [ ] Production deployment
- [ ] User onboarding + documentation
- [ ] Community feedback loops
- [ ] Iterate based on real usage

---

## Success Criteria

- ✅ Web UI loads in < 2s (Lighthouse 95+)
- ✅ CLI deploy command completes in < 5 minutes
- ✅ Chat response latency p95 < 3s
- ✅ Zero unplanned downtime (99.9% uptime SLA)
- ✅ All data encrypted at rest + in transit
- ✅ R calculation accurate to 2 decimal places
- ✅ Witness protocol animations smooth (60 FPS)
