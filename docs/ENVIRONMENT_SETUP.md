# 🔐 LuminAI Codex Environment Setup Guide

**Status**: Configuration Reference  
**Last Updated**: November 10, 2025  
**Scope**: Local development, CI/CD, and production configurations

---

## 📋 Overview

This guide consolidates all environment variables needed for:

- ✅ Local development (`.env.local`)
- ✅ GitHub Actions CI/CD (GitHub Secrets)
- ✅ GitHub App automation (TEC Resonance Automation)
- ✅ Bitwarden secrets management (BWS)
- ✅ External services (AI, APIs, third-party)

---

## 🚀 Quick Start

### **1. Create `.env.local` File**

```bash
cp .env.local.example .env.local
# Edit with YOUR actual values (never commit!)
```

### **2. Install Bitwarden CLI (Optional but Recommended)**

```bash
npm install -g @bitwarden/cli
# OR
brew install bitwarden-cli
```

### **3. Authenticate with Bitwarden**

```bash
bw login your-email@example.com
export BW_SESSION=$(bw unlock --raw)
```

---

## 🏗️ Environment Variables by Category

### **SECTION 1: Core Application**

```env
# Application Environment
ENVIRONMENT=development                    # development|staging|production
DEBUG=false                                 # true|false
NODE_ENV=development                       # development|production
LOG_LEVEL=debug                            # debug|info|warn|error

# Application URLs
APP_URL=http://localhost:3000
API_URL=http://localhost:8080
WEBHOOK_URL=https://yourdomain.com/webhooks
```

**Where to get**: Set locally as needed

---

### **SECTION 2: GitHub Integration**

#### **A. GitHub App Credentials (TEC Resonance Automation)**

```env
# GitHub App: TEC Resonance Automation
# App ID: 2186310
# Link: https://github.com/apps/tec-resonance-automation

GITHUB_APP_ID=2186310
GITHUB_APP_CLIENT_ID=Iv23liuCJbwDvim9WppS
GITHUB_APP_CLIENT_SECRET=<your-client-secret>          # ⚠️ Rotate every 6 months
GITHUB_APP_PRIVATE_KEY=<your-private-key.pem>          # Keep secure - never share
GITHUB_APP_WEBHOOK_SECRET=<32-char-random-secret>      # Generate: openssl rand -hex 16

# GitHub App Install ID (for your org)
GITHUB_APP_INSTALLATION_ID=<get-from-webhook>          # Auto-populated on first webhook
```

**How to get these**:

1. Go to: `https://github.com/organizations/TEC-The-ELidoras-Codex/settings/apps/tec-resonance-automation`
2. **Client Secret**: Click "Generate new client secret"
3. **Private Key**: Click "Generate a new private key" (download `.pem` file)
4. **Installation ID**: Check first webhook payload or run:

   ```bash
   curl -H "Authorization: Bearer YOUR_PAT" \
     https://api.github.com/app/installations
   ```

#### **B. GitHub Personal Access Tokens (PAT)**

```env
# GitHub Token - Project Automation (Fine-grained)
# Scope: TEC-The-ELidoras-Codex organization only
# Permissions: Read/Write repo, workflows, issues, PR
GITHUB_PROJECTS_TOKEN=ghp_...                          # Type: beta (Projects access)
GITHUB_PROJECTS_TOKEN_CLASSIC=ghp_...                  # Type: classic (fallback)
GITHUB_TOKEN=ghp_...                                   # General repo access

# GitHub Token Metadata
GITHUB_TOKEN_EXPIRES=2025-11-10
GITHUB_TOKEN_ROTATION_INTERVAL_DAYS=90
```

**How to get these**:

1. Personal Access Tokens: `https://github.com/settings/tokens?type=beta`
2. Click "Generate new token"
3. **Scopes needed**:
   - `repo` (full control)
   - `workflow` (GitHub Actions)
   - `project` (project automation)
   - `read:org` (read organization)
   - `admin:repo_hook` (webhooks)

#### **C. GitHub Organization Settings**

```env
# Organization
GITHUB_ORG=TEC-The-ELidoras-Codex
GITHUB_ORG_ID=<your-org-id>
GITHUB_REPO=luminai-codex
GITHUB_REPO_ID=<your-repo-id>

# Project Board
PROJECT_NUMBER=6
PROJECT_ID=<your-project-id>

# Branch Protection
DEFAULT_BRANCH=main
PROTECTED_BRANCHES=main,production,develop
```

**How to get**:

```bash
# Get org ID and repo ID
curl -H "Authorization: token YOUR_GITHUB_TOKEN" \
  https://api.github.com/orgs/TEC-The-ELidoras-Codex

curl -H "Authorization: token YOUR_GITHUB_TOKEN" \
  https://api.github.com/repos/TEC-The-ELidoras-Codex/luminai-codex
```

---

### **SECTION 3: Bitwarden Secrets Management**

#### **A. Bitwarden CLI Setup**

```env
# Bitwarden Access
BW_CLIENTID=<your-machine-account-client-id>
BW_CLIENTSECRET=<your-machine-account-secret>
BW_MASTER_PASSWORD=<your-master-password>              # ⚠️ Store in password manager
BW_SESSION=<auto-populated-by-login>
BW_VAULT_ID=<your-vault-id>

# Bitwarden Vault Organization
BW_ORG_ID=<TEC-organization-id>
BW_COLLECTION_IDS=brand,infrastructure,secrets
```

**How to set up**:

1. Create Machine Account (Bitwarden Admin):
   - Settings → Organizations → Members → Add Machine Account
2. Generate credentials and download `.bw` config
3. Create vault collection for LuminAI Codex secrets
4. Store in `.env.local`:

   ```bash
   export BW_CLIENTID="your-client-id"
   export BW_CLIENTSECRET="your-secret"
   bw login --apikey
   export BW_SESSION=$(bw unlock --raw)
   ```

#### **B. Using Bitwarden in CI/CD (GitHub Actions)**

```env
# GitHub Secrets → Store these
BW_CLIENTID=<your-machine-account-id>
BW_CLIENTSECRET=<your-machine-account-secret>

# GitHub Actions will use:
# bw login --apikey
# export BW_SESSION=$(bw unlock --raw)
# bw get item "<secret-name>"
```

**Recommended secrets to store in Bitwarden**:

- All API keys (OpenAI, Anthropic, xAI, etc.)
- Database passwords
- OAuth tokens
- Private keys
- Webhook secrets

---

### **SECTION 4: AI / ML Services**

```env
# OpenAI
OPENAI_API_KEY=sk-proj-...                             # Get: https://platform.openai.com/api-keys
OPENAI_ORG_ID=org-...                                  # Org ID (optional)
OPENAI_MODEL=gpt-4-turbo                               # Model to use
OPENAI_TIMEOUT=30000                                   # Timeout in ms

# Anthropic (Claude)
ANTHROPIC_API_KEY=sk-ant-...                           # Get: https://console.anthropic.com/keys
ANTHROPIC_MODEL=claude-3-opus                          # claude-3-opus|sonnet|haiku
ANTHROPIC_TIMEOUT=30000

# XAI (Grok)
XAI_API_KEY=xai-...                                    # Get: https://console.x.ai/keys
XAI_MODEL=grok-3                                       # Latest Grok model

# Azure OpenAI (if using)
AZURE_OPENAI_API_KEY=<your-azure-key>
AZURE_OPENAI_ENDPOINT=https://<resource>.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT=<deployment-name>

# Embedding Models
EMBEDDING_MODEL=text-embedding-3-small
EMBEDDING_API=openai|cohere|local

# Local LLM (if running Ollama/LM Studio)
LOCAL_LLM_URL=http://localhost:11434                   # Ollama default
LOCAL_LLM_MODEL=mistral:latest
```

**How to get**:

- **OpenAI**: <https://platform.openai.com/api-keys>
- **Anthropic**: <https://console.anthropic.com/keys>
- **XAI**: <https://console.x.ai/keys>

---

### **SECTION 5: TEC-Specific Services**

```env
# TEC Arcadia (Resonance Theory Engine)
TEC_ARCADIA_URL=http://localhost:8080/resonance
TEC_ARCADIA_API_KEY=<your-arcadia-key>
TEC_ARCADIA_TIMEOUT=5000

# TEC Infrastructure URLs
TEC_HUB_URL=https://hub.elidorascodex.com
TEC_LEXICON_URL=https://lexicon.elidorascodex.com
TEC_KNOWLEDGE_BASE=https://knowledge.elidorascodex.com

# TEC Authentication
TEC_AUTH_TOKEN=<your-tec-token>
TEC_ADMIN_KEY=<admin-access-key>
```

**Status**: Internal services - contact @Elidorascodex for setup

---

### **SECTION 6: Stable Diffusion / Image Generation**

```env
# Stable Diffusion API
SD_API_URL=http://127.0.0.1:7860                      # Local instance default
SD_API_KEY=<your-sd-api-key>                           # If using remote/secured API
SD_MODEL=sd-3-large                                    # Model to use
SD_SAMPLER=DPM++ 2M Karras                             # Sampler method

# Image Generation Settings
SD_STEPS=30                                             # Default steps
SD_GUIDANCE_SCALE=7.5                                  # Guidance scale
SD_NEGATIVE_PROMPT="low quality, blurry"
SD_OUTPUT_DIR=./generated-images

# Running Stable Diffusion Locally
# Docker: docker run --gpus all -p 7860:7860 ghcr.io/automatic1111/stable-diffusion-webui
```

---

### **SECTION 7: Database & Storage**

```env
# PostgreSQL
DATABASE_URL=postgresql://user:password@localhost:5432/luminai_codex
DB_HOST=localhost
DB_PORT=5432
DB_USER=<your-username>
DB_PASSWORD=<your-password>
DB_NAME=luminai_codex

# Azure Cosmos DB (if using)
COSMOS_DB_CONNECTION_STRING=<your-cosmos-connection>
COSMOS_DB_KEY=<your-cosmos-key>

# Redis (for caching)
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=<your-redis-password>

# S3 / Object Storage
AWS_ACCESS_KEY_ID=<your-key>
AWS_SECRET_ACCESS_KEY=<your-secret>
AWS_REGION=us-east-1
S3_BUCKET=luminai-codex-assets
```

---

### **SECTION 8: Third-Party APIs**

```env
# Spotify (Music/Audio)
SPOTIFY_CLIENT_ID=<your-client-id>
SPOTIFY_CLIENT_SECRET=<your-client-secret>
SPOTIFY_REDIRECT_URI=http://localhost:3000/auth/spotify

# World Anvil (World Building)
WORLDANVIL_API_KEY=<your-api-key>
WORLDANVIL_CAMPAIGN_ID=<your-campaign>

# Discord (Notifications/Chat)
DISCORD_BOT_TOKEN=<your-bot-token>
DISCORD_GUILD_ID=<your-guild-id>
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...

# Slack (Notifications)
SLACK_BOT_TOKEN=xoxb-...
SLACK_SIGNING_SECRET=<your-signing-secret>
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
```

---

### **SECTION 9: Bitwarden Secrets (BWS)**

```env
# Bitwarden Secrets Manager Access
BWS_ACCESS_TOKEN=bws_...                               # Machine account token
BWS_SERVER_URL=https://api.bitwarden.com               # Default Bitwarden Cloud

# Or use Bitwarden CLI instead:
# bw get item "<secret-name>"
# bw get folder "<folder-name>"
```

**Common Bitwarden CLI commands**:

```bash
# Login and unlock
bw login your-email@example.com
export BW_SESSION=$(bw unlock --raw)

# Get secrets
bw get item "OpenAI API Key"
bw get folder "LuminAI Secrets"

# List all items
bw list items

# Sync vault
bw sync
```

---

### **SECTION 10: CI/CD & Deployment**

```env
# GitHub Actions
CI_REGISTRY=ghcr.io
CI_REGISTRY_IMAGE=ghcr.io/tec-the-elidoras-codex/luminai-codex

# Docker
DOCKER_REGISTRY=ghcr.io
DOCKER_USERNAME=<your-github-username>
DOCKER_PASSWORD=<github-token-with-packages-scope>

# AWS Deployment
AWS_DEPLOYMENT_ROLE_ARN=arn:aws:iam::...
AWS_ECR_REPOSITORY=luminai-codex
AWS_ECS_CLUSTER=TEC-ELidoras

# Azure Deployment
AZURE_RESOURCE_GROUP=tec-resources
AZURE_REGISTRY_LOGIN_SERVER=...
AZURE_REGISTRY_USERNAME=...
AZURE_REGISTRY_PASSWORD=...

# Environment-Specific
PRODUCTION_DOMAIN=luminaicodex.com
STAGING_DOMAIN=staging.luminaicodex.com
```

---

### **SECTION 11: Security & Compliance**

```env
# API Security
API_RATE_LIMIT=100                                      # Requests per minute
API_TIMEOUT=30000                                       # Timeout in ms
CORS_ORIGINS=http://localhost:3000,https://luminaicodex.com
SESSION_SECRET=<32-char-random>                        # Generate: openssl rand -base64 32

# JWT / Authentication
JWT_SECRET=<your-jwt-secret>                           # Generate: openssl rand -hex 32
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=<your-refresh-secret>

# Encryption
ENCRYPTION_KEY=<your-encryption-key>                   # 32-byte hex for AES-256
ENCRYPTION_ALGORITHM=aes-256-gcm

# SSL/TLS
SSL_CERT_PATH=/path/to/cert.pem
SSL_KEY_PATH=/path/to/key.pem
```

---

### **SECTION 12: WordPress.com (if used)**

```env
# WordPress.com Integration
TEC_WPCOM_API_PASS=<your-wordpress-password>
WPCOM_SSH_USER=<your-wordpress-username>
WPCOM_SSH_KEY=~/.ssh/wpcom_rsa
WPCOM_SITE_ID=<your-site-id>
```

---

## 📋 Complete `.env.local` Template

```env
# .env.local - LOCAL DEVELOPMENT ONLY
# Never commit this file!
# Copy real values from Bitwarden or GitHub Secrets

# ===== CORE =====
ENVIRONMENT=development
DEBUG=false
NODE_ENV=development
LOG_LEVEL=debug

# ===== GITHUB APP =====
GITHUB_APP_ID=2186310
GITHUB_APP_CLIENT_ID=Iv23liuCJbwDvim9WppS
GITHUB_APP_CLIENT_SECRET=<get-from-github>
GITHUB_APP_PRIVATE_KEY=<get-from-github>
GITHUB_APP_WEBHOOK_SECRET=<generate-new>
GITHUB_APP_INSTALLATION_ID=<auto-populated>

GITHUB_ORG=TEC-The-ELidoras-Codex
GITHUB_REPO=luminai-codex
GITHUB_PROJECTS_TOKEN=<your-pat>
PROJECT_NUMBER=6

# ===== BITWARDEN =====
BW_CLIENTID=<your-client-id>
BW_CLIENTSECRET=<your-client-secret>

# ===== AI / ML =====
OPENAI_API_KEY=sk-proj-...
OPENAI_ORG_ID=org-...
ANTHROPIC_API_KEY=sk-ant-...
XAI_API_KEY=xai-...

# ===== TEC SERVICES =====
TEC_ARCADIA_URL=http://localhost:8080/resonance
TEC_ARCADIA_API_KEY=<your-key>

# ===== IMAGE GENERATION =====
SD_API_URL=http://127.0.0.1:7860
SD_API_KEY=<if-secured>

# ===== DATABASE =====
DATABASE_URL=postgresql://user:password@localhost:5432/luminai_codex

# ===== THIRD-PARTY =====
SPOTIFY_CLIENT_ID=<your-id>
SPOTIFY_CLIENT_SECRET=<your-secret>
WORLDANVIL_API_KEY=<your-key>

# ===== SECURITY =====
API_RATE_LIMIT=100
SESSION_SECRET=<generate-new>
JWT_SECRET=<generate-new>
ENCRYPTION_KEY=<generate-new>
```

---

## 🔄 Token Rotation & Security

### **Rotation Schedule**

```
Every 90 Days:
  - GitHub Personal Access Tokens (PAT)
  - Bitwarden Machine Account credentials
  - API keys for third-party services

Every 6 Months:
  - GitHub App Client Secret
  - Encryption keys

Immediately:
  - Any exposed or compromised credentials
  - JWT secrets if suspected breach
  - Database passwords after access changes
```

### **Rotation Process**

```bash
# 1. Generate new secret
NEW_SECRET=$(openssl rand -hex 32)

# 2. Update in Bitwarden
bw login --apikey
bw edit item "<secret-name>"  # Update value to NEW_SECRET

# 3. Update GitHub Secrets
gh secret set SECRET_NAME -b "$NEW_SECRET"

# 4. Update .env.local locally
echo "SECRET_NAME=$NEW_SECRET" >> .env.local

# 5. Commit (but NOT the secret!)
git add -A
git commit -m "🔐 Rotate secrets (non-sensitive tracking)"

# 6. Delete old secret from service
# (e.g., GitHub app console, API dashboard, etc.)
```

---

## ✅ Setup Checklist

### **Initial Setup (First Time)**

- [ ] Create `.env.local` from template above
- [ ] Set up Bitwarden account (if not done)
- [ ] Create machine account in Bitwarden
- [ ] Create GitHub App "TEC Resonance Automation"
- [ ] Generate GitHub App private key and client secret
- [ ] Get API keys for all services (OpenAI, Anthropic, XAI)
- [ ] Set up GitHub Secrets in organization settings
- [ ] Configure GitHub branch protection rules
- [ ] Set up webhook URL for GitHub App

### **Local Development**

- [ ] Copy `.env.local.example` → `.env.local`
- [ ] Fill in actual values from Bitwarden/password manager
- [ ] Run `npm install` and start dev server
- [ ] Test GitHub App webhook connectivity
- [ ] Verify API keys work (test calls to each service)

### **CI/CD Setup (GitHub Actions)**

- [ ] Add all secrets to GitHub organization secrets
- [ ] Set up GitHub Actions workflows
- [ ] Test webhook triggers and automation
- [ ] Verify logging and error handling

### **Production Deployment**

- [ ] Rotate all credentials before going live
- [ ] Enable IP allowlisting on GitHub App
- [ ] Set up monitoring and alerts
- [ ] Document secret management process
- [ ] Brief team on rotation schedule

---

## 🆘 Troubleshooting

### **Issue: "Invalid GitHub App credentials"**

```bash
# Check if private key is properly formatted
cat your-private-key.pem | head -3
# Should start with: -----BEGIN RSA PRIVATE KEY-----

# Verify app is installed on organization
curl -H "Authorization: token YOUR_GITHUB_TOKEN" \
  https://api.github.com/app/installations
```

### **Issue: "Bitwarden session expired"**

```bash
# Re-authenticate and get new session
export BW_SESSION=$(bw unlock --raw)

# Or use API key authentication
bw login --apikey
```

### **Issue: "API rate limit exceeded"**

```bash
# Check current rate limit
curl -H "Authorization: token YOUR_GITHUB_TOKEN" \
  https://api.github.com/rate_limit

# Wait for reset or upgrade to higher tier
```

---

## 📚 References

- **GitHub Apps**: <https://docs.github.com/en/developers/apps>
- **Personal Access Tokens**: <https://github.com/settings/tokens>
- **Bitwarden CLI**: <https://bitwarden.com/help/cli/>
- **OpenAI API**: <https://platform.openai.com/docs>
- **Anthropic API**: <https://docs.anthropic.com>
- **XAI API**: <https://docs.x.ai>

---

**Status**: ✅ **Complete Configuration Reference**

**Ownership**: @Elidorascodex (Infrastructure Team)

**Last Reviewed**: November 10, 2025
