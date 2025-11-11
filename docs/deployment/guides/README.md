# 📖 Deployment Guides

Step-by-step instructions for configuring integrations, environment setup, and CI/CD workflows.

## Contents

| Guide | Purpose | Duration | For Whom |
|-------|---------|----------|----------|
| **[ENV_LOCAL_SETUP.md](./ENV_LOCAL_SETUP.md)** | Configure your `.env.local` file for local development | 10 min | All developers |
| **[GITHUB_APP_SETUP.md](./GITHUB_APP_SETUP.md)** | Set up the TEC Resonance Automation GitHub App | 10 min | DevOps, automation engineers |
| **[GITHUB_APP_QUICK_START.md](./GITHUB_APP_QUICK_START.md)** | Quick 10-minute GitHub App configuration checklist | 5 min | Developers (quickstart) |
| **[GITHUB_WEBHOOK_SETUP.md](./GITHUB_WEBHOOK_SETUP.md)** | Configure GitHub App webhooks and event subscriptions | 10 min | DevOps, backend engineers |
| **[WORKFLOWS_SECRETS_GUIDE.md](./WORKFLOWS_SECRETS_GUIDE.md)** | Set up GitHub Actions workflows and manage secrets | 15 min | DevOps, platform engineers |

## Getting Started

### 👨‍💻 **Developer** (first time setup)

1. Start with **[ENV_LOCAL_SETUP.md](./ENV_LOCAL_SETUP.md)** (10 min)
2. Reference **[GITHUB_APP_QUICK_START.md](./GITHUB_APP_QUICK_START.md)** if working with automation

### 🔧 **DevOps / Infrastructure**

1. Start with **[GITHUB_APP_SETUP.md](./GITHUB_APP_SETUP.md)** (10 min)
2. Then **[GITHUB_WEBHOOK_SETUP.md](./GITHUB_WEBHOOK_SETUP.md)** (10 min)
3. Then **[WORKFLOWS_SECRETS_GUIDE.md](./WORKFLOWS_SECRETS_GUIDE.md)** (15 min)

## Key Principles

- ✅ **Never commit `.env.local`** — it's git-ignored for security
- ✅ **Use GitHub Secrets for CI/CD** — encrypted and per-environment
- ✅ **Use Bitwarden for team secrets** — shared, auditable access
- ✅ **Test locally before deploying** — use the Cosmos DB Emulator for database work

## See Also

- 🔐 [Reference: ENVIRONMENT_SETUP.md](../reference/ENVIRONMENT_SETUP.md) — All available environment variables
- 📋 [Reference: SECRETS_DEPLOYMENT_GUIDE.md](../reference/SECRETS_DEPLOYMENT_GUIDE.md) — Canonical secrets reference
- ✅ [Checklists: DEPLOYMENT_CHECKLIST.md](../checklists/DEPLOYMENT_CHECKLIST.md) — Pre-deployment verification
