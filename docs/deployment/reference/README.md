---
title: Readme
date_created: 2025-11-16
date_updated: 2025-11-16
status: draft
approvers:
  - persona: Ely
    role: Engineering Steward
owner_checklist:
  - [ ] Read and understood
  - [ ] Cross-linked in TEC_HUB.md and STRUCTURE.md
  - [ ] Tested commands/steps (if procedural)
  - [ ] Old version archived if replaced
tags: [deployment, reference]
---

# 📚 Deployment Reference

Comprehensive reference documentation for environment variables, secrets, and deployment architecture.

## Contents

| Document | Purpose | Read Time | For Whom |
|----------|---------|-----------|----------|
| **[ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)** | Complete reference for all 12+ categories of environment variables | 15 min | All developers, DevOps |
| **[SECRETS_DEPLOYMENT_GUIDE.md](./SECRETS_DEPLOYMENT_GUIDE.md)** | **CANONICAL** guide: where secrets go, why, and how to rotate them | 15 min | All developers, DevOps, automation |
| **[SECRETS_AND_TOKENS_EXPLAINED.md](./SECRETS_AND_TOKENS_EXPLAINED.md)** | Deep dive: types of secrets, Bitwarden, GitHub Secrets, local development | 10 min | Developers, security-focused roles |

## Quick Reference

### **Environment Variable Categories** (from ENVIRONMENT_SETUP.md)

1. **Core Application** — App name, version, environment
2. **Node.js Runtime** — Port, timeouts, clustering
3. **AI Services** — OpenAI, Anthropic, xAI keys
4. **External APIs** — Spotify, WordPress, GitHub tokens
5. **Platform Integrations** — Discord, Slack, Notion webhooks
6. **Database** — Cosmos DB connection strings
7. **Caching** — Redis configuration
8. **Monitoring** — Application Insights, Datadog keys
9. **CI/CD** — GitHub Actions variables
10. **Testing** — Test environment overrides
11. **Security** — CORS, auth headers, encryption keys
12. **Deployment** — Feature flags, region settings

### **Secret Types** (from SECRETS_AND_TOKENS_EXPLAINED.md)

| Type | Where | When to Use | Example |
|------|-------|-------------|---------|
| GitHub Secrets | GitHub repo settings | CI/CD workflows | `${{ secrets.OPENAI_API_KEY }}` |
| Bitwarden | Shared team vault | Local dev, team access | Copy to `.env.local` |
| `.env.local` | Local machine only | Development testing | Never commit! |
| GitHub Secrets (org) | Organization level | All repos in org | Cross-repo CI/CD |

## Using This Section

- **First time?** Read [SECRETS_AND_TOKENS_EXPLAINED.md](./SECRETS_AND_TOKENS_EXPLAINED.md) for conceptual overview
- **Need all vars?** Reference [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) for complete list with defaults
- **Setting up?** Follow [SECRETS_DEPLOYMENT_GUIDE.md](./SECRETS_DEPLOYMENT_GUIDE.md) for implementation steps

## See Also

- 📖 [Guides: Step-by-step instructions](../guides/README.md)
- ✅ [Checklists: Pre-deployment verification](../checklists/README.md)
- 🔐 [Archive: Deprecated files](../../archive/deprecated/deployment/)
