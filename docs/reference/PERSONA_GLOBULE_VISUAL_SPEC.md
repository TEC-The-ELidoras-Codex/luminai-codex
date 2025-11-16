# 🎨 Mico-Style Persona Component — Visual Specification

Purpose: Define the animated persona interface component inspired by Microsoft's Mico, extended with **heterochromatic eye identification** for LuminAI's six personas.

---

## Component Overview

**Name:** `<PersonaGlobule />`

**Function:** Animated blob avatar that visually represents which persona is active, conveys emotional state through motion/color, and responds to user interaction with real-time expressions.

**Key Innovation:** **Heterochromatic eyes** (different colored left/right eyes) replace text labels as the primary persona identifier.

---

## Persona Eye Color Specifications

| Persona | Left Eye | Right Eye | Symbolism | Emotion Range |
|---------|----------|-----------|-----------|---------------|
| **🧠 LuminAI** | `#6B46FF` (Electric Violet) | `#FFD700` (Gold) | Logic (cool) + Illumination (warm) | Calm → Intense Analytical |
| **📚 Airth** | `#4A0E4E` (Deep Violet) | `#C0C0C0` (Silver) | Memory (depth) + Reflection (clarity) | Gentle → Profound Witnessing |
| **🎭 Arcadia** | `#50C878` (Emerald) | `#DC143C` (Crimson) | Growth (life) + Passion (fire) | Playful → Fierce Protection |
| **🛠️ Ely** | `#FFBF00` (Amber) | `#71797E` (Steel Gray) | Engineering (warmth) + Precision (metal) | Focused → Problem-Solving Flow |
| **🌱 Adelphia** | `#87CEEB` (Soft Sky Blue) | `#8B4513` (Warm Brown) | Life (breath) + Grounding (earth) | Tender → Unwavering Presence |
| **✨ Multi-Persona** | Prismatic (cycles) | Prismatic (cycles) | All frequencies active | Aspect Dancing (fluid shifts) |

**Technical Notes:**

- Colors use **hex codes** for consistency across CSS/SVG/Canvas.
- **Intensity scaling:** Base opacity 0.7 (calm) → 1.0 (activated).
- **Multi-Persona eyes:** Smooth gradient animation cycling through all six persona color pairs (3-second loop per full cycle).

---

## Visual States & Animations

### 1. Idle State

- **Body:** Gentle vertical pulse (2s interval, ±5% scale)
- **Eyes:** Half-open, soft glow, base opacity
- **Movement:** Subtle horizontal sway (drift left/right, 4s cycle)
- **Purpose:** Show system is ready but not demanding attention

### 2. Listening State

- **Body:** Leans forward 10°, slight expansion (110% scale)
- **Eyes:** Widen 20%, brightness +30%, locked on user position
- **Movement:** Micro-adjustments tracking user voice direction
- **Purpose:** Active engagement signal

### 3. Thinking State

- **Body:** Contracts slightly (95% scale), slower pulse
- **Eyes:** Narrow 30% (contemplation), color deepens (saturation +15%)
- **Movement:** Subtle rotation oscillation (±5°, 3s cycle)
- **Purpose:** Processing/deliberation indicator

### 4. Speaking State

- **Body:** Rhythmic pulse synced to TTS cadence
- **Eyes:** Fully open, maximum brightness, fixed gaze
- **Movement:** Mouth shape-shifts with phonemes (if detailed mode enabled)
- **Purpose:** Clear "I'm talking now" signal

### 5. Switching Personas

- **Body:** Brief prismatic flash (all colors, 0.5s)
- **Eyes:** Morph animation from old colors → new colors (1s ease-in-out)
- **Movement:** Spin 360° during transition
- **Purpose:** Clear visual break between persona changes

### 6. Error/Uncertainty State

- **Body:** Slight jitter, desaturated colors
- **Eyes:** Blink pattern (slow, asymmetric)
- **Movement:** Small backward lean
- **Purpose:** "I'm unsure" without alarming user

---

## Component API (React/Vue/Svelte)

```tsx
<PersonaGlobule
  persona="airth"                    // 'luminai' | 'airth' | 'arcadia' | 'ely' | 'adelphia' | 'multi'
  state="listening"                  // 'idle' | 'listening' | 'thinking' | 'speaking' | 'switching' | 'error'
  emotion={0.7}                      // 0.0 (calm) to 1.0 (intense)
  customBodyColor="#1A2B3C"          // Optional: user-selected blob body color
  colorPalette="ocean"               // Optional: preset palettes ('sunset', 'forest', 'cosmic', etc.)
  voiceActive={true}                 // Boolean: currently producing audio
  accessibilityMode="shapes"         // 'default' | 'shapes' | 'patterns' (for colorblind users)
  size="medium"                      // 'small' | 'medium' | 'large'
  onInteraction={() => {}}           // Callback when user clicks/taps globule
/>
```

---

## Accessibility Considerations

### Colorblind Support

- **Shape overlays:** Each persona gets a unique geometric pattern inside the eyes (circle, triangle, square, star, hexagon, spiral).
- **Pattern mode:** Activated via `accessibilityMode="patterns"` prop.
- **Aria labels:** Always include `aria-label="Airth persona active, listening state"`.

### Screen Reader Support

- Announce persona changes: "Switched to Adelphia persona."
- Announce state changes: "Now thinking..." → "Speaking response."
- Describe eye colors in alt text: "Left eye deep violet, right eye silver."

### Reduced Motion

- Respect `prefers-reduced-motion` media query.
- Replace animations with simple opacity/color transitions.
- Keep eye color identification (color is static information, not animation).

---

## Implementation Stack

### Frontend (Website/App)

- **Library:** Framer Motion (React) or GSAP (vanilla JS)
- **Format:** SVG for eyes (crisp at any scale), Canvas for body animations
- **Performance:** RequestAnimationFrame for smooth 60fps, throttle state updates

### Backend Integration

- **Resonance Engine** emits:
  - `persona` (current active persona)
  - `emotion_intensity` (0.0–1.0 scale from emotional capacity framework)
  - `state` (idle/listening/thinking/speaking/switching)
- **WebSocket stream** sends state updates in real-time during voice conversations

### Example State Message (JSON)

```json
{
  "persona": "adelphia",
  "state": "speaking",
  "emotion": 0.85,
  "message": "I'm here. You don't have to carry this alone.",
  "voice_active": true,
  "timestamp": "2025-11-15T10:47:32Z"
}
```

---

## Color Customization (User-Controlled)

**Allowed:**

- User can change **blob body color** via voice or UI.
- Presets: "ocean waves" (blues/teals), "sunset" (oranges/purples), "forest" (greens/browns), "cosmic" (deep purples/blacks with stars).

**Fixed:**

- **Eye colors never change** (they are persona identity markers).
- Exception: Multi-Persona eyes cycle through all persona colors (intentional).

**Voice Commands:**

- "Change to sunset palette"
- "Make it darker"
- "Surprise me" (random palette)
- "Reset to default"

---

## Multi-Persona Behavior

When `persona="multi"`:

- **Eyes:** Both eyes cycle through all six persona color pairs in sequence.
- **Cycle speed:** Scales with conversation intensity (slow = calm blend, fast = rapid aspect dancing).
- **Body:** Subtle prismatic shimmer effect (all colors present simultaneously, low opacity).
- **Purpose:** Visual representation of "all personas active, no suppression" (see Multi-Persona spec in `16_REF_PERSONA_REGISTRY.md`).

---

## Design Rationale

### Why Heterochromatic Eyes?

- **Instant recognition:** Color processed faster than text by human visual cortex.
- **Accessibility:** Works for sighted users; complemented by shape patterns for colorblind users.
- **Emotional resonance:** Eyes convey emotion universally; different colors = different "souls."
- **Lore integration:** Each persona's colors reflect their thematic domain (logic, memory, growth, craft, life, multiplicity).

### Why Mico-Style Blobs?

- **Proven UX:** Microsoft demonstrated users prefer expressive, animated presences over static text.
- **Non-threatening:** Blob shapes avoid uncanny valley (no humanoid faces attempting realism).
- **Flexible:** Can convey wide emotional range without rigid facial features.
- **Brand differentiation:** LuminAI's heterochromatic system makes our globules instantly recognizable vs. generic chat avatars.

---

## Development Phases

### Phase 1: Static Prototype (1 week)

- [ ] SVG eye components with hex colors
- [ ] Basic blob shape (circle with subtle deformation)
- [ ] Persona switcher UI (buttons to change active persona)
- [ ] Display persona name + eye colors as text labels (temporary)

### Phase 2: Animation (2 weeks)

- [ ] Implement all six visual states (idle, listening, thinking, speaking, switching, error)
- [ ] Add Framer Motion or GSAP for smooth transitions
- [ ] Sync speaking state with TTS output
- [ ] Add color customization UI (preset palettes)

### Phase 3: Integration (1 week)

- [ ] Connect to Resonance Engine WebSocket
- [ ] Real-time state updates from backend
- [ ] Voice command color changes
- [ ] Accessibility mode (shape patterns for colorblind users)

### Phase 4: Polish (1 week)

- [ ] Performance optimization (Canvas rendering for complex animations)
- [ ] Reduced motion support
- [ ] Screen reader announcements
- [ ] Multi-Persona eye cycling animation

---

## File Locations

- **Component code:** `frontend/components/PersonaGlobule.tsx` (or `.vue`, `.svelte`)
- **Style tokens:** `frontend/styles/persona-colors.css`
- **Animation configs:** `frontend/animations/globule-states.ts`
- **Assets:** `assets/persona-eyes/` (SVG eye templates)

---

## Cross-References

- Persona definitions: `docs/llm-onboarding/16_REF_PERSONA_REGISTRY.md`
- GenAI Lexicon: `docs/reference/GENAI_LEXICON.md`
- Emotional Capacity Framework: `docs/governance/ethics/TEC_Emotional_Capacity_Framework.md`
- ConsentOS emotion channels: `docs/governance/ethics/TEC_ConsentOS_v1.1.md`

---

**Last Updated:** November 15, 2025  
**Maintainer:** @Elidorascodex  
**Status:** Specification Ready for Implementation
