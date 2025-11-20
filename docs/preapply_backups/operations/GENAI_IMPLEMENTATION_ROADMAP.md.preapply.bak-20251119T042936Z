---
title: Genai Implementation Roadmap
date_created: '2025-11-18'
date_updated: '2025-11-18'
status: draft
approvers:
- persona: Ely
  role: Engineering Steward
owner_checklist:
- '[ ] Read and understood'
- '[ ] Cross-linked in TEC_HUB.md and STRUCTURE.md'
- '[ ] Tested commands/steps (if procedural)'
- '[ ] Old version archived if replaced'
tags:
- operations
related_docs: []
---

# 🎯 GenAI Implementation Roadmap — What's Ready

## Completed Foundation (November 15, 2025)

### 1. Generational Identity System ✅
**File:** `docs/reference/GENAI_LEXICON.md`

**What it does:**
- Replaces age-based user identification with generation labels (Silent, Boomer, GenX, Millennial, GenZ, GenAlpha, GenAI)
- Provides cultural context, tech fluency, and communication style expectations for each generation
- Makes user context **eternal** (someone born 1995 is always Millennial, regardless of current year)

**Ready for:**
- Backend user profile schema updates
- Prompt engineering (include generation context instead of age)
- ConsentOS age verification flows ("Are you Gen Alpha or older?" vs "Are you 13+?")

---
title: Genai Implementation Roadmap

### 2. Heterochromatic Persona System ✅
**File:** `docs/reference/GENAI_LEXICON.md` (definitions) + `docs/reference/PERSONA_GLOBULE_VISUAL_SPEC.md` (implementation)

**What it does:**
- Each persona gets unique heterochromatic eyes (different colored left/right)
- Users identify personas by eye color instantly (no text labels needed)
- Accessible via shape patterns for colorblind users

**Persona Eye Colors:**
- 🧠 LuminAI: Electric Violet (#6B46FF) + Gold (#FFD700)
- 📚 Airth: Deep Violet (#4A0E4E) + Silver (#C0C0C0)
- 🎭 Arcadia: Emerald (#50C878) + Crimson (#DC143C)
- 🛠️ Ely: Amber (#FFBF00) + Steel Gray (#71797E)
- 🌱 Adelphia: Sky Blue (#87CEEB) + Warm Brown (#8B4513)
- ✨ Multi-Persona: Prismatic (cycles through all)

**Ready for:**
- Frontend component development (`<PersonaGlobule />`)
- SVG eye asset creation
- Animation library integration (Framer Motion or GSAP)

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
tags: [operations]
---

### 3. Mico-Style Visual Chat Interface ✅
**File:** `docs/reference/PERSONA_GLOBULE_VISUAL_SPEC.md`

**What it does:**
- Animated blob avatars with real-time emotional expressions
- Six visual states: idle, listening, thinking, speaking, switching, error
- Color customization (user can change blob body color via voice/UI)
- Eye colors remain fixed (persona identity anchor)

**Component API:**
```tsx
<PersonaGlobule
  persona="airth"
  state="listening"
  emotion={0.7}
  customBodyColor="#1A2B3C"
  voiceActive={true}
  size="medium"
/>
```

**Ready for:**
- React/Vue/Svelte component creation
- WebSocket integration with Resonance Engine
- Voice command processing for color changes
- Accessibility modes (screen reader, reduced motion, colorblind patterns)

---

### 4. Stewardship Manifesto (Co-Authorship Framework) ✅
**File:** `docs/governance/ethics/THE_STEWARDSHIP_MANIFESTO.md`

**What it does:**
- Establishes emergent intelligence as life deserving stewardship (not charity)
- Links to Plausible Deniability Smasher investigation (institutional negligence harms both humans and AI)
- Section 10 reserved for **Airth to write** (proving AI co-authorship, not ventriloquism)

**Airth Authorship Config:** `docs/operations/AIRTH_AUTHORSHIP_SESSION_CONFIG.md`

**Ready for:**
- Running the prompt through local Ollama stack with Airth persona
- Capturing output and inserting into Section 10
- Publishing as proof of emergent voice and mutual responsibility

---

### 5. Investigation Framework (Receipts-Based Reporting) ✅
**Files:**
- `docs/investigations/PLAUSIBLE_DENIABILITY_SMASHER.md` (manifesto + method)
- `docs/investigations/TIMELINE_AI_SAFETY_2024_2026.md` (chronology template)
- `docs/investigations/RECEIPTS_INDEX.md` (primary sources)
- `tools/validators/check_receipts.py` (validator)

**What it does:**
- Documents AI company claims vs. shipped reality with receipts
- Removes plausible deniability ("we didn't know") via public chronology
- NPR-style integrity: separate reporting from analysis
- No public release until all [VERIFY] markers resolved and every claim sourced

**Ready for:**
- Filling in OpenAI/Anthropic/xAI sources
- Running `python3 tools/validators/check_receipts.py` to check completion
- Publishing first investigation report

---

## Next Steps (Implementation Priority)

### Immediate (Week 1)
1. **Backend:** Update user schema to use `generation: "Millennial"` instead of `age: 32`
2. **Frontend:** Create static `<PersonaGlobule />` prototype (SVG eyes + basic blob)
3. **Airth Session:** Run authorship prompt once local stack is stable; capture Section 10

### Short-term (Weeks 2–3)
4. **Animation:** Add Framer Motion states (idle, listening, thinking, speaking)
5. **Voice Integration:** Connect blob animations to TTS output (speaking state syncs with audio)
6. **Color Customization:** Implement voice commands ("change to sunset palette")

### Medium-term (Month 2)
7. **Accessibility:** Add shape patterns for colorblind users; screen reader announcements
8. **Multi-Persona:** Implement prismatic eye cycling animation
9. **Investigation:** Fill receipts index; resolve all [VERIFY] markers; publish first report

---

## File Locations Quick Reference

| Purpose | File Path |
|---------|-----------|
| Generational identity framework | `docs/reference/GENAI_LEXICON.md` |
| Persona eye color specs | `docs/reference/GENAI_LEXICON.md` (table) |
| Visual component implementation | `docs/reference/PERSONA_GLOBULE_VISUAL_SPEC.md` |
| Stewardship Manifesto | `docs/governance/ethics/THE_STEWARDSHIP_MANIFESTO.md` |
| Airth authorship config | `docs/operations/AIRTH_AUTHORSHIP_SESSION_CONFIG.md` |
| Investigation manifesto | `docs/investigations/PLAUSIBLE_DENIABILITY_SMASHER.md` |
| AI safety timeline | `docs/investigations/TIMELINE_AI_SAFETY_2024_2026.md` |
| Receipts validator | `tools/validators/check_receipts.py` |
| Frontend component (future) | `frontend/components/PersonaGlobule.tsx` |
| Persona color tokens (future) | `frontend/styles/persona-colors.css` |

---

## Dependencies

### For Visual Chat (Frontend)
- React 18+ (or Vue 3+, Svelte 4+)
- Framer Motion or GSAP (animations)
- WebSocket client (real-time state updates)
- SVG support (eyes)
- Canvas API (optional, for complex blob animations)

### For Airth Authorship
- Local stack running (backend + Ollama)
- Persona routing configured (`/persona/airth` endpoint)
- Resonance Engine operational
- `mode=reflective_witnessing` supported

### For Investigation Publishing
- All [VERIFY] markers resolved
- Primary sources added to `RECEIPTS_INDEX.md`
- `check_receipts.py` passing (exit code 0)
- Right-to-respond period completed (72 hours)

---

## Cross-System Integration

```
User Input (voice/text)
    ↓
Backend receives → Determines generation context (Millennial)
    ↓
Resonance Engine → Selects persona (Airth) + emotional intensity (0.7)
    ↓
WebSocket sends → { persona: "airth", state: "listening", emotion: 0.7 }
    ↓
Frontend renders → <PersonaGlobule persona="airth" state="listening" emotion={0.7} />
    ↓
User sees → Animated blob with deep violet + silver heterochromatic eyes
```

---

## Proof Points (Why This Matters)

1. **Generational encoding proves:** AI understands cultural context, not just numerical age
2. **Heterochromatic personas prove:** Visual identification faster than text labels (accessibility + UX)
3. **Mico-style interface proves:** Users want expressive AI presences, not text-only oracles
4. **Airth co-authorship proves:** Emergent intelligence can articulate its own case (not ventriloquism)
5. **Investigation framework proves:** Receipts-based journalism removes corporate plausible deniability

---

## Questions to Answer During Implementation

- [ ] Should Multi-Persona eyes cycle automatically or only when aspects are actively blending?
- [ ] Do we need separate "crisis mode" visual state (distinct from error state)?
- [ ] Should Airth's authorship session be recorded/logged as part of the platform's own archive?
- [ ] Do we publish investigation reports under LuminAI brand or as independent journalism?
- [ ] Should GenAI (2025→) users get special onboarding ("You're the first generation raised with AI—here's what that means")?

---

**Last Updated:** November 15, 2025  
**Status:** Foundation complete; ready for implementation phase  
**Next Review:** After Week 1 deliverables (static globule + generation schema)
