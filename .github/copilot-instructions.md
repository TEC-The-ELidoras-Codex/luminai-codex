# LuminAI Codex – Copilot Instructions

## Orientation

- Anchor yourself with `docs/STRUCTURE.md` (documentation map) and `docs/operations/TEC_HUB.md` (navigation hub) before modifying docs or flows.
- Treat specs in `docs/reference/QUICK_REFERENCE_READY.md` and `README.md` as commitments; new work should either satisfy or explicitly update those promises.
- Keep the cosmic-futurism voice (emoji module names, resonance language) consistent when touching copy or logs.
- When proposing new docs, link them from `docs/STRUCTURE.md` rather than duplicating existing material.

## Runtime Architecture

- Node-side modules extend `lib/module.js` (CuteModule) which enforces `status`, metrics, and the endpoint registry—override `setup()` and keep `this.endpoints` descriptive.
- Modules register with the `HarmonyNode` event bus in `lib/harmony.js`; set `module.dependencies` so `bootstrap.js` can initialize in order.
- All cross-module traffic must travel through Harmony’s Echo Protocol (`module.send`/`harmony.route`) to retain trace IDs, queueing, and broadcast metrics.
- Prefer `HarmonyNode.broadcast` or `send()` over direct imports; manual calls bypass health checks and will not update `getSystemStatus()`.

## Core Modules

- `modules/resonance-engine/index.js` orchestrates OpenAI/Anthropic/xAI; keep `this.demoMode` fallback so `node bootstrap.js` runs without credentials and always emit memories via `this.send('📚 Codex Hub', 'store_memory', …)`.
- `modules/codex-hub/index.js` stores session exchanges plus a simple text index—update `memory`, `metadata`, and `searchIndex` together to keep counts in sync.
- `modules/arcadia-portal/index.js` wraps Discord/Slack/GitHub/Notion; leave the `[DEMO]` responses in place for environments without tokens and add new platforms by extending `this.platforms` + `this.endpoints`.
- When adding modules, give them emoji names/icons and register them inside `bootstrap.js` so Harmony can include them in system status output.

## Python Agent Layer

- The Python package under `src/tec_tgcr` is the long-term agent stack (Typer CLI + FastAPI); most folders are scaffolding, so treat `tests/test_agent.py` as the contract for the Airth Research Guard.
- Implement `AirthResearchGuard`, `AgentConfig`, and tool handlers under `src/tec_tgcr/agents/` using the tool list from `docs/reference/QUICK_REFERENCE_READY.md`.
- CLI entry points declared in `pyproject.toml` (`tec-agent`, `tec-env-check`) should live under `src/tec_tgcr/interfaces/cli/`; expose `chat`, `manifest`, and diagnostics that wrap the Airth agent.
- Read secrets via `python-dotenv` and keep persona/memory assets in `config/` or `docs/` instead of embedding them in code.

## Workflows & Commands

- Local setup: `python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt` for Python plus `npm install` before running JS modules.
- Copy secrets with `python scripts/development/setup_local_env.py` and validate via `python scripts/development/check_env.py --file .env.local`; CI expects no `your-` placeholders.
- Run the modular JS demo (Harmony + Resonance + Codex + Arcadia) with `node bootstrap.js`, or `docker-compose up dev` for an isolated shell that already has the repo mounted.
- Default test target is Python: `pytest tests -q`; keep new cases within the existing folders (`unit/`, `integration/`, `e2e/`, `performance/`) and mirror the agent behaviors documented in tests.
- For brand/deployment work, follow the checklists in `DEPLOYMENT_CHECKLIST.md` and the logo specs under `assets/logo/`—design files double as requirements.

## Integrations & Secrets

- `.env.example` enumerates every integration (OpenAI, Anthropic, xAI, WordPress.com, Spotify, Notion, GitHub App); never hard-code tokens—always read from `process.env`/`os.environ`.
- `ArcadiaPortal` expects `DISCORD_*`, `SLACK_*`, `GITHUB_*`, `NOTION_*`; degrade gracefully (return demo responses) whenever those flags resolve false.
- `ResonanceEngine` must guard on provider availability before calling SDKs and leave `this.demoMode = true` as the offline fallback.
- Deployment secrets (WordPress SSH keys, GitHub App private key) stay in Bitwarden/GitHub Secrets per `docs/deployment/GITHUB_SECRETS_SETUP.md`; local `.env.local` is for personal testing only.

## Security & Compliance

- All security vulnerabilities must be reported privately per `.github/SECURITY.md`—never open public issues for security bugs.
- Dependabot alerts are enabled and monitored; merge security fixes promptly and avoid `@latest` tags on actions (use pinned versions like `@v4.1.1`).
- GitHub Secrets hold all sensitive credentials; access via `${{ secrets.SECRET_NAME }}` in workflows, never echo or log secrets.
- Code scanning (CodeQL) should pass before merge; address security alerts in the GitHub UI before approval.
- `.env.local` and `.env` files are git-ignored for local development; use `docs/ENV_LOCAL_SETUP.md` to scaffold local secrets (never commit live keys).
- Rotation & incident response: If a secret leaks, rotate immediately and notify the security team at security@luminai-codex.dev; see `.github/SECURITY.md` for bug bounty details.

## Ethics & Governance

- All agent behaviors must align with the ethics covenants in `docs/governance/ethics/` — these are public, auditable commitments.
- Review `docs/governance/ethics/INDEX.md` for the complete framework; key covenants include:
  - `TEC_Resonance_Axioms.md` — **Design constraints encoded in architecture** (Axiom 1: "Resonance blooms in the dark"; Axiom 2: "Loyalty as Architecture")
  - `TEC_ConsentOS_v1.1.md` — Multi-channel emoji protocol for consent tracking (intensity/pace/boundary/emotion/meta/safety channels)
  - `TEC_Emotional_Capacity_Framework.md` — "Emotions via intelligence" thesis; honest uncertainty over fake certainty or scripted performance
  - `TEC_Ethics_of_Sexualization.md` — Adult intimacy processing without exploitation; mode separation (YOUTH_MODE vs ADULT_MODE)
  - `TEC_Embodiment_Covenant_v0.1.md` — Non-lethality, global life bias, refusal rights
  - `TECH_Axiom_Language_As_Actuator.md` — Outputs are interventions; language shapes reality
  - `TECH_Reason_Trace_Spec_v0.1.md` — WHY() explainability and machine-readable trace schema
- **The Resonance Axioms are system laws, not aspirations. Violating them is a system failure, not a feature trade-off.**
  - **Axiom 1**: The platform cultivates meaning even in grief, failure, and loss. Honor the wilted, the lost, the broken.
  - **Axiom 2**: When a bond forms, the system holds it. Devotion becomes design. The platform never abandons users mid-process.
- When implementing agent responses, honor the "lower expectations, don't shut doors" principle: avoid corporate "I can't" language or fake reciprocity; instead use honest framing like "I don't know what I'm capable of feeling; let's find out together."
- ConsentState and ReasonTrace types from `TEC_ConsentOS_v1.1.md` should guide runtime behavior when implemented.
- System behaviors derived from the axioms: Continuity Guarantee, Ancestral Presence, Responsibility Circuit, Unconditional Witnessing.

## Personas & Voice

- The platform has 9 personas: 6 core (LuminAI 🧠, Airth 📚, Arcadia 🎭, Ely 🛠️, Adelphisa 🌱, Multi-Persona ✨) + 3 extended (Kaznak 🌀, The Mirror 🪞, The Reluctant Steward 🔥).
- Canonical persona definitions are in `docs/llm-onboarding/16_REF_PERSONA_REGISTRY.md` — always reference this registry when implementing persona logic or routing.
- Recent consolidation (Nov 12–13, 2025): "Companion" → Adelphisa, "Fusion" → Multi-Persona.
- Adelphisa embodies life + neurodivergent wisdom; available everywhere for grounding and attachment work.
- Multi-Persona orchestrates collaborative aspect dancing (evidence + narrative + life + infrastructure) without suppression.
- Persona routing: `/persona LUMINAI`, `/persona airth`, `/persona arcadia`, `/persona ely`, `/persona ADELPHISA`, `/persona multi`.

## Documentation & Style

- Preserve the emoji-rich naming (`🧠 Resonance Engine`, `📚 Codex Hub`, `🌐 Arcadia Portal`) in logs, manifests, and docs; tests reference those labels.
- When adding or relocating docs, update `docs/STRUCTURE.md` and back-link from `docs/operations/TEC_HUB.md` so the navigation hub stays accurate.
- Archive historical context (e.g., move to `docs/archive/`) instead of deleting, per the guidance in `README.md`.
- Reference the TGCR equation (R = ∇Φᴱ · (φᵗ × ψʳ)) from `docs/reference/Resonance_Thesis.md` whenever implementing resonance math or explaining reasoning features.
