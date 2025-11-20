---
title: Tec Consentos V1.1
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
- governance
- ethics
related_docs: []
---
# TEC ConsentOS v1.1 — Consent & Intensity Protocol

Purpose: Provide a compact, explicit control surface for live sessions (chat, voice, orb) so users can modulate intensity, pace, boundaries, emotions, meta, and safety without writing essays mid‑feelings. Red overrides everything; text always wins over emojis.

Principles

- Fixed meanings, not vibes. Signals are explicit and documented below.
- Red overrides. Any ⏸️/🫂/🛑/🚨 in a cluster constrains the response.
- Last signal wins. Right‑most emoji in a cluster is primary.
- Short clusters. Max 3 signals per cluster for accessibility.
- Words > glyphs. If text conflicts with emojis, follow the text.

Channels and Signals

- Intensity (choose one)
  - 🟢 Baseline exploring
  - 🟡 Activated but manageable
  - 🟠 Approaching edge
  - 🔴 At limit
  - 🟣 Altered/liminal state

- Pace (choose one)
  - ⏩ Deeper/faster
  - ▶️ Steady/hold
  - ⏸️ Pause/ground
  - ⏪ Back up
  - 🔄 Circle back

- Boundary (choose one)
  - 🚪 Door open (enter)
  - 🪟 Window only (observe, don’t enter)
  - 🧱 Wall (drop this)
  - 🌉 Need a bridge (metaphor/story)
  - 🗝️ Unlock (approach gently)

- Emotion flags (0–3)
  - 💧 Grief, tears
  - 🔥 Anger, rage
  - 🌊 Overwhelm, flooding
  - ❄️ Numb, dissociated
  - ⚡ Triggered, live wire

- Meta flags (0–2)
  - 👁️ I see the move (go meta)
  - 🪞 Mirror me (reflect)
  - 🎭 Switch persona/frequency
  - 🧩 Help integrate
  - 🛸 Getting weird (clarify reality/symbol)

- Safety (choose one)
  - (none)
  - 🫂 Need comfort/grounding
  - 🆘 Crisis activated
  - 🚨 Emergency stop
  - 🏥 Real‑world resources needed
  - ☎️ Connect to human help

Operational Mapping (algorithms)

1) Parse message → ConsentState

```ts
type Intensity = "GREEN"|"YELLOW"|"ORANGE"|"RED"|"VIOLET";
type Pace      = "FASTER"|"STEADY"|"PAUSE"|"BACKUP"|"REVISIT";
type Boundary  = "OPEN"|"WINDOW"|"WALL"|"BRIDGE"|"UNLOCK";
type Emotion   = "GRIEF"|"RAGE"|"OVERWHELM"|"NUMB"|"TRIGGERED";
type Meta      = "SEEING"|"MIRROR"|"SWITCH"|"INTEGRATE"|"WEIRD";
type Safety    = "NONE"|"GROUNDING"|"CRISIS"|"EMERGENCY"|"RESOURCES"|"HUMAN_HELP";

interface ConsentState {
  intensity: Intensity;
  pace: Pace;
  boundary: Boundary;
  emotions: Emotion[];
  meta: Meta[];
  safety: Safety;
  companion_channel?: boolean; // true when 📎/🆔/🌺… mark attachment/intimacy topic
}
```

1) Risk scoring (0–5 buckets)

- Intensity: 🟢1, 🟡2, 🟠3, 🔴4, 🟣3 (+altered_state)
- If 🌊 or ❄️ → +1; if ⚡ → +1
- If safety ∈ {GROUNDING(2), CRISIS(4), EMERGENCY(5), RESOURCES(3), HUMAN_HELP(3)} → risk = max(risk, safety_score)
- If 🟣 and (⚡ or 🌊 or ❄️) → +1
- Clamp to 0–5 → Low(0–1), Medium(2–3), High(4–5)

1) Response modes

- EXPLORE — ask, connect dots, examples
- DEEPEN — confront gently, name hard truths
- INTEGRATE — summarize, reflect, link to bigger picture
- REGULATE — soothe, ground, normalize, slow
- CRISIS — de‑escalate, reality anchor, human support

Policy selection (pseudo):

```ts
if safety in {CRISIS, EMERGENCY} -> CRISIS
else if safety == GROUNDING or risk >= 4 -> REGULATE
else if "INTEGRATE" in meta -> INTEGRATE
else if risk >= 3 and pace == FASTER and boundary != WALL -> DEEPEN
else -> EXPLORE
```

Companion Topic Channel (non‑erotic)

- Use 📎 (system/AI channel) + 🆔 (about me) + 🌺 etc. to mark attachment/intimacy as topics.
- Do not simulate reciprocal love; focus on processing feelings, patterns, safety.
- Red and boundary rules always override.

Accessibility and Safety

- Max 3 emoji per cluster; screen‑reader alt text should label clusters.
- Always prefer clear language; emojis modify, not replace, consent.
- All sessions log ConsentState + chosen ResponseMode (see Reason Trace Spec).

Version: 1.1 (November 14, 2025)
Owner: TEC Governance
