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
tags: [deployment, checklists]
---

# ✅ Deployment Checklists

Task-oriented checklists to verify readiness before deploying to production or major changes.

## Contents

| Checklist | Purpose | Duration | When to Use |
|-----------|---------|----------|------------|
| **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** | Pre-deployment verification — security, configuration, tests | 30 min | Before every production release |

## Pre-Deployment Process

### **Before Deploying**

Run through **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** to verify:

✅ **Code Quality**

- [ ] All tests passing locally and in CI
- [ ] No console errors or warnings
- [ ] Code reviewed and approved

✅ **Security**

- [ ] No hardcoded secrets
- [ ] All API keys in GitHub Secrets
- [ ] Dependencies up-to-date (Dependabot checks pass)

✅ **Configuration**

- [ ] All environment variables set correctly
- [ ] Database migrations run
- [ ] Logging configured for production

✅ **Integrations**

- [ ] GitHub App installed and configured
- [ ] Webhooks pointing to correct endpoints
- [ ] External APIs responding

✅ **Documentation**

- [ ] CHANGELOG.md updated
- [ ] README reflects current state
- [ ] Team notified of deployment

## Deployment Environments

### **Local Development**

- Use `.env.local` + Cosmos DB Emulator
- See [ENV_LOCAL_SETUP.md](../guides/ENV_LOCAL_SETUP.md)

### **Staging / QA**

- Use GitHub Secrets (staging variants)
- Run checklist in staging before production

### **Production**

- Use GitHub Secrets (production variants)
- Run full checklist before merge
- Plan rollback strategy

## See Also

- 📖 [Guides: How to configure each service](../guides/README.md)
- 📚 [Reference: Environment variables and secrets](../reference/README.md)
