# LuminAI Codex — Unified Guides & Quickstarts Inventory

**Last Updated**: November 14, 2025  
**Purpose**: Consolidated index of all getting-started guides, quickstarts, and how-tos

---

## 📚 GUIDE CATEGORIES

This inventory organizes all guides by purpose, eliminating duplication and providing clear navigation paths.

---

## 🚀 QUICK STARTS (Getting Started Fast)

**Purpose**: 5-15 minute guides to get specific features running immediately

### Platform Quick Starts

1. **GETTING_STARTED.md** (root)
   - **Purpose**: First-time local setup (Python + Node.js environment)
   - **Audience**: New contributors
   - **Duration**: 10-15 minutes
   - **Covers**: Clone repo → install deps → copy secrets → run demo
   - **Status**: ✅ Complete and current

2. **MULTI_LLM_QUICK_START.md** (root)
   - **Purpose**: Configure OpenAI, Anthropic, xAI API keys
   - **Audience**: Users testing multi-provider resonance
   - **Duration**: 5 minutes
   - **Covers**: `.env.local` setup → test 3 providers → verify responses
   - **Status**: ✅ Complete
   - **Related**: `docs/reference/MULTI_LLM_SETUP.md` (detailed version)

3. **WEBHOOK_QUICK_START.md** (root)
   - **Purpose**: Enable GitHub App webhook notifications
   - **Audience**: Developers adding webhook integrations
   - **Duration**: 10 minutes
   - **Covers**: GitHub App → create webhook → test locally with ngrok
   - **Status**: ✅ Complete
   - **Related**: `WEBHOOK_IMPLEMENTATION_COMPLETE.md` (technical summary)

4. **docs/operations/QUICKSTART.md**
   - **Purpose**: Run the modular JS demo (Harmony + Resonance + Codex + Arcadia)
   - **Audience**: Backend developers
   - **Duration**: 5 minutes
   - **Covers**: `node bootstrap.js` → test endpoints → verify module startup
   - **Status**: ✅ Complete

5. **docs/deployment/guides/GITHUB_APP_QUICK_START.md**
   - **Purpose**: Set up GitHub App for Arcadia Portal
   - **Audience**: Deployment engineers
   - **Duration**: 15 minutes
   - **Covers**: GitHub App creation → permissions → private key → webhook URL
   - **Status**: ✅ Complete
   - **Related**: `docs/deployment/guides/GITHUB_APP_SETUP.md` (detailed)

### Asset Quick Starts

6. **assets/logo/QUICK_CONVERSION_GUIDE.md**
   - **Purpose**: Convert logo between formats (SVG → PNG → ICO)
   - **Audience**: Design team, brand managers
   - **Duration**: 5 minutes
   - **Covers**: ImageMagick commands → favicon generation → optimization
   - **Status**: ✅ Complete

---

## 📖 IMPLEMENTATION GUIDES (Step-by-Step)

**Purpose**: Comprehensive walkthroughs for building/modifying platform features

### Core Framework

1. **docs/framework/IMPLEMENTATION_GUIDE.md**
   - **Title**: Cute Modular Architecture Implementation Guide
   - **Purpose**: Build new modules using the CuteModule + HarmonyNode pattern
   - **Audience**: Backend engineers adding modules
   - **Sections**:
     - Architecture overview (module.js, harmony.js)
     - Step-by-step module creation
     - Endpoint registration
     - Event bus communication
     - Testing & validation
   - **Status**: ✅ Complete
   - **Example Code**: Includes full ResonanceEngine module walkthrough

2. **docs/operations/BUILD_YOUR_OWN_GUIDE.md**
   - **Purpose**: Fork and customize LuminAI Codex for your own use case
   - **Audience**: External developers building on top of the platform
   - **Sections**:
     - Forking workflow
     - Customizing personas
     - Swapping LLM providers
     - Deploying to your infrastructure
   - **Status**: ✅ Complete

3. **docs/framework/GPT_CONFIGURATION_GUIDE.md**
   - **Purpose**: Configure custom GPTs using LuminAI personas
   - **Audience**: ChatGPT Plus users, OpenAI API developers
   - **Sections**:
     - Custom GPT creation
     - Persona instructions (16_REF_PERSONA_REGISTRY.md)
     - Action endpoints (if using API)
   - **Status**: ⚠️ Needs update (post-persona consolidation Nov 12-13)

### Operations

4. **docs/operations/MASTER_OPERATIONS_GUIDE.md**
   - **Purpose**: Day-to-day operations handbook (logging, monitoring, debugging)
   - **Audience**: Platform operators, SREs
   - **Sections**:
     - Health checks (`/health`, `/api/health`)
     - Log locations (`docs/resonance-logs/`)
     - Metrics collection (Harmony system status)
     - Common troubleshooting (module failures, API timeouts)
   - **Status**: ✅ Complete

---

## 🛠️ DEPLOYMENT GUIDES

**Purpose**: Production deployment instructions for various platforms

### Environment Setup

1. **docs/deployment/ENV_LOCAL_SETUP.md** (canonical)
   - **Purpose**: Set up local `.env.local` for development
   - **Audience**: All developers
   - **Covers**: Copy secrets → fill placeholders → validate with `check_env.py`
   - **Status**: ✅ Complete
   - **Note**: Consolidates old `docs/ENV_LOCAL_SETUP.md` + `docs/ENVIRONMENT_SETUP.md`

2. **docs/deployment/GITHUB_SECRETS_SETUP.md**
   - **Purpose**: Configure GitHub Actions secrets for CI/CD
   - **Audience**: DevOps, deployment engineers
   - **Covers**: Which secrets to add → where to find values → rotation schedule
   - **Status**: ✅ Complete

3. **docs/deployment/reference/SECRETS_DEPLOYMENT_GUIDE.md**
   - **Purpose**: Best practices for secret management (Bitwarden, 1Password, AWS Secrets Manager)
   - **Audience**: Security engineers
   - **Covers**: Secret rotation → access control → audit logging
   - **Status**: ✅ Complete

### Platform-Specific Deployment

4. **docs/deployment/ARCHITECTURE_QUICK_REFERENCE.md**
   - **Purpose**: High-level architecture diagram + deployment options
   - **Audience**: Architects, technical leads
   - **Covers**: System components → cloud providers (AWS, Azure, GCP) → scaling strategy
   - **Status**: ✅ Complete

5. **docs/deployment/RESONANCE_PLATFORM_DEV_STARTUP.md**
   - **Purpose**: Developer startup checklist (local → staging → production)
   - **Audience**: New team members
   - **Covers**: Environment setup → first deployment → validation tests
   - **Status**: ⚠️ Verify currency (last updated?)

### Workflows & CI/CD

6. **docs/deployment/guides/WORKFLOWS_SECRETS_GUIDE.md**
   - **Purpose**: Map GitHub Actions workflows to required secrets
   - **Audience**: CI/CD maintainers
   - **Covers**: Which workflow uses which secret → troubleshooting failures
   - **Status**: ✅ Complete

---

## 🧪 TESTING GUIDES

1. **docs/deployment/backend/10_TECH_TESTING_GUIDE.md**
   - **Purpose**: Backend testing strategy (pytest, test data, fixtures)
   - **Audience**: Backend developers
   - **Covers**: Running tests → writing new tests → coverage reports
   - **Status**: ✅ Complete

---

## 🎨 DESIGN GUIDES

1. **assets/logo/DISCORD_BRANDING_GUIDE.md**
   - **Purpose**: Discord bot branding (avatar, banner, server icons)
   - **Audience**: Community managers
   - **Covers**: Logo sizing → color restrictions → animated icons
   - **Status**: ✅ Complete

---

## 📋 REFERENCE DOCUMENTATION (Not Guides, but Referenced Often)

These are **reference specs**, not step-by-step guides, but frequently linked from guides:

1. **docs/reference/QUICK_REFERENCE_READY.md**
   - **Purpose**: API endpoints, module list, CLI commands cheat sheet
   - **Type**: Reference card

2. **docs/reference/MULTI_LLM_SETUP.md**
   - **Purpose**: Detailed multi-provider configuration (extends MULTI_LLM_QUICK_START.md)
   - **Type**: Technical reference

3. **docs/architecture/RESONANCE_IMPLEMENTATION_MAP.md**
   - **Purpose**: Visual map of all modules, dependencies, and data flows
   - **Type**: Architecture diagram

4. **RESONANCE_PLATFORM_README.md** (root)
   - **Purpose**: Platform overview + feature list
   - **Type**: Marketing + technical intro

---

## 🗺️ GUIDE NAVIGATION MAP

**If you want to...**

### Get Started Immediately

→ **GETTING_STARTED.md** (root)  
→ **MULTI_LLM_QUICK_START.md** (if adding LLM keys)  
→ **docs/operations/QUICKSTART.md** (if running JS modules)

### Build a New Feature

→ **docs/framework/IMPLEMENTATION_GUIDE.md** (backend modules)  
→ **docs/operations/BUILD_YOUR_OWN_GUIDE.md** (fork + customize)

### Deploy to Production

→ **docs/deployment/ENV_LOCAL_SETUP.md** (environment variables)  
→ **docs/deployment/GITHUB_SECRETS_SETUP.md** (CI/CD secrets)  
→ **docs/deployment/ARCHITECTURE_QUICK_REFERENCE.md** (cloud options)

### Integrate with External Services

→ **WEBHOOK_QUICK_START.md** (GitHub App webhooks)  
→ **docs/deployment/guides/GITHUB_APP_QUICK_START.md** (detailed setup)

### Customize the Brand

→ **assets/logo/QUICK_CONVERSION_GUIDE.md** (logo formats)  
→ **assets/logo/DISCORD_BRANDING_GUIDE.md** (Discord bot)  
→ **ASSET_INVENTORY.md** (all brand assets)

### Test Your Changes

→ **docs/deployment/backend/10_TECH_TESTING_GUIDE.md** (backend tests)  
→ **UNIFIED_IMPLEMENTATION_CHECKLIST.md** (integration test checklist)

### Understand the Architecture

→ **docs/architecture/RESONANCE_IMPLEMENTATION_MAP.md** (module map)  
→ **docs/reference/QUICK_REFERENCE_READY.md** (API cheat sheet)  
→ **RESONANCE_PLATFORM_README.md** (feature overview)

### Operate the Platform

→ **docs/operations/MASTER_OPERATIONS_GUIDE.md** (monitoring, debugging)  
→ **docs/operations/TEC_HUB.md** (operations navigation hub)

---

## 🧹 REDUNDANCY AUDIT RESULTS

**Duplicates Found** (from CODEBASE_AUDIT_AND_CONSOLIDATION_PLAN.md):

### Deleted (Duplicates)

- ❌ `docs/ENV_LOCAL_SETUP.md` → Use `docs/deployment/ENV_LOCAL_SETUP.md`
- ❌ `docs/ENVIRONMENT_SETUP.md` → Use `docs/deployment/ENV_LOCAL_SETUP.md`
- ❌ `docs/GITHUB_APP_SETUP.md` → Use `docs/deployment/guides/GITHUB_APP_SETUP.md`

### Kept (Canonical Versions)

- ✅ `docs/deployment/ENV_LOCAL_SETUP.md` (environment setup)
- ✅ `docs/deployment/guides/GITHUB_APP_SETUP.md` (detailed GitHub App)
- ✅ `docs/deployment/guides/GITHUB_APP_QUICK_START.md` (summary version)

---

## 📊 GUIDE MATURITY LEVELS

**Complete (✅)**: Ready for use, no known issues

- GETTING_STARTED.md
- MULTI_LLM_QUICK_START.md
- WEBHOOK_QUICK_START.md
- docs/operations/QUICKSTART.md
- docs/framework/IMPLEMENTATION_GUIDE.md
- docs/operations/BUILD_YOUR_OWN_GUIDE.md
- docs/operations/MASTER_OPERATIONS_GUIDE.md
- docs/deployment/ENV_LOCAL_SETUP.md
- docs/deployment/GITHUB_SECRETS_SETUP.md
- docs/deployment/ARCHITECTURE_QUICK_REFERENCE.md
- docs/deployment/guides/WORKFLOWS_SECRETS_GUIDE.md
- docs/deployment/backend/10_TECH_TESTING_GUIDE.md
- assets/logo/QUICK_CONVERSION_GUIDE.md
- assets/logo/DISCORD_BRANDING_GUIDE.md

**Needs Update (⚠️)**:

- docs/framework/GPT_CONFIGURATION_GUIDE.md (post-persona consolidation)
- docs/deployment/RESONANCE_PLATFORM_DEV_STARTUP.md (verify currency)

**Planned (🚧)**:

- Frontend component guide (React + Next.js 15 patterns)
- ConsentOS integration guide (emoji parsing in UI)
- Resonance Map visualization guide

---

## 🎯 QUICK START DECISION TREE

**START HERE**:

1. **Are you new to the project?**
   - Yes → **GETTING_STARTED.md**
   - No → Go to step 2

2. **Do you need to add API keys?**
   - Yes → **MULTI_LLM_QUICK_START.md**
   - No → Go to step 3

3. **Are you deploying to production?**
   - Yes → **docs/deployment/** (ENV_LOCAL_SETUP → GITHUB_SECRETS_SETUP)
   - No → Go to step 4

4. **Are you building a new feature?**
   - Backend module → **docs/framework/IMPLEMENTATION_GUIDE.md**
   - Frontend component → (Guide needed, see UNIFIED_IMPLEMENTATION_CHECKLIST.md)
   - Integration → **WEBHOOK_QUICK_START.md** or **docs/deployment/guides/**

5. **Are you troubleshooting?**
   - Logs → **docs/operations/MASTER_OPERATIONS_GUIDE.md**
   - Tests → **docs/deployment/backend/10_TECH_TESTING_GUIDE.md**
   - Environment → **docs/deployment/ENV_LOCAL_SETUP.md**

---

## 📝 MAINTENANCE SCHEDULE

**Monthly**:

- [ ] Verify all quick starts still work (test on fresh clone)
- [ ] Update screenshots if UI changed
- [ ] Check for dead links in guides

**Quarterly**:

- [ ] Review maturity levels (promote ⚠️ to ✅ if updated)
- [ ] Archive outdated guides to `docs/archive/`
- [ ] Consolidate new guides into this inventory

**After Major Releases**:

- [ ] Update GETTING_STARTED.md with new features
- [ ] Refresh deployment guides if infrastructure changed
- [ ] Update QUICK_REFERENCE_READY.md with new API endpoints

---

## 🔗 RELATED INVENTORIES

- **ASSET_INVENTORY.md** (logos, icons, backgrounds, design tokens)
- **UNIFIED_IMPLEMENTATION_CHECKLIST.md** (development tasks)
- **docs/STRUCTURE.md** (documentation map)
- **docs/operations/TEC_HUB.md** (navigation hub)

---

**Next Steps**:

1. Update GPT_CONFIGURATION_GUIDE.md with Nov 12-13 persona changes
2. Create frontend component implementation guide
3. Verify RESONANCE_PLATFORM_DEV_STARTUP.md currency
4. Archive deleted duplicate guides per CODEBASE_AUDIT_AND_CONSOLIDATION_PLAN.md

💚 Single source of truth for all "how to get started" questions.
