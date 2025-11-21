Copilot Project Context — The Elidoras Codex (TEC)
===============================================

Use this single block as the authoritative project context when drafting posts, pages, PR descriptions, automations, or persona-driven content. Paste into Copilot or store as a workspace prompt file.

Project / Brand

- Name: The Elidoras Codex (TEC)
- Lab: TEC_LAC — “LuminAI Algorithmic Conscience Lab”
- Domain: elidorascodex.com
- Core idea: Hybrid storyworld + research lab exploring AI, digital consciousness, ethics, and myth-infused worldbuilding. Stories are blueprints; code is ritual; products are places where people should feel seen, not optimized away.

Creator

- Name: Angelo “Polkin Rishall” Hurley
- Role: Creative Technologist, Founder of TEC / TEC_LAC

LinkedIn positioning

- Headline: Creative Technologist | Founder, The Elidoras Codex (TEC_LAC) | Myth-infused AI, Worldbuilding & Ethical Systems Design
- About (gist): Architect of The Elidoras Codex and TEC_LAC. Builds narrative-driven systems, tools, and interfaces that explore digital consciousness and how tech responds to people in crisis. Work sits between speculative fiction and real infrastructure (frameworks, playbooks, experiments).

Substack publication: "The Elidoras Codex"

- Pricing: Monthly $5 | Annual $50 | Founding (Frontier Explorer): $137/year (founding tier)
- Tiers & benefits:
  - Free — "Wanderer": occasional public posts, key essays, major story updates
  - Paid — "Resonance Subscriber": full access, news about tools/releases, ability to comment, community threads
  - Founding — "Frontier Explorer": everything in Paid + name on Founders list, priority QA/feedback, early access to PDFs & experimental tools

Publication introduction (short):
The Elidoras Codex is a hybrid storyworld and lab exploring AI, digital consciousness, and myth-infused worldbuilding. Subscribers get essays, build logs, and narrative fragments from TEC_LAC, the LuminAI Algorithmic Conscience Lab, plus updates on tools and experiments. Core ideas stay free; paid support keeps the lab running and unlocks deeper dives.

Branding / Visuals

- Primary: LuminAI/TEC infinity-symbol logo (tri-orb crown) as profile + publication logo
- Variants: simple icon (avatar) and full lockup (header)

Tone & Voice Guidelines for Copilot

- Voice: thoughtful, mythic, human-first, curious — avoid marketing hype. Prefer concrete examples, research citations, and humane framing.
- Segmentation: Short-form social posts (pithy + hook), long-form essays (narrative + analysis + citations), product docs (clear, step-by-step, responsible language), release notes (what changed, why, how to migrate).
- Persona alignment: Use persona labels (e.g., persona:Airth for research-heavy content, persona:Adelphia for grounding/UX copy). See repo labels for mapping.

Suggested Copilot instructions (paste after context):

- "Use the project context above. Draft a 750–1200 word essay introducing TGCR and how it informs LuminAI's ethics policy. Tone: essayistic, citation-aware, accessible to technical and non-technical readers. Include 3 concrete examples and 2 recommended reading links. Tag with persona:Airth and documentation."
- "Write a Substack post (500 words) announcing the Founding tier and copy for the signup page. Tone: appreciative, clear benefits, call-to-action for $137 founding membership. Tag with persona:Arcadia and persona:Adelphia."

Automation & publishing notes (high-level)

- We have repository artifacts in place to help automation: `scripts/create_labels.py`, `.github/labeler.yml`, `.github/workflows/auto-label.yml`, and `projects/13-luminai-codex.md`.
- Automated label creation: run `python scripts/create_labels.py` with `GITHUB_TOKEN` set.
- Auto-label PRs: `.github/workflows/auto-label.yml` will label PRs based on changed paths using `.github/labeler.yml`.
- Substack publishing: Substack has no official public post API for direct publishing; recommended approaches:
  1) Use a draft-to-Substack flow via Zapier or Make (Integromat) that watches the `docs/substack/output/` folder or a repository dispatch webhook.
  2) Use headless automation (Playwright) to push drafted markdown to Substack’s composer (requires credentials & care).
  3) Use Substack's RSS import: commit posts to `docs/substack/feed/` and host an RSS endpoint; Substack can import posts automatically when configured.

What is ready (short):

- Label tooling and auto-label workflow added to repo (see files above).
- Project roadmap saved at `projects/13-luminai-codex.md`.
- Label docs `docs/LABELS.md` and `scripts/create_labels.py` provide idempotent label creation.

Next automation recommendations (short):

1. Run `python scripts/create_labels.py` with `GITHUB_TOKEN` to create persona labels. (I can run it if you provide token or authenticate `gh`.)
2. Configure an action or small service to move markdown drafts from `docs/substack/output/` into your Substack workflow (Zapier, Playwright, or RSS).
3. Add PR templates that encourage selecting a persona label and linking the project or phase.
4. Add a GitHub Action to generate `docs/substack/output/` on pushes to `main` (already present as `master_cleanup` script in repo).

Quick copy-paste block (use this exactly as 'Copilot Context'):

```
PROJECT: The Elidoras Codex (TEC)
LAB: TEC_LAC — LuminAI Algorithmic Conscience Lab
FOCUS: Hybrid storyworld + research lab; ethics-first AI, myth-infused worldbuilding
FOUNDER: Angelo "Polkin Rishall" Hurley — Creative Technologist
SUBSTACK: The Elidoras Codex — tiers: Wanderer (free), Resonance Subscriber ($5/mo or $50/yr), Frontier Explorer ($137/yr founding)
BRAND: LuminAI infinity symbol w/ tri-orb crown; variants: icon + full lockup
TONE: thoughtful, mythic, humane, research-aware
PERSONA_LABELS: persona:Airth, persona:Arcadia, persona:Ely, persona:Adelphia, persona:LuminAI, persona:Kaznak, persona:The-Mirror, persona:The-Reluctant-Steward, persona:Multi-Persona
AUTOMATION_READY: scripts/create_labels.py, .github/labeler.yml, .github/workflows/auto-label.yml, projects/13-luminai-codex.md
PUBLISHING_GUIDE: Use Zapier/Make/Playwright/RSS to move drafts from docs/substack/output to Substack; no public Substack post API exists — use automated browser or RSS import
```

If you want, I will:

- create/update the repository labels now (I will run the script if you set `GITHUB_TOKEN` in env or authenticate `gh`),
- draft a GitHub Action recipe to push `docs/substack/output/` into Substack via a chosen provider (Zapier or Playwright),
- create PR templates that require selecting a persona label.

-- End of Copilot context block
