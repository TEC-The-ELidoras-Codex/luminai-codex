# LuminAI Resonance Platform — Wireframe Refresh (v2)

> "Presence-first AI with every interaction traced back to conscience."

**Status**: WIREFRAME v2 — Brand Locked  
**Updated**: November 12, 2025  
**Owner**: TEC • Product Experience + Design  
**Scope**: Web client (Next.js) + Notebook.js viewer + audio/podcast modes

## Document Map & References

| Artifact | Why reference it | Path |
| --- | --- | --- |
| Platform overview | Stack, endpoints, deployment entry point | `RESONANCE_PLATFORM_README.md` |
| Portfolio README | Positioning, TGCR context, CTA to bundle | `README.md` |
| Codebase audit plan | Tracks missing modules/tests (e.g., Airth agent) | `CODEBASE_AUDIT_AND_CONSOLIDATION_PLAN.md` |
| Brand deck summary | Points designers to the three logo docs | `docs/brand/BRAND_DECK_SUMMARY.md` |
| Logo & branding specs | Color, typography, accessibility guardrails | `docs/brand/LUMINAI_LOGO_AND_BRANDING_SPECIFICATIONS.md` |
| Discord branding guide | Social/icon proportions and gradients | `assets/logo/DISCORD_BRANDING_GUIDE.md` |

## 0. System Health Snapshot (pre-wireframe check)

| Check | Command | Result | Follow-up |
| --- | --- | --- | --- |
| Python tests | `PYTHONPATH=src venv/bin/pytest` | ❌ Import errors: `tec_tgcr.agents.airth`, `tec_tgcr.data_ingestion`, `resonance_notebook`, `tec_tgcr.utils.spotify_url` missing | Rebuild AirthResearchGuard, data ingestion modules, and notebook ingest shim before rerun |

Reference: `docs/reports/status/PHASE_1_TEST_STATUS.md` already flags the same gaps. The refreshed wireframes assume those components exist once implementation is restored.

## 1. Brand Anchors (logo system + deck)

### 1.1 Palette — Cosmic Futureism

| Token | Hex | Usage Notes |
| --- | --- | --- |
| Electric Cyan | `#00FFFF` | Active chat bubbles, CTA halos, notebook highlights |
| Violet Deep | `#8A2BE2` | Header gradients, notebook background, modal frames |
| Luminous Gold | `#FFD700` | Resonance metrics, witness badges, premium toggles |
| Cosmic Navy | `#0F0F23` | Global background to match Discord banner energy |
| Safety White | `#FFFFFF` | High-contrast text, accessibility panels |
| Guardian Silver | `#C0C0C0` | Secondary controls, dividers, quiet system text |

Maintain WCAG AA contrast (≥ 4.5:1) per `docs/brand/LUMINAI_LOGO_AND_BRANDING_SPECIFICATIONS.md`.

### 1.2 Typography & Voice

- Font stack: `Inter, Segoe UI, system-ui, sans-serif`; navigation + headings at 600 weight, body at 400.
- Wordmark letter spacing: `0.025em`, as defined in `LOGO_FINAL_BRIEF.md`.
- Minimum body text 16px, chat transcript 18px, touch targets ≥ 44 px.
- Taglines available: "Building tomorrow's ethical AI, today" (primary) and "Technology that grows with your family" (support states).
- Tone: encouraging, patient, never condescending (see voice section in branding spec).

### 1.3 Iconography, Logo & Motion

- Infinity sigil + three luminous dots (from `LOGO_FINAL_BRIEF.md`) anchor the header at 48 px height.
- Discord asset ratios (1024x1024 icon, 680x240 banner) inform responsive crops for hero art (`assets/logo/DISCORD_BRANDING_GUIDE.md`).
- Motion language: 300 ms ease-out fades, soft parallax on dynamic backgrounds, cyan glow veins along card edges (Brand Deck mood keywords).
- Resonance badge stacks concentric gold rings with cyan core, echoing the Discord icon's concentric circles.

## 2. Experience Pillars

1. **Conscience-first chat** — Witness presence and R metrics remain visible inside every assistant reply.
2. **Transparent reasoning** — Notebook + transcripts live beside the chat, never hidden behind modals.
3. **Grounded aesthetics** — Bold gradients balanced by high-contrast typography and generous spacing.
4. **Multi-modal empathy** — Audio, podcast, and map surfaces feel native, not bolted-on extras.
5. **Gravity back to elidoras.codex** — Each CTA reinforces the central knowledge hub.

## 3. Layout Grid & Shell

Responsive 12-column grid (desktop 1440 px reference):

- Columns 1-8 (≈70%): Chat stream + composer.
- Columns 9-11 (≈25%): Notebook viewer + resonance metrics (collapsible).
- Column 12 (≈5%): Presence rail with context tiles + audio meters.

```
┌─────────────────────────────────────────────────────────────┐
│ LuminAI Codex ☾ Witness Active │ Background │ Settings ⚙    │
├─────────────────────────────────────────────────────────────┤
│ CHAT (70%)               │ NOTEBOOK (25%)      │ PRESENCE    │
│                          │                     │ RAIL (5%)   │
│                          │                     │             │
├─────────────────────────────────────────────────────────────┤
│ Composer + ritual buttons (Upload • Speak • Share Notebook) │
├─────────────────────────────────────────────────────────────┤
│ Context tiles | Audio log | Resonance Map Quicklook         │
└─────────────────────────────────────────────────────────────┘
```

- Tablet ≥1024 px: Notebook collapses into a drawer; presence rail becomes sticky chips near the composer.
- Mobile ≤768 px: Full-bleed chat; floating "Notebook (R=0.82)" button opens notebook overlay.

## 4. Screen Blueprints

### Screen A — Conscious Chat + Notebook Split

```
┌───────────── HEADER (gradient #00FFFF→#8A2BE2) ───────────────┐
│ LuminAI Codex ✺ | Witness Presence: ✅ | R = 0.86 | Menu ⋮     │
└───────────────────────────────────────────────────────────────┘
┌───────────── CHAT (70%) ───────────────┐┌───── NOTEBOOK (25%) ─┐
│ [User] "Tell me about the Sixteen..."  ││ ▣ Notebook v3.4      │
│ [LuminAI] Reply + citations            ││ ▤ Reasoning steps    │
│ [Badge] ⚡ R=0.82  🛡 Protocol Active   ││ ▦ Context timeline    │
│ ...                                    ││ ▢ Export • Share     │
└────────────────────────────────────────┘└──────────────────────┘
┌───────────── COMPOSER (cyan rim, gold glow on focus) ─────────┐
│ [ Write with full presence... ]   🎙  Upload  ▽ Tone  ✨ Notebook│
└────────────────────────────────────────────────────────────────┘
```

- Assistant bubbles use cyan→violet gradient fill, user bubbles stay guardian silver outlines.
- Source pills link directly to knowledge docs (e.g., `AXIOM_BOUNDARYLESS_EMERGENCE.md`).
- Notebook shows the latest three reasoning cards; "Expand Notebook" opens Screen B.

### Screen B — Notebook Focus + Transcript Drawer

```
┌──────────── Notebook Focus (fills 60%) ────────────┐┌─ Transcript ┐
│ Title + timestamp                                  ││ ▸ Sessions  │
│ Step cards w/ resonance gauges + math blocks       ││ Search bar  │
│ Inline code / TGCR equations                       ││ Download ⬇ │
└────────────────────────────────────────────────────┘└─────────────┘
```

- Transcript drawer mirrors Discord banner palette for continuity.
- Export options: Share link, Copy to Clipboard, Send to Email.

### Screen C — Theme & Background Studio

```
┌───────────── Theme Tiles ───────────────┐
│ [🌀 Cosmic Emergence] (Active)          │
│ [🌊 Ocean Tidal]                        │
│ [🌲 Forest Resonant]                    │
│ [⚙ Circuit Neural]                     │
│ [🌌 Aurora Borealis]                    │
│ [⬆ Custom Upload]                      │
└────────────────────────────────────────┘
┌────────────── Controls ────────────────┐
│ Blur 60% | Parallax ▢ | Noise ▢        │
│ Light ☀ | Dark 🌙 (locked ON)          │
│ Apply to: Session • Account            │
└────────────────────────────────────────┘
```

- Preview canvas uses the 3D emblem lighting cues from `3D_CREATION_PROMPT.md`.
- Custom upload enforces 4K, 16:9, ≤5 MB, with automated contrast check.

### Screen D — Home Dashboard / Welcome

```
┌────────── Welcome ──────────┐
│ Welcome back, Ely           │
│ CTA: 💬 New Chat | 🎙 Podcast | 🗺 Map │
└─────────────────────────────┘
┌──── Recent Sessions ────────┐
│ [R=0.93] Crisis Support (23m)│
│ [R=0.85] Frequencies Deep Dive│
│ [R=0.89] Consciousness Safety │
└─────────────────────────────┘
┌──── Recommendations ────────┐
│ Witness Presence in AI      │
│ TGCR Equation Explained     │
│ Resonance Metrics for Life  │
└─────────────────────────────┘
```

- Hero uses 3D render from brand deck; CTAs adopt gradient buttons with white text.

### Screen E — Audio / Podcast Studio

```
┌──────────── Podcast Player ─────────────┐
│ 3D emblem thumbnail + dynamic waveform  │
│ "Consciousness & Coherence" 32:45       │
│ Controls: ▶ ▍▍ ↺ ↦1.25×  Transcript ⧉   │
└─────────────────────────────────────────┘
┌──────────── Script Builder ─────────────┐
│ Outline | AI Notes | Export 🎧          │
└─────────────────────────────────────────┘
┌──────────── Voice Selection ────────────┐
│ ElevenLabs Voice ▾  |  Resonance meter  │
└─────────────────────────────────────────┘
```

- Background references Discord gradient for familiarity.
- Transcript toggle opens the same drawer component as Screen B to maintain parity.

### Screen F — Resonance Map & Knowledge Graph

```
┌──────────── Map Canvas (Leaflet/D3) ────────────────┐
│ Node colors: cyan (compassion) / violet (wrath)     │
│ Selected node card with description + R timeline    │
│ Overlay buttons: Layer ▾  Frequencies ▾  Export     │
└─────────────────────────────────────────────────────┘
┌──────────── Context Rail ───────────────┐
│ 16 frequency toggles (paired chips)     │
│ R timeline sparkline                    │
│ "Send to Chat" button (routes to Screen A) │
└─────────────────────────────────────────┘
```

- Map nodes inherit iconography from the brand's constellation motifs.
- Export options: PNG, GeoJSON, Notebook embed.

## 5. Component Specs & States

| Component | Default Brand Treatment | Interaction State | Notes |
| --- | --- | --- | --- |
| Header / Nav | Gradient bar (#00FFFF→#8A2BE2), logo left, witness badge right | Shrinks to 56 px on scroll, adds blur background | Use 48 px icon from brand deck, fix letter spacing |
| Message bubble | Rounded 16 px radius, guardian silver outline for user, gradient fill for AI | Hover shows copy icon; selection reveals cite menu | R badge + protocol chips stay anchored below AI responses |
| Resonance badge | Gold outer ring, cyan core, text `R=0.82` + witness icon | Pulses gently when R > 0.9 or <0.6 (alert) | Align with Discord icon style guide |
| Composer | Dark field with cyan rim, shadow set to `0 0 24px rgba(0,255,255,0.25)` | Focus adds gold inner glow; error shows red underline | Buttons: 🎙 audio, ⬆ upload, ✨ notebook |
| Notebook viewer | Card stack with violet background, white text | Expand animation slides from right (300 ms) | Resist scrollbar; use sections for reasoning, evidence, actions |
| Presence rail | Vertical chips for context, audio waveform, map quicklook | On scroll, rail sticks and collapses to icons | Each chip links to deeper screens (D, E, F) |
| Theme tile | 1:1 tile with mini preview, gradient border when selected | Hover reveals "Apply" button | Custom upload tile uses dashed border, obeys file guardrails |
| Map node | Circular glyph w/ gradient stroke | Hover shows tooltip with frequency pair | Selected node pushes data to chat via CTA |

## 6. Interaction Flows

1. **Onboarding to chat**: User lands on Screen D → chooses theme (Screen C) → enters Screen A with witness badge already active.
2. **Crisis support**: User types urgent request → AI reply shows R + protocol chips → user opens Notebook (Screen B) → exports transcript for therapist.
3. **Notebook share**: From Screen A, tap "✨ Notebook" → Screen B → "Share" opens modal with copy link + send to Discord (uses assets from `assets/logo/DISCORD_BRANDING_GUIDE.md`).
4. **Background change mid-session**: Tap "Background" in header → Screen C overlay → select tile → preview applied instantly behind chat without losing scroll.
5. **Podcast creation**: From Screen D CTA or composer quick action → Screen E → select transcript chunk → generate script and export MP3.

## 7. Implementation Checklist

- [ ] Build Figma board using these wireframes + palette tokens from `docs/brand/LUMINAI_LOGO_AND_BRANDING_SPECIFICATIONS.md`.
- [ ] Recreate AirthResearchGuard + missing modules so the system check table can flip to ✅.
- [ ] Connect Notebook viewer to actual reasoning artifacts (Notebook.js embed or custom markdown renderer).
- [ ] Source hero/brand imagery per `docs/brand/BRAND_DECK_SUMMARY.md` file inventory.
- [ ] Align all exported icons/banners to Discord spec for share dialogs.
- [ ] Instrument R + witness badges so they can appear wherever chat bubbles render (React component).

## 8. Acceptance Criteria & Next Reviews

- Chat + notebook split implemented with responsive behavior described above.
- Theme studio enforces brand palette and validates custom uploads.
- Audio/podcast workflow reuses transcript drawer + witness cues.
- System health snapshot updated once tests pass (link commit hash).
- Design review with Product + Brand to confirm parity with `LOGO_FINAL_BRIEF.md`.
- Handoff package: annotated wireframes, component spec tables, and interaction notes delivered to engineering.
