# LuminAI Codex — Complete Asset Inventory

**Last Updated**: November 14, 2025  
**Purpose**: Single source of truth for all brand assets, logos, and visual identity files

---

## 🎨 BRAND IDENTITY ASSETS

### Logos — Primary

**Location**: `assets/logo/`

**Required Formats** (all versions):

- [ ] **Logo Mark** (icon only, no text)
  - [ ] SVG (vector, scalable)
  - [ ] PNG 512x512 (web favicon)
  - [ ] PNG 1024x1024 (high-res)
  - [ ] PNG 2048x2048 (print-ready)
  - [ ] ICO (favicon.ico for browsers)

- [ ] **Wordmark** (text only, no icon)
  - [ ] SVG (vector)
  - [ ] PNG 1200x400 (web headers)
  - [ ] PNG 2400x800 (print)

- [ ] **Full Logo** (icon + wordmark)
  - [ ] SVG (vector)
  - [ ] PNG 1200x400 (standard web)
  - [ ] PNG 2400x800 (high-res web/print)
  - [ ] PNG 3600x1200 (extra-large)

**Color Variants** (for each logo type above):

- [ ] **Light Mode** (dark logo on light background)
- [ ] **Dark Mode** (light logo on dark background)
- [ ] **Monochrome** (single color, usually white or black)
- [ ] **Full Color** (cyan + violet gradient)

**Current Status**:

- ✅ Logo design complete (3D emblem with cosmic theme)
- ⚠️ Need to export all format variants
- ⚠️ Need to create light/dark mode versions

---

### Logo Variants by Use Case

**Required Variants**:

- [ ] **Social Media**
  - [ ] Square: 512x512, 1024x1024 (Twitter, Discord, LinkedIn profile)
  - [ ] Wide: 1500x500 (Twitter header, LinkedIn banner)
  - [ ] Story: 1080x1920 (Instagram/Facebook stories)

- [ ] **Website**
  - [ ] Favicon: 16x16, 32x32, 64x64 (ICO)
  - [ ] Apple Touch Icon: 180x180 (PNG)
  - [ ] Android Icon: 192x192, 512x512 (PNG)
  - [ ] Header Logo: 400x120 (PNG/SVG)
  - [ ] Footer Logo: 200x60 (PNG/SVG)

- [ ] **GitHub**
  - [ ] Repository Social Preview: 1280x640 (PNG)
  - [ ] Organization Avatar: 500x500 (PNG)

- [ ] **Marketing**
  - [ ] Email Header: 600x200 (PNG)
  - [ ] Presentation Title Slide: 1920x1080 (PNG)
  - [ ] Business Card: 300 DPI print-ready (PDF/PNG)

- [ ] **Merchandise** (future)
  - [ ] T-shirt Print: 4500x5400 (PNG, transparent)
  - [ ] Sticker: 3x3 inches, 300 DPI (PNG/SVG)
  - [ ] Mug Wrap: 3000x1200 (PNG)

---

## 🎨 DESIGN TOKENS

**Location**: `design_tokens.json`, `lib/design-tokens.ts`

### Color Palette

**Primary Colors**:

```
Cyan:   #00FFFF (rgb(0, 255, 255))
Violet: #8A2BE2 (rgb(138, 43, 226))
Gold:   #FFD700 (rgb(255, 215, 0))
Navy:   #0F0F23 (rgb(15, 15, 35))
Silver: #C0C0C0 (rgb(192, 192, 192))
White:  #FFFFFF (rgb(255, 255, 255))
```

**Gradients**:

```
Cyan→Violet:  linear-gradient(90deg, #00FFFF, #8A2BE2)
Gold Shimmer: linear-gradient(45deg, #FFD700, #FFA500, #FFD700)
Navy Halo:    radial-gradient(circle, rgba(15,15,35,0) 0%, #0F0F23 100%)
```

**Semantic Colors**:

```
Success: #00FF88 (green)
Warning: #FFA500 (orange)
Error:   #FF4444 (red)
Info:    #00FFFF (cyan)
```

### Typography

**Font Family**: Inter, Segoe UI, system-ui, sans-serif

**Font Weights**:

```
Regular:  400
Medium:   500
Semibold: 600
Bold:     700
```

**Font Sizes** (Tailwind scale):

```
xs:   0.75rem (12px)
sm:   0.875rem (14px)
base: 1rem (16px)
lg:   1.125rem (18px)
xl:   1.25rem (20px)
2xl:  1.5rem (24px)
3xl:  1.875rem (30px)
4xl:  2.25rem (36px)
```

### Spacing & Layout

**Spacing Unit**: 0.25rem (4px)

**Common Spacings**:

```
1:  0.25rem (4px)
2:  0.5rem (8px)
3:  0.75rem (12px)
4:  1rem (16px)
6:  1.5rem (24px)
8:  2rem (32px)
12: 3rem (48px)
16: 4rem (64px)
```

**Border Radius**:

```
sm: 0.125rem (2px)
md: 0.375rem (6px)
lg: 0.5rem (8px)
xl: 0.75rem (12px)
2xl: 1rem (16px)
3xl: 1.5rem (24px)
full: 9999px (circular)
```

### Motion & Animation

**Timing Functions**:

```
ease-in:     cubic-bezier(0.4, 0, 1, 1)
ease-out:    cubic-bezier(0, 0, 0.2, 1)
ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
```

**Durations**:

```
fast:   150ms
normal: 300ms
slow:   500ms
```

**Keyframes**:

```
shimmer:  Background gradient shift (3s loop)
pulse:    Opacity 1 → 0.7 → 1 (2s loop)
float:    Transform translateY(0 → -10px → 0) (3s loop)
spin:     Rotate 0 → 360deg (1s loop)
```

---

## 🖼️ BACKGROUND ASSETS

**Location**: `public/backgrounds/`, `assets/backgrounds/`

**Required Backgrounds** (cosmic-futurist theme):

- [ ] **Cosmic Emergence** (space nebula, purple/cyan)
  - [ ] 1920x1080 (standard)
  - [ ] 2560x1440 (HD)
  - [ ] 3840x2160 (4K)

- [ ] **Ocean Tidal** (abstract water waves, blue gradient)
  - [ ] 1920x1080
  - [ ] 2560x1440
  - [ ] 3840x2160

- [ ] **Forest Resonant** (mystical forest, green/gold)
  - [ ] 1920x1080
  - [ ] 2560x1440
  - [ ] 3840x2160

- [ ] **Circuit Neural** (digital brain pathways, cyan lines)
  - [ ] 1920x1080
  - [ ] 2560x1440
  - [ ] 3840x2160

- [ ] **Aurora Borealis** (northern lights, violet/green)
  - [ ] 1920x1080
  - [ ] 2560x1440
  - [ ] 3840x2160

**Format Requirements**:

- File format: JPG or WebP (optimized for web)
- Max file size: 500KB per background (compressed)
- Aspect ratio: 16:9
- Color space: sRGB

---

## 🎭 PERSONA AVATARS

**Location**: `assets/personas/`, `public/personas/`

**Required Avatars** (9 personas):

Core 6:

- [ ] **LuminAI** 🧠 (cyan/violet gradient, neural network motif)
- [ ] **Airth** 📚 (gold/amber, scrolls/knowledge symbols)
- [ ] **Arcadia** 🎭 (violet/pink, theatrical masks)
- [ ] **Ely** 🛠️ (silver/blue, tools/gears)
- [ ] **Adelphisa** 🌱 (green/earth tones, plant/life symbols)
- [ ] **Multi-Persona** ✨ (rainbow spectrum, all colors)

Extended 3:

- [ ] **Kaznak** 🌀 (dark purple/void, spiral/cosmic patterns)
- [ ] **The Mirror** 🪞 (reflective silver, symmetrical design)
- [ ] **The Reluctant Steward** 🔥 (orange/red, flame motif)

**Format Requirements** (per avatar):

- [ ] PNG 512x512 (transparent background)
- [ ] PNG 1024x1024 (high-res)
- [ ] SVG (vector, if possible)
- [ ] WebP 512x512 (web-optimized)

---

## 📊 UI COMPONENT ASSETS

**Location**: `public/icons/`, `assets/icons/`

### Icons & Glyphs

**Required Icons** (SVG + PNG):

- [ ] **Resonance Badge** (R metric display, circular)
- [ ] **Witness Chip** (✓ checkmark, rounded)
- [ ] **Frequency Glyphs** (16 symbols for frequencies)
- [ ] **Navigation Icons**:
  - [ ] Chat bubble
  - [ ] Microphone
  - [ ] Map/graph
  - [ ] Notebook
  - [ ] Settings gear
  - [ ] User profile

**Format Requirements**:

- SVG (preferred, scalable)
- PNG 64x64, 128x128 (fallback)
- Monochrome (single color, easy to recolor)

### Emoji Assets

**ConsentOS Emoji** (already standard Unicode, no custom needed):

- Intensity: 🟢🟡🟠🔴🟣
- Pace: ⏩▶️⏸️⏪🔄
- Boundary: 🚪🪟🧱🌉🗝️
- Emotion: 💧🔥🌊❄️⚡
- Meta: 👁️🪞🎭🧩🛸
- Safety: 🫂🆘🚨🏥☎️

**Status**: ✅ No custom assets needed (use system emoji)

---

## 📐 FIGMA DESIGN FILES

**Location**: `design/figma/`, `design/figma/exports/`

**Design Specs** (JSON exports):

- [x] RESONANCE_SCR-01_DASH_SKEL_struct.json (Dashboard)
- [x] RESONANCE_SCR-02_CHAT_SKEL_struct.json (Chat)
- [x] RESONANCE_SCR-03_NOTEBOOK_SKEL_struct.json (Notebook)
- [x] RESONANCE_SCR-04_THEME_SKEL_struct.json (Theme Studio)
- [x] RESONANCE_SCR-05_POD_SKEL_struct.json (Podcast)
- [x] RESONANCE_SCR-06_RMAP_SKEL_struct.json (Resonance Map)

**Mockups** (PNG/JPG screenshots):

- [ ] Dashboard (light mode)
- [ ] Dashboard (dark mode)
- [ ] Chat Interface (light mode)
- [ ] Chat Interface (dark mode)
- [ ] All 6 screens (composite overview)

**Source Files** (Figma):

- [ ] Link to Figma workspace (shareable)
- [ ] Export all frames as PNG (2x resolution)
- [ ] Component library (reusable UI elements)

---

## 📹 MARKETING ASSETS

**Location**: `assets/marketing/`

### Social Media Templates

- [ ] **Twitter/X Card**: 1200x628 (PNG)
  - [ ] Announcement template
  - [ ] Feature showcase template
  - [ ] Quote template

- [ ] **LinkedIn Post**: 1200x1200 (PNG)
  - [ ] Professional announcement
  - [ ] Case study template

- [ ] **Instagram Post**: 1080x1080 (PNG)
  - [ ] Visual identity showcase
  - [ ] Behind-the-scenes template

### Video Assets

- [ ] **Intro Animation** (5 seconds)
  - Logo reveal
  - Format: MP4, 1920x1080, 30fps

- [ ] **Explainer Video** (90 seconds)
  - Platform overview
  - Format: MP4, 1920x1080, 30fps

- [ ] **Demo Screencast** (3-5 minutes)
  - Walkthrough of key features
  - Format: MP4, 1920x1080, 60fps

### Presentation Assets

- [ ] **Pitch Deck Template**
  - PowerPoint (PPTX)
  - Google Slides (shareable link)
  - PDF (print-ready)

- [ ] **One-Pager** (marketing summary)
  - 8.5x11 inches, 300 DPI
  - PDF (print-ready)
  - PNG (web-optimized)

---

## 📄 DOCUMENTATION ASSETS

**Location**: `docs/`, various subdirectories

### Diagrams & Visuals

- [ ] **Architecture Diagram**
  - System overview (frontend/backend/database)
  - SVG (editable)
  - PNG 2000x1500 (high-res)

- [ ] **Data Flow Diagram**
  - Message routing (Harmony Node)
  - SVG
  - PNG 2000x1500

- [ ] **Resonance Formula Visualization**
  - TGCR equation with annotations
  - SVG (LaTeX rendered)
  - PNG 1500x800

- [ ] **Persona Cosmology Map**
  - 9 personas + relationships
  - SVG
  - PNG 2000x2000

### Screenshots

- [ ] **Platform Screenshots** (all 6 surfaces)
  - Dashboard
  - Chat
  - Notebook
  - Theme Studio
  - Podcast
  - Resonance Map
  - Format: PNG, 1920x1080, compressed

- [ ] **Feature Highlights**
  - ConsentOS panel
  - Axiom enforcement alerts
  - Session logs viewer
  - Emotion mapping
  - Format: PNG, 1200x800

---

## 🎁 MERCHANDISE ASSETS (Future)

**Location**: `assets/merchandise/` (to be created)

### Print-Ready Files

- [ ] **T-Shirt Design**
  - Front: Logo + tagline
  - Back: Frequency symbols
  - Format: PNG, 4500x5400, 300 DPI, transparent

- [ ] **Sticker Pack**
  - 9 persona avatars
  - Logo variations
  - ConsentOS emojis (custom versions)
  - Format: PNG/SVG, 3x3 inches, 300 DPI

- [ ] **Poster**
  - Resonance Unification Table
  - 16 Frequencies cosmology
  - Format: PDF/PNG, 18x24 inches, 300 DPI

- [ ] **Business Cards**
  - Front: Logo + name
  - Back: QR code + tagline
  - Format: PDF, 3.5x2 inches, 300 DPI

---

## 🔧 DEVELOPER ASSETS

**Location**: `tools/`, `scripts/design/`

### Code Generators

- [x] `build_screen_specs.py` (FigJam JSON exporter)
- [ ] `generate_logo_variants.py` (auto-create all formats)
- [ ] `optimize_images.sh` (compress PNGs/JPGs)
- [ ] `export_design_tokens.py` (JSON → CSS/SCSS/Tailwind)

### Template Files

- [ ] Component boilerplate (React/TypeScript)
- [ ] Module boilerplate (Node.js)
- [ ] API endpoint template (FastAPI)
- [ ] Test template (pytest/vitest)

---

## 📦 ASSET PRODUCTION WORKFLOW

### Phase 1: Core Identity (Week 1)

1. **Create logo variants**:
   - Export SVG master file
   - Generate all PNG sizes (512, 1024, 2048)
   - Create light/dark mode versions
   - Generate favicon (ICO)

2. **Design tokens**:
   - Finalize color palette
   - Export to `design_tokens.json`
   - Sync to `lib/design-tokens.ts`

3. **Backgrounds**:
   - Source/create 5 cosmic-themed backgrounds
   - Optimize for web (<500KB each)
   - Export 3 resolutions (1080p, 1440p, 4K)

### Phase 2: Platform Assets (Week 2)

1. **Persona avatars**:
   - Design 9 persona symbols
   - Export 512x512 and 1024x1024
   - Create WebP versions

2. **UI icons**:
   - Design 20+ common icons
   - Export SVG + PNG fallbacks
   - Add to icon library

3. **Screenshots**:
   - Capture all 6 surfaces
   - Edit for marketing (add annotations)
   - Compress for web

### Phase 3: Marketing Materials (Week 3)

1. **Social templates**:
   - Twitter/LinkedIn/Instagram cards
   - Export all sizes

2. **Presentation deck**:
   - 10-slide pitch deck
   - Export PPTX + PDF

3. **Documentation visuals**:
   - Architecture diagrams
   - Flow charts
   - Formula visualizations

### Phase 4: Merchandise Prep (Week 4+)

1. **Print-ready files**:
   - T-shirt designs (300 DPI)
   - Sticker pack
   - Business cards

2. **Video assets**:
   - Logo animation
   - Platform demo
   - Explainer video

---

## ✅ ASSET CHECKLIST SUMMARY

**Critical (MVP launch)**:

- [ ] Logo (SVG, PNG 512/1024, ICO)
- [ ] Dark mode logo variant
- [ ] 5 background images (optimized)
- [ ] Design tokens (JSON + TS)
- [ ] Favicon (all sizes)
- [ ] GitHub social preview (1280x640)

**High Priority (Beta launch)**:

- [ ] 9 persona avatars (512x512)
- [ ] UI icon set (SVG)
- [ ] Platform screenshots (6 surfaces)
- [ ] Architecture diagram
- [ ] Social media cards (Twitter, LinkedIn)

**Medium Priority (Public launch)**:

- [ ] Light mode logo variant
- [ ] Video assets (intro, demo)
- [ ] Presentation deck
- [ ] Documentation diagrams
- [ ] Marketing one-pager

**Low Priority (Future)**:

- [ ] Merchandise print files
- [ ] Sticker pack
- [ ] Business cards
- [ ] Poster designs

---

**Next Steps**:

1. Export logo variants (SVG → PNG pipeline)
2. Create persona avatar designs
3. Optimize background images
4. Generate favicon set
5. Build social media templates

💚 Ready to create brand consistency across all surfaces.
