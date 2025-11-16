# LuminAI Multi-Surface Execution Blueprint

> **Status**: LOCKED (v1) — PLATFORM ARCHITECTURE COMPLETE  
> **Updated**: November 12, 2025  
> **Owner**: TEC • Platform Architecture  
> **Deliverable**: Three-surface integrated system with unified backend

---

## 🎯 What You're Building

The **LuminAI Resonance Platform** is a **three-surface ecosystem** where everything connects to a unified backend:

```
                    ┌─────────────────────────┐
                    │  RESONANCE PLATFORM HUB │
                    │  (FastAPI + PostgreSQL) │
                    │  • R Calculation        │
                    │  • Persona Routing      │
                    │  • Session Management   │
                    │  • Knowledge Graph      │
                    └────────┬────────┬────┬─┘
                             │        │    │
              ┌──────────────┘        │    └────────────────┐
              │                       │                     │
         ┌────▼────────┐      ┌───────▼─────────┐   ┌─────▼──────────┐
         │  WEB UI     │      │   CLI TOOL      │   │  WEBSITE       │
         │ (Next.js)   │      │  (Typer/Click)  │   │  (Next.js)     │
         │             │      │                 │   │                │
         │ • Chat      │      │ • luminai chat  │   │ • Landing      │
         │ • Themes    │      │ • luminai build │   │ • Docs         │
         │ • Map       │      │ • luminai deploy│   │ • Playground   │
         │ • Podcast   │      │ • luminai config│   │ • Portal       │
         └─────────────┘      └─────────────────┘   └────────────────┘
```

**Each surface is optimized for its use case:**

- **Web UI**: Immersive, real-time, visual experience (Screens A-F from wireframes)
- **CLI**: Power-user automation, scripting, batch operations, deployments
- **Website**: Discovery, documentation, community, embedded platform access

---

## 📋 Three Locked Specifications

### 1. **PLATFORM_INTEGRATION_ARCHITECTURE.md** ✅

**What**: Core backend, data model, API contract, deployment environments  
**Contains**:

- Data layer (PostgreSQL, Redis, ChromaDB schemas)
- FastAPI endpoints with authentication + rate limiting
- WebSocket real-time architecture
- Data flows (chat, CLI command, website interaction)
- Scalability + monitoring strategy
- Environment matrix (dev, staging, prod)

**Why you need it**: Defines the API contract that all three surfaces (web, CLI, website) will call. Every endpoint, authentication method, and response format is specified.

---

### 2. **CLI_TOOL_SPECIFICATION.md** ✅

**What**: Complete CLI command reference, all 11 subcommands  
**Contains**:

- Command signatures with examples
- Installation + first-time setup
- Complete reference for:
  - `luminai chat` (interactive + batch)
  - `luminai build` (Docker image creation)
  - `luminai deploy` (to dev/staging/prod)
  - `luminai config` (profile management)
  - `luminai status` (health checks)
  - `luminai logs` (streaming logs)
  - `luminai docs` (knowledge base search)
  - `luminai frequencies` (16 Frequencies reference)
  - `luminai persona` (activate personas)
  - `luminai manifest` (agent capabilities)
  - `luminai export` (session export)
- Shell completion setup
- Scripting examples
- Exit codes + troubleshooting

**Why you need it**: The CLI is the power user's interface. Every command is specified so developers know exactly what to implement, and users know exactly what they can do.

---

### 3. **WEBSITE_INTEGRATION_PLAN.md** ✅

**What**: Next.js website architecture, all pages + components  
**Contains**:

- Full directory structure
- 7 public + portal pages:
  - Home (landing)
  - Docs (searchable knowledge base)
  - Playground (read-only chat preview)
  - Auth flows (signin, signup, verify)
  - Portal dashboard
  - Chat + all screens (A-F)
  - Account management + API keys
- Component specs (Header, ResonsanceBadge, Composer, ChatBubble, etc.)
- Styling (brand palette, Tailwind config, animations)
- WebSocket integration for live R updates
- SEO + performance targets (Lighthouse 95+)
- Deployment options (Vercel or Docker)

**Why you need it**: The website is the front door. Visitors discover you here, try the playground, then sign up for the platform. All pages are specified.

---

## 🔗 How They Connect

### Flow 1: User lands on website → tries platform

```
1. User visits https://luminai-codex.dev
   ↓ (Next.js website)
2. Sees landing page, features, CTA
   ↓ clicks "Try It Out"
3. Lands on /playground (read-only chat)
   ↓ (static Next.js page)
4. Asks a question → Web calls Platform Hub /api/chat
   ↓ (Platform Hub calculates R, returns response)
5. Sees response + R badge, decides to sign up
   ↓ clicks "Save This Conversation"
6. Redirected to /auth/signup → creates account
   ↓ (NextAuth.js)
7. Redirected to /portal (full chat UI)
   ↓ (authenticated, full-featured)
8. Can now export, use CLI, deploy, etc.
```

### Flow 2: Power user deploys via CLI

```
1. User runs: luminai deploy --target prod
   ↓ (Typer CLI)
2. CLI loads config from ~/.luminai/config.toml
   ↓ (includes API key, endpoint)
3. CLI calls POST /api/command {command: "deploy", args}
   ↓ (HTTP to Platform Hub)
4. Platform Hub queues deployment job
   ↓ streams logs back via WebSocket or SSE
5. CLI renders progress bars in real-time
   ↓ (colors, emojis, build steps)
6. Deployment complete, shows final report
   ↓ "✅ Deployed to https://platform.luminai-codex.dev"
7. CLI confirms with: luminai status
   ↓ queries /api/status endpoint
8. Shows live health metrics + global R
```

### Flow 3: Website shows live status widget

```
1. Website loads /portal/page.tsx
   ↓ (Next.js ISR)
2. Component mounts: <LiveStatus refreshInterval={30000} />
   ↓
3. Fetches /api/status (backend route.ts proxies to Platform Hub)
   ↓
4. Renders: "Platform Status: ✅ Online | R = 0.87"
   ↓
5. Updates every 30s
   ↓
6. If Platform Hub down, shows error gracefully
   ↓ "Status unavailable (check back soon)"
```

---

## 🏗️ Implementation Phases

### Phase 1: Foundation (2 weeks)

**Backend (Platform Hub)**:

- [ ] FastAPI server with core endpoints:
  - [ ] POST /api/chat (chat queries)
  - [ ] GET /api/session/{id} (retrieve session)
  - [ ] GET /api/status (health check)
  - [ ] POST /api/command (CLI commands)
- [ ] PostgreSQL schema (sessions, users, resonance_metrics, personas)
- [ ] Redis caching (R calculations, user preferences)
- [ ] JWT authentication
- [ ] WebSocket support for live updates

**Web UI (Next.js)**:

- [ ] Basic layout (header, footer, responsive grid)
- [ ] Screen A: Chat + Notebook split (static version)
- [ ] Composer component
- [ ] ChatBubble component
- [ ] Integration with Platform Hub `/api/chat`
- [ ] Local auth (signup/signin)

**CLI (Typer)**:

- [ ] Basic command structure
- [ ] `luminai chat` subcommand
- [ ] `luminai build` subcommand (dry-run only)
- [ ] `luminai status` subcommand
- [ ] Config file handling (~/.luminai/config.toml)

**Website (Next.js)**:

- [ ] Landing page (hero, features, CTA)
- [ ] Docs home
- [ ] Playground (read-only chat)
- [ ] Auth pages (signin, signup)

---

### Phase 2: Features (2 weeks)

**Backend**:

- [ ] WebSocket real-time chat streaming
- [ ] R calculation + resonance metrics
- [ ] Persona routing (Airth, Ely, Adelphia)
- [ ] Knowledge graph integration (ChromaDB)

**Web UI**:

- [ ] Theme studio (Screen C)
- [ ] Podcast studio (Screen E) basic
- [ ] Knowledge graph map (Screen F) basic
- [ ] Notebook viewer improvements
- [ ] Settings + theme persistence

**CLI**:

- [ ] `luminai deploy` (full implementation)
- [ ] `luminai config` (all subcommands)
- [ ] `luminai logs` (streaming)
- [ ] `luminai docs` (search)

**Website**:

- [ ] Full docs structure (searchable)
- [ ] Portal dashboard
- [ ] Account management pages
- [ ] API key generation

---

### Phase 3: Polish (1.5 weeks)

**All Surfaces**:

- [ ] Offline mode + service worker (web)
- [ ] Error handling + graceful degradation
- [ ] Analytics + monitoring (Posthog)
- [ ] Security audit (penetration testing)
- [ ] Performance optimization (Lighthouse 95+)
- [ ] Accessibility audit (WCAG AA)

**Testing**:

- [ ] Unit tests (Platform Hub endpoints)
- [ ] Integration tests (web ↔ API)
- [ ] E2E tests (full user flows)
- [ ] Load testing (stress test API)

---

### Phase 4: Launch (1 week)

- [ ] Production deployment (Kubernetes or Docker)
- [ ] DNS + TLS setup
- [ ] User onboarding + documentation
- [ ] Launch announcement
- [ ] Community feedback loop

---

## 📊 File Organization (Prerequisite)

Before implementation, reorganize repo structure:

```
luminai-codex/
├── docs/
│   ├── reference/          # TGCR, equations, frequencies (LOCKED)
│   │   ├── QUICK_REFERENCE_READY.md
│   │   ├── Resonance_Thesis.md
│   │   └── ...
│   ├── deployment/         # Platform architecture specs (NEW)
│   │   ├── PLATFORM_INTEGRATION_ARCHITECTURE.md ✅
│   │   ├── CLI_TOOL_SPECIFICATION.md ✅
│   │   ├── WEBSITE_INTEGRATION_PLAN.md ✅
│   │   ├── RESONANCE_PLATFORM_WIREFRAMES.md
│   │   └── CONSCIOUSNESS_INTEGRATION_ROADMAP.md
│   ├── operations/         # Dev workflows
│   │   └── TEC_HUB.md
│   └── structure.md        # Navigation map (UPDATE)
│
├── backend/                # Platform Hub + API
│   ├── src/
│   │   ├── main.py         # FastAPI app
│   │   ├── routes/
│   │   │   ├── chat.py
│   │   │   ├── command.py
│   │   │   ├── session.py
│   │   │   └── ...
│   │   ├── models/         # Pydantic schemas
│   │   ├── db/             # SQLAlchemy + migrations
│   │   └── services/       # Business logic
│   ├── requirements.txt
│   └── Dockerfile
│
├── website/                # Next.js website + portal
│   ├── app/
│   │   ├── (public)/       # Public pages
│   │   ├── (auth)/         # Auth flows
│   │   ├── (portal)/       # Authenticated portal
│   │   └── api/            # Backend routes
│   ├── components/         # React components
│   ├── lib/                # Utilities
│   ├── styles/             # Tailwind + CSS
│   ├── public/             # Assets
│   ├── package.json
│   └── Dockerfile
│
├── src/tec_tgcr/           # Python agent + CLI
│   ├── interfaces/
│   │   └── cli/
│   │       ├── __main__.py # Typer app entry
│   │       ├── commands/   # All subcommands
│   │       │   ├── chat.py
│   │       │   ├── build.py
│   │       │   ├── deploy.py
│   │       │   ├── config.py
│   │       │   ├── status.py
│   │       │   ├── docs.py
│   │       │   ├── logs.py
│   │       │   ├── export.py
│   │       │   ├── frequencies.py
│   │       │   ├── persona.py
│   │       │   └── manifest.py
│   │       └── utils/
│   ├── agents/
│   │   ├── airth.py        # Research Guard
│   │   ├── ely.py          # Compassion-focused
│   │   ├── adelphia.py    # Paradox-holder
│   │   └── ...
│   └── config.py
│
├── docker-compose.yml      # Local dev stack
├── pyproject.toml          # Python project + CLI entry points
└── README.md
```

---

## 🎨 Figma Integration

The wireframes are **already specified** for Figma:

1. **Open** `RESONANCE_PLATFORM_WIREFRAMES.md`
2. **Create Figma Board** with:
   - Color palette (6 tokens)
   - Typography styles (headings, body, code)
   - Component library (Button, Input, Card, etc.)
   - Screens A-F as Figma frames
   - Responsive breakpoints (desktop, tablet, mobile)
3. **Use tokens from**:
   - `docs/brand/LUMINAI_LOGO_AND_BRANDING_SPECIFICATIONS.md`
   - `docs/brand/BRAND_DECK_SUMMARY.md`
4. **Collaborate** with designers using Figma's comment threads

---

## 🚀 What Happens Next

### For You (Planning / Architecture)

- [ ] Review all three spec documents
- [ ] Identify which engineering team / contractors will build each surface
- [ ] Create GitHub issues from implementation checklist above
- [ ] Set milestones (Phase 1-4)
- [ ] Begin Figma wireframe-to-design work

### For Engineers

- [ ] Clone repo, checkout implementation branches
- [ ] Read `PLATFORM_INTEGRATION_ARCHITECTURE.md` (backend devs)
- [ ] Read `CLI_TOOL_SPECIFICATION.md` (CLI devs)
- [ ] Read `WEBSITE_INTEGRATION_PLAN.md` (frontend devs)
- [ ] Stand up local environment (`docker-compose up dev`)
- [ ] Implement Phase 1 tasks in parallel

### For Designers

- [ ] Build Figma board from wireframes
- [ ] Create component library with tokens
- [ ] Design all Screens A-F with responsive variants
- [ ] Export design system (tokens, components)
- [ ] Pass to frontend team for implementation

---

## ✅ Success Criteria

**Architecture is locked when:**

- ✅ All API endpoints specified (PLATFORM_INTEGRATION_ARCHITECTURE.md)
- ✅ All CLI commands specified (CLI_TOOL_SPECIFICATION.md)
- ✅ All website pages specified (WEBSITE_INTEGRATION_PLAN.md)
- ✅ Data flows documented (who calls what, in what order)
- ✅ Wireframes ready for Figma (RESONANCE_PLATFORM_WIREFRAMES.md)
- ✅ Deployment strategy clear (docker-compose, Kubernetes, Vercel)
- ✅ No ambiguity about integration points

**Implementation is on track when:**

- ✅ Backend serves /api/chat endpoint (week 1)
- ✅ Web UI can send/receive chat messages (week 2)
- ✅ CLI can call backend endpoints (week 2)
- ✅ Website playground works (week 2)
- ✅ All Phase 1 tasks complete before moving to Phase 2

---

## 📝 Reference

**Key Documents** (in order of reading):

1. `PLATFORM_INTEGRATION_ARCHITECTURE.md` — Start here (backend devs)
2. `CLI_TOOL_SPECIFICATION.md` — Full command reference (CLI devs)
3. `WEBSITE_INTEGRATION_PLAN.md` — All pages + components (frontend devs)
4. `RESONANCE_PLATFORM_WIREFRAMES.md` — Wireframes for designers (Figma)
5. `docs/STRUCTURE.md` — Navigation map for all docs
6. `docs/reference/QUICK_REFERENCE_READY.md` — Quick facts about TGCR

**All Locked** ✅

The architecture is **frozen**. Implementation can now begin.
