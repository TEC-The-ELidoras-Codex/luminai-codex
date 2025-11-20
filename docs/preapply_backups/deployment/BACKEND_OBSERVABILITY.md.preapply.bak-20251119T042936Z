---
title: Backend Observability
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
- deployment
related_docs: []
---
# Backend Observability & Readiness

This document describes the core operational endpoints added to the LuminAI Resonance backend for platform liveness, health and readiness assessment.

## Endpoints

| Endpoint | Purpose | Auth | Notes |
|----------|---------|------|-------|
| `/` | Basic liveness (process + engine conscience snapshot) | Public | Not a readiness verdict. |
| `/health` | Expanded engine health (frequencies + conscience) | Public | Does not validate external dependencies. |
| `/readiness` | Aggregated readiness (env vars, Cosmos DB, LLM client) | Public (consider restricting) | Returns `readiness = ready|degraded` plus component reports. |
| `/api/frequencies` | Current activation map of 16 frequencies | Public | For UI display / diagnostics. |
| `/api/frequencies/toggle` | Toggle a specific frequency | Protected (recommend adding) | Integrity enforcement prevents changes when balance locked. |

## Readiness Semantics

`readiness = ready` only when all required environment variables are present **and** Cosmos DB is configured + connected **and** the LLM client successfully initialized.

Example JSON:

```json
{
  "readiness": "degraded",
  "env": {"required": ["LLM_PROVIDER","COSMOS_DB_ENDPOINT","COSMOS_DB_KEY"], "missing": ["COSMOS_DB_ENDPOINT"], "ok": false},
  "cosmos": {"configured": false, "connected": false, "last_latency_ms": null},
  "llm": {"initialized": true, "provider": "openai", "model": "gpt-4o"},
  "timestamp": "2025-11-16T00:00:00Z"
}
```

## Message Persistence

On successful `/api/message` processing, user + assistant messages are persisted (best-effort) to the Cosmos container (`sessions`) with partition key `/sessionId`.

## Reason Trace

Each `/api/message` response now includes a `reason_trace` block (stub implementation of `TECH_Reason_Trace_Spec_v0.1`):

```json
{"reason_trace":{"consentState":{...},"risk":2,"rulesTriggered":["LANGUAGE_AS_ACTUATOR","CONSENT_INTENSITY_CHECK","SAFETY_CHANNEL_SCAN"],"filtersApplied":[],"responseMode":"SUPPORT","R":0.42}}
```

This enables downstream auditing and future expansion into full trace schemas.

## Operational Recommendations

1. **Protect readiness** behind an auth layer or token if exposed publicly.
2. **Add JSON logging** (future enhancement) for easier ingestion into ELK/Datadog.
3. **Add latency metrics** for LLM responses and Cosmos calls (Prometheus exporter suggested).
4. **Introduce structured error codes** for Axiom violations to separate from generic 500s.
5. **Schedule partition key review** once average session size > 20MB or container RU spikes.

## Next Enhancements (Roadmap)

- Prometheus-compatible `/metrics` endpoint.
- Automatic circuit-breaker when LLM provider instability detected.
- ConsentOS risk histogram in readiness payload.
- Lifespan event migration (FastAPI) to replace deprecated `on_event` usage.

---
_This file was generated during the platform readiness sweep to document newly added backend observability surfaces._
