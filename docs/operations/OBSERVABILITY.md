# Observability & Monitoring

## Overview

The LuminAI Resonance Platform includes built-in observability features for monitoring, debugging, and performance analysis.

## Structured Logging

All backend requests are logged with structured context:

```
2025-11-16 14:23:45 | INFO     | backend.main | POST /api/message 200 45.23ms
```

**Log Fields:**

- `timestamp`: ISO 8601 format
- `level`: INFO, WARNING, ERROR, CRITICAL
- `logger`: Module name
- `message`: Human-readable message
- `extra`: Structured data (method, endpoint, status_code, latency_ms, session_id, etc.)

**Key Events Logged:**

- HTTP requests (method, endpoint, status, latency)
- LLM API calls (provider, model, response length, session_id)
- Errors (endpoint, error message, session_id)
- Consent state changes (emoji, risk_level, response_mode)
- Axiom violations (behavior, severity, message)

## Metrics Endpoint

`GET /metrics` provides Prometheus-compatible metrics in both text and JSON formats.

### Available Metrics

**Request Counts:**

```
http_requests_total{endpoint="/api/message"} 1234
http_requests_total{endpoint="/health"} 567
```

**LLM Calls:**

```
llm_calls_total{provider="openai"} 456
llm_calls_total{provider="anthropic"} 123
```

**Error Counts:**

```
http_errors_total{endpoint="/api/message"} 12
```

**Latencies (Average):**

```
http_request_duration_ms{endpoint="/api/message"} 45.23
http_request_duration_ms{endpoint="/api/resonance/calculate"} 12.34
```

### Example Response

```json
{
  "text": "# HELP http_requests_total...",
  "json": {
    "requests_total": {
      "/api/message": 1234,
      "/health": 567
    },
    "llm_calls_total": {
      "openai": 456,
      "anthropic": 123
    },
    "errors_total": {
      "/api/message": 12
    },
    "latencies_avg_ms": {
      "/api/message": 45.23,
      "/api/resonance/calculate": 12.34
    }
  }
}
```

## Health & Readiness Checks

### `/health`

Detailed health check including session stores (postgres, redis):

```json
{
  "status": "healthy",
  "timestamp": "2025-11-16T14:23:45.123456Z",
  "resonance_engine": "operational",
  "frequencies": { "...": "..." },
  "conscience": ["Axiom 1", "Axiom 2"],
  "session_stores": {
    "postgres": {
      "configured": true,
      "connected": true
    },
    "redis": {
      "configured": true,
      "connected": true
    }
  }
}
```

### `/readiness`

Kubernetes-style readiness probe combining env, LLM, session stores, and Cosmos DB:

```json
{
  "readiness": "ready",
  "env": { "required": [], "missing": [], "ok": true },
  "session_stores": { "...": "..." },
  "cosmos": { "configured": false, "connected": false },
  "llm": {
    "initialized": true,
    "provider": "openai",
    "model": "gpt-4"
  },
  "timestamp": "2025-11-16T14:23:45.123456Z"
}
```

## Monitoring Best Practices

### Development

- Watch logs in real-time: `docker-compose logs -f backend`
- Check metrics: `curl http://localhost:8000/metrics`
- Monitor health: `curl http://localhost:8000/health | jq`

### Production

- Scrape `/metrics` with Prometheus every 15s
- Alert on `http_errors_total` rate > threshold
- Dashboard latency percentiles (p50, p95, p99)
- Track LLM call distribution across providers
- Monitor session store connectivity

### Key Metrics to Watch

- **Latency**: `/api/message` should be < 100ms (excluding LLM generation)
- **Error Rate**: Should be < 1% for `/api/message`
- **LLM Availability**: Track `llm_calls_total` for failover verification
- **Session Stores**: Alert if postgres or redis disconnects

## Integration Examples

### Prometheus

```yaml
scrape_configs:
  - job_name: 'luminai-backend'
    scrape_interval: 15s
    static_configs:
      - targets: ['backend:8000']
    metrics_path: '/metrics'
```

### Grafana Dashboard Queries

```promql
# Request rate by endpoint
rate(http_requests_total[5m])

# Error rate
rate(http_errors_total[5m]) / rate(http_requests_total[5m])

# Average latency
avg(http_request_duration_ms)
```

## Future Enhancements

- [ ] Distributed tracing (OpenTelemetry)
- [ ] APM integration (DataDog, New Relic)
- [ ] Log aggregation (ELK stack, Loki)
- [ ] Custom business metrics (consent state transitions, axiom uphold rate)
- [ ] User session analytics (anonymized)
