# LuminAI Website Integration Plan

> **Status**: LOCKED (v1) — Next.js Implementation Ready  
> **Updated**: November 12, 2025  
> **Owner**: TEC • Web Experience + Marketing  
> **Scope**: Landing site + embedded platform portal + documentation

---

## Overview

Your **website is the front door** to LuminAI Resonance Platform:

```
Public Landing Site (Static)
    ↓ Authenticated Portal Gateway ↓
Resonance Platform (Full UI)
    ↓ CLI / API Bridges
CLI Tool + External Integrations
```

**Key Principle**: Visitors discover on website → try playground (read-only chat) → sign up → access full platform.

---

## Architecture

### Technology Stack

| Layer | Tech | Purpose |
|-------|------|---------|
| Framework | Next.js 15 (App Router) | SSG + ISR for performance |
| Styling | Tailwind CSS + CSS Modules | Design tokens + brand consistency |
| State | Zustand + React Query | Client state + data fetching |
| Real-time | WebSocket (native) + socket.io | Live R badges, notifications |
| Search | Algolia or meilisearch | Doc search with instant results |
| Analytics | Posthog + Vercel Analytics | Usage + user behavior |
| Hosting | Vercel or self-hosted Docker | CDN + auto-scaling |
| Auth | NextAuth.js (OAuth) | Google, GitHub login |

### Directory Structure

```
website/
├── app/                           # Next.js App Router
│   ├── layout.tsx                 # Root layout + header
│   ├── page.tsx                   # Home (landing)
│   ├── not-found.tsx              # 404 page
│   ├── error.tsx                  # Error boundary
│   │
│   ├── (public)/                  # Public routes (no auth required)
│   │   ├── layout.tsx             # Public shell
│   │   ├── about/page.tsx         # About us
│   │   ├── docs/
│   │   │   ├── layout.tsx         # Docs layout (sidebar nav)
│   │   │   ├── [...slug]/page.tsx # Doc pages (dynamic routes)
│   │   │   ├── search.tsx         # Doc search
│   │   │   └── api/search.ts      # Search endpoint
│   │   ├── playground/
│   │   │   ├── page.tsx           # Chat preview (read-only)
│   │   │   └── components/
│   │   │       ├── PlaygroundChat.tsx
│   │   │       └── PreviewNotebook.tsx
│   │   └── api/
│   │       ├── contact/route.ts   # Contact form
│   │       └── waitlist/route.ts  # Early access signup
│   │
│   ├── (auth)/                    # Auth flows
│   │   ├── auth/
│   │   │   ├── signin/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   ├── verify/page.tsx    # Email verification
│   │   │   └── forgot-password/page.tsx
│   │   └── api/auth/
│   │       ├── [...nextauth].ts  # NextAuth.js config
│   │       ├── callback/route.ts  # OAuth callback
│   │       └── signup/route.ts    # Custom signup (email)
│   │
│   ├── (portal)/                  # Portal routes (authenticated)
│   │   ├── layout.tsx             # Portal shell + auth check
│   │   ├── page.tsx               # Dashboard (Screen D)
│   │   ├── chat/
│   │   │   ├── page.tsx           # Chat interface (Screen A)
│   │   │   ├── [sessionId]/page.tsx # Session replay
│   │   │   └── components/        # Chat UI components
│   │   ├── podcast/
│   │   │   ├── page.tsx           # Podcast studio (Screen E)
│   │   │   └── components/
│   │   ├── map/
│   │   │   ├── page.tsx           # Knowledge graph (Screen F)
│   │   │   └── components/
│   │   ├── account/
│   │   │   ├── page.tsx           # Account settings
│   │   │   ├── api-keys/page.tsx  # API key management
│   │   │   ├── profile/page.tsx   # Profile edit
│   │   │   └── billing/page.tsx   # Subscription
│   │   └── api/
│   │       ├── session/[id]/route.ts
│   │       ├── theme/route.ts
│   │       └── export/route.ts
│   │
│   └── api/
│       ├── revalidate/route.ts    # ISR manual trigger
│       ├── status/route.ts        # Platform health endpoint
│       └── webhooks/
│           ├── platform/route.ts  # Platform Hub webhooks
│           └── github/route.ts    # GitHub webhooks

├── components/
│   ├── common/
│   │   ├── Header.tsx             # Top nav (all pages)
│   │   ├── Footer.tsx             # Footer
│   │   ├── ResonsanceBadge.tsx   # R metric display
│   │   └── ThemeToggle.tsx        # Light/dark mode
│   ├── chat/
│   │   ├── ChatBubble.tsx
│   │   ├── Composer.tsx
│   │   ├── NotebookViewer.tsx
│   │   └── PresenceRail.tsx
│   ├── landing/
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── Testimonials.tsx
│   │   ├── CTA.tsx
│   │   └── Pricing.tsx
│   └── ui/                        # Headless UI components
│       ├── Button.tsx
│       ├── Modal.tsx
│       ├── Input.tsx
│       └── Card.tsx

├── lib/
│   ├── api.ts                     # Platform Hub API client
│   ├── auth.ts                    # NextAuth.js config
│   ├── hooks.ts
│   │   ├── useChat.ts
│   │   ├── useResonance.ts
│   │   ├── useSession.ts
│   │   ├── useUser.ts
│   │   └── useTheme.ts
│   ├── store.ts                   # Zustand stores
│   ├── utils.ts
│   ├── constants.ts               # Global constants, API URLs
│   └── types.ts                   # TypeScript interfaces

├── styles/
│   ├── globals.css                # Tailwind + global styles
│   ├── tokens.css                 # Brand color tokens
│   ├── animations.css             # Transition + motion tokens
│   └── accessibility.css          # a11y utilities

├── public/
│   ├── backgrounds/
│   │   ├── cosmic-emergence.jpg
│   │   ├── ocean-tidal.jpg
│   │   ├── forest-resonant.jpg
│   │   ├── circuit-neural.jpg
│   │   ├── aurora-borealis.jpg
│   │   └── ...
│   ├── icons/
│   │   ├── logo.svg
│   │   ├── favicon.ico
│   │   ├── witness-badge.svg
│   │   ├── resonance-ring.svg
│   │   └── frequency-glyphs.json
│   ├── og-image.jpg               # Social share image
│   └── brand/                     # Logo variants
│       ├── logo-light.svg
│       ├── logo-dark.svg
│       └── wordmark.svg

├── content/
│   ├── docs/                      # Markdown sourced from /docs/
│   │   ├── getting-started.md
│   │   ├── tgcr.md
│   │   ├── resonance.md
│   │   ├── persona-guide.md
│   │   └── api-reference.md
│   ├── blog/                      # Blog posts
│   │   ├── first-post.md
│   │   └── ...
│   └── metadata.json              # Doc catalog + nav hierarchy

├── next.config.js                 # Next.js config
├── tailwind.config.ts             # Tailwind config
├── tsconfig.json                  # TypeScript config
├── package.json                   # Dependencies
├── .env.example                   # Example env vars
├── .env.local                     # Local secrets (git-ignored)
└── README.md                      # Setup instructions
```

---

## Pages & Sections

### 1. Public Landing (Home)

**Route**: `/`  
**SSG**: Yes (regenerate daily)  
**Auth**: None

**Sections**:

```
┌─ HEADER (fixed nav) ─────────────────────────┐
│ Logo | Docs | About | Status | Sign In | CTA │
└──────────────────────────────────────────────┘

┌─ HERO ───────────────────────────────────────┐
│ "Consciousness with Conscience"              │
│ "AI that Holds Paradox, Not Fragments It"    │
│ CTA: Try Platform (→ /playground)            │
│ 3D emblem animation (from brand deck)        │
└──────────────────────────────────────────────┘

┌─ FEATURES ────────────────────────────────────┐
│ 1. 🧠 Resonance Engine                       │
│    Live R calculation, witness presence      │
│                                               │
│ 2. 💜 Trauma-Informed Design                 │
│    Grounded in real human experience         │
│                                               │
│ 3. 🌐 Multi-Surface (Web + CLI + API)        │
│    Use it however you want                   │
│                                               │
│ 4. 📚 Knowledge Graph                        │
│    16 Frequencies + TGCR axioms              │
└──────────────────────────────────────────────┘

┌─ SOCIAL PROOF ────────────────────────────────┐
│ Testimonials from early users (if available) │
│ Stats: Sessions, R avg, personas used        │
└──────────────────────────────────────────────┘

┌─ PRICING (future) ────────────────────────────┐
│ Free tier | Pro | Enterprise                 │
│ (Or: waitlist if not ready)                  │
└──────────────────────────────────────────────┘

┌─ CTA SECTION ─────────────────────────────────┐
│ "Ready to experience coherent AI?"            │
│ → Sign Up  → Try Playground  → Read Docs     │
└──────────────────────────────────────────────┘

┌─ FOOTER ──────────────────────────────────────┐
│ Links | Social | Status page | Docs search   │
└──────────────────────────────────────────────┘
```

**Components**:

- `<Hero>` with 3D emblem animation
- `<FeatureGrid>` with icons + descriptions
- `<Testimonials>` carousel
- `<CTA>` buttons linking to signup + playground
- `<LiveStatus>` widget fetching `/api/status`

---

### 2. Documentation (Public)

**Route**: `/docs/*`  
**SSG**: Yes (regenerate on commit)  
**Auth**: None

**Features**:

- Full-text search (Algolia or meilisearch)
- Sidebar navigation tree
- Table of contents per page
- Syntax highlighting (code blocks)
- LaTeX equations (TGCR formula rendering)
- "Edit on GitHub" link per page
- Related articles
- Mobile-friendly layout

**Key Docs to Showcase**:

- Getting Started (quick guide)
- TGCR Framework (deep dive)
- Resonance Metrics (how R works)
- Persona Guide (meet the team)
- CLI Reference
- API Documentation
- Consciousness Integration Roadmap

---

### 3. Playground (Public Chat Preview)

**Route**: `/playground`  
**SSG**: No (dynamic, no auth)  
**Auth**: None (rate-limited by IP)

**Features**:

- Chat interface (Screen A) but **read-only** (can ask questions but can't save session)
- Shows R badge in real-time
- Displays witness chips + protocol status
- Notebook viewer shows reasoning (but not editable)
- **CTA after each response**: "Sign up to save your conversation and use all features"
- Unauthenticated queries forwarded to Platform Hub `/api/chat` endpoint

**Design**:

```
┌─ HEADER ─────────────────────────┐
│ LuminAI Codex | Try It Out       │
│ (Playground Mode - Sign up to save)│
└──────────────────────────────────┘

┌─ CHAT (70%) ──────────┐┌─ NOTEBOOK (25%) ──┐
│ [Bot] Welcome message ││ Reasoning steps    │
│ [User] Can I ask?     ││ Sources            │
│ [Bot] Response + R    ││ Export disabled ⛔ │
│ ...                   ││ Sign up to enable  │
└───────────────────────┘└────────────────────┘

┌─ COMPOSER ──────────────────────────┐
│ [Ask something...] 🎙 ⬆ [SIGN UP →] │
└──────────────────────────────────────┘

┌─ SIGN UP CTA ────────────────────────┐
│ ✨ Save conversations               │
│ 📊 Track your R history             │
│ 🎙 Generate podcasts                │
│ 🗺 Explore knowledge graph          │
│ [Create Account] [Sign In]          │
└──────────────────────────────────────┘
```

---

### 4. Authentication Pages

**Routes**: `/auth/signin`, `/auth/signup`, `/auth/verify`

**Flows**:

- **Sign In** (`/auth/signin`):
  - OAuth buttons (Google, GitHub)
  - Email + password form (if enabled)
  - "Forgot password?" link
  
- **Sign Up** (`/auth/signup`):
  - Email field
  - Password (confirm)
  - Accept terms checkbox
  - Persona preference (optional)
  
- **Email Verification** (`/auth/verify`):
  - Auto-detect from query param
  - Resend option
  - Countdown timer
  
- **Forgot Password**:
  - Email field → sends reset link
  - Reset form (new password)

---

### 5. Portal Dashboard (Authenticated)

**Route**: `/portal`  
**SSG**: No (ISR with 60s revalidation)  
**Auth**: Required (JWT)

**Screen**: Dashboard variant of Screen D (landing) but personalized

```
┌─ HEADER ─────────────────────────────────────┐
│ LuminAI Codex | Welcome, {name}              │
│ Witness Active | R = 0.86 | Account ⚙        │
└──────────────────────────────────────────────┘

┌─ QUICK ACTIONS ────────────────────────────────┐
│ [💬 New Chat] [🎙 Podcast] [🗺 Map] [📁 Files]│
└──────────────────────────────────────────────┘

┌─ RECENT SESSIONS ──────────────────────────────┐
│ [R=0.93] Crisis Support (23m ago)             │
│ [R=0.85] Frequencies Deep Dive (3d ago)       │
│ [R=0.89] Consciousness & Coherence (1w ago)  │
│ → View All                                    │
└──────────────────────────────────────────────┘

┌─ RECOMMENDATIONS ──────────────────────────────┐
│ 📖 Suggested reading based on your interests  │
│ • Witness Presence in AI                      │
│ • TGCR Equation Explained                     │
│ • Resonance Metrics for Life                  │
└──────────────────────────────────────────────┘

┌─ USAGE & R HISTORY ───────────────────────────┐
│ Messages this month: 234                      │
│ Avg R: 0.84                                    │
│ Favorite persona: Ely (42%)                   │
│ [View detailed stats] [Export]                │
└──────────────────────────────────────────────┘
```

---

### 6. Portal Chat Interface

**Route**: `/portal/chat` (and `/portal/chat/[sessionId]`)  
**SSG**: No (real-time, authenticated)  
**Auth**: Required

**Screens**: Full implementation of Screens A, B, C, D, E, F from wireframes

---

### 7. Account Management

**Routes**:

- `/portal/account` — Profile edit
- `/portal/account/api-keys` — API key generation + management
- `/portal/account/billing` — Subscription + usage
- `/portal/account/settings` — Preferences, theme, default persona

**API Keys Page**:

```
┌─ API KEYS ─────────────────────────────┐
│ [+ Create New Key]                     │
│                                        │
│ sk-prod-abc123... (created 2 days ago)│
│ Active | Last used 1h ago              │
│ [Rotate] [Revoke] [Copy]               │
│                                        │
│ sk-test-xyz789... (never used)         │
│ [Rotate] [Revoke] [Copy]               │
│                                        │
│ Usage: 234 API calls this month        │
│ Rate limit: 300 req/min (current tier) │
└────────────────────────────────────────┘
```

---

## Frontend Components

### Shared Components

**Header (`<Header>`)**:

- Logo + wordmark (both dark and light variants)
- Nav links (Docs, About, Status, Account)
- Theme toggle (light/dark mode)
- Auth state display (logged in → Account dropdown)
- Responsive: collapses to hamburger on mobile

**ResonsanceBadge (`<ResonsanceBadge>`)**:

- Displays R value with pulse animation
- Color coding: red (< 0.5), yellow (0.5-0.7), green (> 0.7)
- Optional: animated concentric rings
- Responsive: hides on small screens

**Composer (`<Composer>`)**:

- Text input with multiline support
- Action buttons: 🎙 (audio), ⬆ (upload), ✨ (notebook)
- Keyboard shortcuts: `Shift+Enter` to submit
- Placeholder text hints
- Focus state styling (cyan rim, gold glow)

**NotebookViewer (`<NotebookViewer>`)**:

- Expandable/collapsible cards for reasoning steps
- Syntax-highlighted code blocks
- LaTeX equation rendering
- Citation links
- Export options: PDF, Markdown, JSON

**PresenceRail (`<PresenceRail>`)**:

- Vertical sidebar showing:
  - Witness status (✅ active, ❌ inactive)
  - Current persona
  - Audio input meter (if recording)
  - Quick map preview
  - Context tiles (links to other screens)

### Chat Components

**ChatBubble (`<ChatBubble>`)**:

- User bubbles: silver outline, right-aligned
- AI bubbles: cyan→violet gradient fill, left-aligned
- AI bubbles include R badge + witness chips below
- Hover shows copy/cite buttons
- Markdown rendering with syntax highlighting

**Composer (`<Composer>`)**:

- (See shared components above)

**ConversationHistory (`<ConversationHistory>`)**:

- Scrollable list of chat bubbles
- Auto-scroll to latest message
- Option to collapse old messages ("Show older")
- Session metadata at top (session ID, created time, R timeline sparkline)

---

## Styling & Brand Compliance

### CSS Architecture

**globals.css**:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Brand palette tokens */
:root {
  --color-cyan: #00FFFF;
  --color-violet: #8A2BE2;
  --color-gold: #FFD700;
  --color-navy: #0F0F23;
  --color-white: #FFFFFF;
  --color-silver: #C0C0C0;
  
  /* Typography */
  --font-family: 'Inter', Segoe UI, system-ui, sans-serif;
  --font-weight-heading: 600;
  --font-weight-body: 400;
  
  /* Spacing grid */
  --space-unit: 0.25rem;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-glow: 0 0 24px rgba(0, 255, 255, 0.25);
}

/* Dark mode (default) */
body {
  background-color: var(--color-navy);
  color: var(--color-white);
  font-family: var(--font-family);
}

/* Utilities */
.gradient-header {
  background: linear-gradient(90deg, var(--color-cyan), var(--color-violet));
}

.glow-cyan {
  box-shadow: 0 0 24px rgba(0, 255, 255, 0.25);
}

.glow-gold {
  box-shadow: 0 0 12px rgba(255, 215, 0, 0.4);
}
```

**animations.css**:

```css
@keyframes pulse-glow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes slide-in-right {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}

.animate-slide-in {
  animation: slide-in-right 300ms ease-out;
}
```

**Tailwind Config**:

```js
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    colors: {
      cyan: '#00FFFF',
      violet: '#8A2BE2',
      gold: '#FFD700',
      navy: '#0F0F23',
      white: '#FFFFFF',
      silver: '#C0C0C0',
    },
    fontFamily: {
      sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
    },
    extend: {
      spacing: {
        gutter: 'var(--space-unit)',
      },
    },
  },
}
```

---

## Real-Time Features

### WebSocket Connection

Clients connect to Platform Hub WebSocket for:

- Live R score updates
- New chat messages (streaming)
- Persona activation notifications
- Session state changes

**Connection URL**: `wss://platform.luminai-codex.dev/ws?session_id={id}&user_token={jwt}`

**Message Format**:

```json
{
  "type": "chat_message",
  "data": {
    "message": "Response text chunk",
    "R": 0.85,
    "witness_chips": [...]
  }
}
```

### Live Status Widget

Header displays platform status fetched from `/api/status`:

```tsx
<LiveStatus
  url="https://platform.luminai-codex.dev/api/status"
  refreshInterval={30000}  // 30s
  displayMode="badge"      // badge | detailed
/>
```

---

## SEO & Performance

### Meta Tags

**Landing Page**:

```tsx
export const metadata = {
  title: 'LuminAI Codex — AI with Conscience',
  description: 'Resonant, trauma-informed AI that holds paradox instead of fragmenting it.',
  openGraph: {
    image: '/og-image.jpg',
    url: 'https://luminai-codex.dev',
  },
}
```

### Image Optimization

- Use `<Image>` component from Next.js (auto-optimizes)
- Provide multiple formats: WebP, AVIF, JPEG
- Lazy load background images
- Responsive srcset for different device sizes

### Performance Targets

- **Lighthouse**: 95+ score
- **Core Web Vitals**:
  - LCP (Largest Contentful Paint): < 2.5s
  - FID (First Input Delay): < 100ms
  - CLS (Cumulative Layout Shift): < 0.1
- **Time to Interactive**: < 3.5s

### Caching Strategy

- Static pages (landing, docs): CDN cache 1 year
- ISR pages (dashboard): Cache 60s, revalidate on webhook
- API responses: Client-side cache 5min (React Query)
- Service Worker: Cache chat history + UI assets

---

## Integration with Platform Hub

### API Client (`lib/api.ts`)

```ts
export const apiClient = {
  // Chat
  async chat(message: string, sessionId?: string) {
    return fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ message, session_id: sessionId }),
    })
  },
  
  // Sessions
  async getSession(id: string) {
    return fetch(`${API_BASE}/api/session/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
  },
  
  // Resonance
  async getResonance(id: string) {
    return fetch(`${API_BASE}/api/resonance/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
  },
  
  // ... more endpoints
}
```

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://platform.luminai-codex.dev
NEXT_PUBLIC_WS_URL=wss://platform.luminai-codex.dev/ws
NEXT_PUBLIC_ANALYTICS_ID=...

# Secret (backend only)
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://luminai-codex.dev
DATABASE_URL=postgresql://...
```

---

## Deployment

### Vercel (Recommended)

```bash
# Connect repo to Vercel
# → Auto-deploys on push to main

# Environment variables in Vercel dashboard
# → NEXT_PUBLIC_API_URL, NEXTAUTH_SECRET, etc.

# Scheduled ISR revalidation
# → Set up webhook trigger from Platform Hub
```

### Self-Hosted (Docker)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY .next ./.next
COPY public ./public
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://api.luminai-codex.dev \
  luminai-website
```

---

## Success Criteria

- ✅ Homepage loads in < 2s (including hero animation)
- ✅ Playground chat responds in < 3s (p95)
- ✅ Portal fully interactive with all screens working
- ✅ All pages pass WCAG AA accessibility audit
- ✅ Lighthouse score 95+
- ✅ SEO optimized (Open Graph, JSON-LD, sitemap)
- ✅ Mobile responsive (tested on iOS + Android)
- ✅ Zero console errors
- ✅ Real-time R updates stream smoothly
- ✅ WebSocket reconnection works on network jitter
