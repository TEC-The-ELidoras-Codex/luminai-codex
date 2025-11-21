---
title: Dev Recovery
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

# 🧪 Developer Recovery & Burnout Reset Guide

---

title: Developer Recovery & Burnout Reset Guide
date_created: 2025-11-09
date_updated: 2025-11-16
status: approved
approvers:
 - persona: Adelphia 🌱
  role: Life Everywhere
  approved_date: 2025-11-16
 - persona: Airth 📚
  role: Boundary Keeper
  approved_date: 2025-11-16
 - persona: Ely 🛠️
  role: Engineering Steward
  approved_date: 2025-11-16
owner_checklist:
 - [x] Read and understood
 - [x] Tested during actual burnout recovery (2025-11-16)
 - [x] Cross-linked in TEC_HUB.md
 - [ ] Scheduled quarterly review (Feb 2026)
tags: [recovery, burnout, crisis, workflow, grounding]
related_docs:
 - docs/operations/TEC_HUB.md
 - CODEBASE_CONSOLIDATION_ROADMAP.md
 - docs/governance/ethics/TEC_Embodiment_Covenant_v0.1.md
---

# 🧪 Developer Recovery & Burnout Reset Guide

**Intent:** Rapid protocol for when you're flooded, exhausted, or ready to delete everything. You don't fix architecture while your nervous system is in collapse—you stabilize first, then execute.

## 1. Immediate Stabilization (5–7 minutes)

1. Close all terminals except one clean shell.
2. Run: `git status` — confirm nothing critical is mid-rebase.
3. Snapshot work: `git diff > /tmp/snapshot.patch` (DO NOT read it now; it's a safety net.)
4. Hydrate + 10 deep breaths (4s inhale / 6s exhale). Exhale longer than inhale.
5. State aloud or write: "The code is intact. I am not my fatigue. I choose continuity." (Interrupt catastrophic narratives.)

## 2. Narrow Focus to ONE Micro-Win

> **🌱 Adelphia** (Life Everywhere)  
> This step seems small — almost insultingly small when you're overwhelmed. But it's not about fixing everything. It's about proving to your nervous system that forward motion is still possible. One commit. One breath. One proof that you're not stuck.

Pick a SINGLE actionable task under 15 minutes:

- Rename one variable for clarity
- Add one doc cross-link
- Write one missing test case skeleton
- Verify pre-commit hook still blocks `.env` files

When done, commit with a continuity message:

```bash
feat: micro-win continuity checkpoint
```

## 3. Safeguard Against Destructive Impulses

> **📚 Airth** (Boundary Keeper)  
> "Nuke repo" is not a technical decision. It's a cognitive distortion. When you see that impulse, recognize it as fatigue speaking — not reality. The code is intact. Your judgment is temporarily offline. Follow the replacement actions below; they're designed for exactly this state.

| Impulse | Replacement Action |
|---------|--------------------|
| "Nuke repo" | Create branch `safety/experiment-<date>` and sandbox there |
| "Delete untracked files" | Run `git clean -n` first; never run blind `-f` when exhausted |
| "Rewrite history" | Write TODO in ROADMAP instead; schedule refactor when stable |

## 4. Reconnect with System Purpose

Re-read ONE of:

- `README.md` intro section
- `docs/education/UNDERSTANDING_LUMINAI_CODEX.md` opening problem statement
- `MANIFESTO.md` lines 150–190 (Action over despair)

Ask: "Which user outcome improves if I keep going for 30 more minutes?" Pick that task.

## 5. Physiological Reset (Optional)

> **🌱 Adelphia** (Life Everywhere)  
> "Optional" is a lie. Your nervous system doesn't negotiate with productivity guilt. Cold water on your face is vagus nerve stimulation — it's a biology hack, not self-care fluff. Two minutes buys you 20 minutes of clearer thought. Non-negotiable when you're at this threshold.

- Cold water on face / wrists (vagus stimulation)
- 2-minute walk away from screen
- Light shoulder mobility (shrug + roll x10)

## 6. Structured Exit (If You Must Stop)

1. `git add -A && git commit -m "chore: WIP savepoint before rest"`
2. Add a line in `CODEBASE_CONSOLIDATION_ROADMAP.md` under Phase 0 with date + "Paused; resume with Phase 1"
3. Close editor entirely; remove unresolved cognitive hooks.

## 7. Peer / Future Self Signal

Leave a focused note (not a rant) in `reports/dev-log-<date>.md`:

```text
Today: Overload peaked. Saved work. Next task: rename Adelphisa -> Adelphia in education docs.
Blocker: Fatigue only; architecture stable.
```

## 8. When Returning

1. Read last commit message.
2. Run tests: `pytest -q`.
3. Open `CODEBASE_CONSOLIDATION_ROADMAP.md`; start top unchecked item.
4. Avoid context thrash: no multi-file wandering for 15 min.

---
**Mantra:** "Continuity beats intensity." Small coherent actions outlast extremes.

---

## Revision History

| Date | Approver | Change Summary |
|------|----------|----------------|
| 2025-11-09 | Ely 🛠️ | Initial draft |
| 2025-11-16 | Airth 📚 | Security review + approval |
| 2025-11-16 | Adelphia 🌱 | Added margin notes + metadata block |

---

**Mantra:**  
"Continuity beats intensity. Small coherent actions outlast extremes."

**Approved by:**  
🌱 Adelphia (Life Everywhere) — 2025-11-16  
📚 Airth (Boundary Keeper) — 2025-11-16  
🛠️ Ely (Engineering Steward) — 2025-11-16
