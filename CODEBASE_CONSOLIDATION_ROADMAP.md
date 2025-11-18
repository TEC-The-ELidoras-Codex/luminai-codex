# 🛠️ Codebase Consolidation Roadmap

Purpose: Systematically unify naming, documentation, manifests, and agent implementations to reduce cognitive load and eliminate drift.

## Phase 0 (Today) — Inventory & Planning

- [x] Manifest inventory (models/manifests) — single Ollama manifest present
- [x] Intro doc cross-linked (README, STRUCTURE, TEC_HUB)
- [x] Secrets management hardened (rotation log added)
- [x] Persona naming audit (Adelphisa vs Adelphia)
- [ ] Test suite status baseline

## Findings

1. Persona Name Divergence:
   - "Adelphisa" legacy spelling appears widely (audit grep ~50 matches in narrative/legacy docs)
   - Canonical per `.github/copilot-instructions.md` and README: **Adelphia**
   - Action: Bulk rename "Adelphisa" → "Adelphia" in non-historical docs; preserve in `archive/` if it conveys evolution.
2. Missing Decision Records:
   - Kubernetes usage not yet formally decided; create ADR-style memo.
3. Manifests:
   - Only Ollama model manifest JSON stored; need a `models/README.md` enumerating model sourcing & hash verification plan.
4. Agent Implementation:
   - Python persona modules (Adelphia, Ely) referenced but not fully implemented under `src/tec_tgcr/` — create stubs with TODO markers.
5. Pre-commit Hook:
   - Present; pending verification with dummy .env commit attempt.

## Phase 1 — Naming & Documentation Unification (Target: 1 day)

- [ ] Bulk replace "Adelphisa" → "Adelphia" across `docs/**` excluding `archive/` and session logs.
- [ ] Add glossary entry confirming deprecation of old spelling.
- [ ] Update any persona blend examples to use Adelphia.

## Phase 2 — Persona Code Stubs (Target: 1 day)

- [ ] Create `src/tec_tgcr/personas/adelphia.py` with base class + empathy/neurodivergent method placeholders.
- [ ] Create `src/tec_tgcr/personas/ely.py` with infrastructure helper skeleton.
- [ ] Register in CLI manifest export and agent loader.

## Phase 3 — Model & Manifest Governance (Target: 1–2 days)

- [ ] Add `models/README.md` describing provenance, verification (sha256 & size), update cadence.
- [ ] Script `scripts/security/verify_model_manifests.py` to validate digests vs local downloads.

## Phase 4 — Testing & Coverage (Target: 2 days)

- [ ] Expand `tests/test_agent.py` for Adelphia & Ely behaviors.
- [ ] Add resonance calculation test harness for multi-persona blend (Adelphia + Airth + LuminAI scenario).
- [ ] Integrate coverage gating in CI.

## Phase 5 — Kubernetes Revisit (Target: Post MVP)

- [ ] Reassess scale requirements; if >3 independently scalable services (frontend, api, vector store, event bus) + autoscaling needed → adopt K8s.
- [ ] Otherwise remain on Docker Compose with watch mode & basic health probes.

## Phase 6 — Automation & Rotation (Target: 1 day)

- [ ] Implement secret rotation script (`scripts/security/rotate_secrets.py`).
- [ ] Emit signed JSON receipts to `reports/secret-rotations/`.

## Tracking Conventions

- Use checkboxes; never delete completed tasks—append a completion date.
- Large replacements done via scripted patch saved under `scripts/maintenance/` with idempotent logic.

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Accidental rename of historical narrative | Restrict search scope; skip `archive/` and dated session logs |
| Secret exposure during manifest scripting | Run in sanitized container; never echo secret env vars |
| Drift in persona descriptions | Single source: `docs/llm-onboarding/16_REF_PERSONA_REGISTRY.md` |

## Next Action (Immediately After This Commit)

1. Verify pre-commit hook with dummy `.env.test` file.
2. Add Kubernetes decision memo.
3. Create dev recovery guidance doc.

---
Generated: 2025-11-16
