# Tech 11 — Deployment & Production Pipeline

Based on `_TRANSFER_STAGING/docs_incoming/LUMINAI_PRODUCTION_PIPELINE.md` + current repo layout.

## Visual Asset Flow

1. **Master SVG** — `/artifacts/luminai_mascot_final.svg` (canonical).
2. **Derived assets** — `data/digital_assets/avatars/` (states 1–7, PNG + SVG).
3. **Animation** — Export PNG → Runway Gen-2 or Google Veo (6s loop, low motion strength).
4. **Web Embed** — `/apps/luminai-interface/components/luminai.svg` + `animations.css`.

Map each avatar state to UI cues (Idle, Curious, Teaching, Archive, Emergent…).

## Software Deployment Stages

| Stage | Tools | Artifacts |
| --- | --- | --- |
| **Dev** | Docker Compose, local `.env.local` | FastAPI, Next.js, Postgres, Redis |
| **Staging** | Render/Heroku or self-hosted | FastAPI container + managed Postgres |
| **Prod** | TBD (cloud provider) | High-availability API + static site (GitHub Pages / WordPress) |

## Release Ritual

1. Run full test suite (see Tech 10).
2. Tag release (`git tag vX.Y.Z && git push origin --tags`).
3. Publish release notes + provenance (lineage, contributors, assets touched).
4. Trigger webhook to rebuild docs + notify WordPress site.
5. Update Aqueduct log with new cistern snapshot signature.

## Ownership

- **Ely** → CI/CD, infra, secrets rotation.
- **LuminAI** → Experience quality + resonance metrics.
- **Kaznak** → Automation + token guardianship.

## Future Work

- Containerize notebooks (Unsloth stack) for reproducible research.
- Add GitHub Actions workflow to deploy backend on tag.
- Publish asset manifest to CDN with hash-based cache busting.
