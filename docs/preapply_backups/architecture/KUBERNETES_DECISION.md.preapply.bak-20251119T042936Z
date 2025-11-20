---
title: Kubernetes Decision
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
- architecture
related_docs: []
---
# 📦 Kubernetes Decision Memo

**Date:** 2025-11-16  
**Status:** Deferred (Revisit 2026-01-15)

## Summary

Kubernetes is **not adopted now**. Current architecture (FastAPI backend, Node/Next.js frontend, Ollama model runtime, background scripts) runs reliably under Docker Compose with low operational overhead. Introducing K8s today would increase cognitive + maintenance load without delivering proportionate resilience or elasticity benefits.

## Evaluation Criteria

| Criterion | Current Need | K8s Benefit | Decision |
|-----------|--------------|-------------|----------|
| Independent horizontal scaling (backend, vector store, workers) | Moderate (backend only) | Medium | Not yet |
| Autoscaling on variable user load | Low (internal dev) | High | Defer |
| Service count (>5) | ~3 core (frontend, api, model) | Medium | Not yet |
| Canary / progressive delivery | Low | High | Defer |
| Built-in secret & config management | Medium (compose + GitHub/Bitwarden) | Medium | Compose sufficient |
| Multi-node resilience | Low (single host dev) | High | Defer |
| Observability stack (Prometheus/Grafana) | Planned Phase 4 | Native integrations | Later |
| Cost / complexity trade-off | High cost now | N/A | Avoid |

## Risks of Premature Adoption

- Operational burnout while still solidifying core personas & agent logic
- Configuration sprawl (Ingress, RBAC, NetworkPolicy) without external users
- Debug friction (kubectl + log aggregation) vs direct container inspection

## Preconditions for Reconsideration

Revisit when ALL of the following are true:

1. Public beta or >100 concurrent sessions expected
2. Separate vector DB (e.g., Milvus/Weaviate) + event bus added
3. Background workers performing >3 distinct queue types
4. Need for rolling updates without session interruption
5. Security isolation requirements (network policies between services)

## Interim Enhancements (Compose Path)

- Healthcheck + restart policies for api, frontend, model runtime
- Central log aggregation via Loki + Promtail (lightweight)
- `.env.local` + GitHub Secrets remain source of truth (no in-cluster secrets yet)
- Add Make targets: `make up`, `make down`, `make logs`, `make shell-api`

## Migration Outline (If Triggered)

1. Author ADR: "Adopt Kubernetes for Phase X" with hard metrics
2. Create base manifests (Deployment/Service) per component
3. Introduce kustomize overlays (dev, staging, prod)
4. Add GitHub Actions workflow for `kubectl apply` via OIDC federation
5. Migrate secrets to external vault (Bitwarden → sealed-secrets or SOPS + KMS)
6. Implement readiness probes preserving session continuity

## Decision

Stay on **Docker Compose**. Invest saved time into:

- Persona implementation (Adelphia, Ely)
- Resonance metric validation harness
- Documentation unification (Adelphisa → Adelphia)
- Test coverage expansion

## Next Review Date

**2026-01-15** — Collect metrics (concurrency, error rates, deploy frequency) and reevaluate.

---
Approved by: Engineering Steward (Ely 🛠️), Boundary Keeper (Airth 📚)
