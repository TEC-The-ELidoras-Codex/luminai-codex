# `_TRANSFER_STAGING` Audit — November 12, 2025

**Scope:** 168 files across `docs_incoming`, `infrastructure_incoming`, `research_incoming`, and `tools_incoming`.

## Classification Summary

| Category | Count | Notes |
| --- | --- | --- |
| 🟢 Keep & Merge | 5 files | Context package spec, data axioms, glossary, persona registry, resonance map assets. All moved into `docs/llm-onboarding/`. |
| 🟡 Consolidate | 27 files | Unique content from coordination, API, production pipeline, Copilot strategy, webhook, secrets mapping, etc. distilled into 11 new onboarding summaries. |
| 🔴 Delete/Archive | 136 files | Outdated deployment reports (`SETUP_COMPLETE`, `ATTACHMENT_*`), duplicate quick references, redundant architecture/prototype folders, deprecated rumor-control docs. Canonical replacements already live in `docs/` or git history. |

## Kept & Merged

- `_TRANSFER_STAGING/docs_incoming/CONTEXT_PACKAGE_SPEC.md` → `05_CORE_CONTEXT_PACKAGE_SPEC.md`
- `_TRANSFER_STAGING/docs_incoming/LUMINAI_RESEARCH_DATA_AXIOMS.md` → `15_REF_DATA_AXIOMS.md`
- `_TRANSFER_STAGING/docs_incoming/GLOSSARY.md` → `13_REF_GLOSSARY.md`
- `_TRANSFER_STAGING/docs_incoming/PERSONAS_CONSOLIDATION_COMPLETE.md` → `16_REF_PERSONA_REGISTRY.md`
- `_TRANSFER_STAGING/docs_incoming/resonance_map/*` → merged into `14_REF_RESONANCE_MAP.md`

## Consolidated Into New Summaries

- **Coordination + Copilot** (`COORDINATION_INTEGRATION.md`, `COPILOT_SYSTEM_PROMPT.md`, `COPILOT_STRATEGY.md`) → `12_TECH_COPILOT_AND_AGENTS.md`
- **API & Automations** (`FOLD_RESEARCH_API.md`, `LUMINAI-API-SETUP-GUIDE.md`, `COORDINATION_INTEGRATION.md` automation sections, webhook docs) → `09_TECH_API_AND_AUTOMATIONS.md`
- **Production / Mascot workflow** (`LUMINAI_PRODUCTION_PIPELINE.md`, `LUMINAI_ANIMATION_PROMPTS.md`, `LUMINAI_MASCOT_SPEC.md`) → `11_TECH_DEPLOYMENT_PIPELINE.md` + `18_REF_STYLE_AND_BRAND.md`
- **Secrets mapping** (`SECRETS_MAPPING_EXAMPLE.md`, env checklists) → `07_TECH_ENV_AND_SECRETS.md`
- **Operations / Attachments / Rumor control** (`operations/ATTACHMENT_*.md`, `rumor_control*.md`) → `17_REF_TROUBLESHOOTING.md`
- **Architecture, wireframes, maps, development snippets** → content already represented in `docs/deployment/RESONANCE_PLATFORM_WIREFRAMES.md`, `docs/brand/`, `docs/gov`. Not duplicated; referenced via `20_REF_RESOURCE_INDEX.md`.

## Deleted (Superseded)

- `docs_incoming/SETUP_COMPLETE.md`, `LUMINAI_QUICK_REFERENCE.md`, `LUMINAI_Privacy_Policy.md`, `LUMINAI_Terms_of_Service.md` — replaced by canonical governance docs.
- `infrastructure_incoming/{bicep,terraform,kubernetes}` — old IaC stubs, no active manifests.
- `research_incoming/**` (benchmarks, prototypes, notebooks) — obsolete explorations; final derivations live in current research folder.
- `tools_incoming/**` — superseded by `scripts/` and `tools/` directories in root.

## Result

- `_TRANSFER_STAGING/` removed entirely after migration.
- `docs/llm-onboarding/` now hosts the 20-file “LLM Gift Package” (core, tech, reference).
- `docs/STRUCTURE.md` updated to point to the new bundle.
- Secrets or keys that ever lived in staging should be treated as rotated (documented in Tech 07).

For archaeology, use git history prior to this commit if you need any deleted artifact.
