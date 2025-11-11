# ✅ .env.local Configuration Checklist (SANITIZED)

This file used to contain live API keys. Those keys have been redacted from the repository history.

When preparing `.env.local` for deployments or CI, use the repository secrets or your local secure vault. Never commit secrets.

Example placeholders (replace locally / via secrets manager):

```env
OPENAI_API_KEY=<REDACTED_OPENAI_API_KEY>
OPENAI_ORG_ID=<REDACTED_OPENAI_ORG_ID>
ANTHROPIC_API_KEY=<REDACTED_ANTHROPIC_API_KEY>
XAI_API_KEY=<REDACTED_XAI_API_KEY>
```

Add secrets to GitHub Actions as repository secrets (see docs/deployment/GITHUB_SECRETS_SETUP.md).
# ✅ .env.local Configuration Checklist

**Purpose**: Complete guide for setting up local development environment  
**Last Updated**: November 10, 2025  
**Status**: Ready to implement

---

## 🎯 What You Have vs. What You Need

### **✅ ALREADY CONFIGURED**

```env
# ✅ AI Services (CONFIGURED)
OPENAI_API_KEY=<REDACTED_OPENAI_API_KEY>
OPENAI_ORG_ID=<REDACTED_OPENAI_ORG_ID>
ANTHROPIC_API_KEY=<REDACTED_ANTHROPIC_API_KEY>
XAI_API_KEY=<REDACTED_XAI_API_KEY>

# ✅ GitHub Projects (CONFIGURED)
PROJECTS_TOKEN=ghp_...your-token...
PROJECT_NUMBER=6

# ✅ Other Services (CONFIGURED)
SPOTIFY_CLIENT_ID=your-client-id
SPOTIFY_CLIENT_SECRET=your-client-secret
WORLDANVIL_API_KEY=your-key

# ✅ Local Services (CONFIGURED)
TEC_ARCADIA_URL=http://localhost:8080/resonance
SD_API_URL=http://127.0.0.1:7860
SD_API_KEY=

# ✅ WordPress (CONFIGURED)
TEC_WPCOM_API_PASS=your-pass
WPCOM_SSH_USER=your-wpcom-site
```

### **❌ NEEDS TO BE ADDED**

```env
# ❌ GitHub App Configuration (MISSING)
GITHUB_APP_ID=2186310
GITHUB_APP_CLIENT_ID=Iv23liuCJbwDvim9WppS
GITHUB_APP_CLIENT_SECRET=<GENERATE NEW>
GITHUB_APP_PRIVATE_KEY=<DOWNLOAD FROM GITHUB>
GITHUB_APP_WEBHOOK_SECRET=<GENERATE NEW>
GITHUB_APP_INSTALLATION_ID=<AUTO-POPULATED>

# ❌ Bitwarden Secrets (MISSING)
BWS_ACCESS_TOKEN=bws_<YOUR-TOKEN>
BW_CLIENTID=<YOUR-CLIENT-ID>
BW_CLIENTSECRET=<YOUR-CLIENT-SECRET>

# ❌ Security & JWT (MISSING)
SESSION_SECRET=<GENERATE NEW>
JWT_SECRET=<GENERATE NEW>
API_RATE_LIMIT=100

# ❌ Database (MISSING)
DATABASE_URL=postgresql://user:password@localhost:5432/luminai_codex

# ❌ Discord (RECOMMENDED)
DISCORD_BOT_TOKEN=<GENERATE_FROM_DISCORD_PORTAL>

# ⚠️ Slack (OPTIONAL - skip unless needed)
# SLACK_BOT_TOKEN=<ONLY_IF_USING>
```

---

## 🔐 Step-by-Step: Add Missing Variables

### **Step 1️⃣: GitHub App Credentials**

#### **1A. Get Client Secret**

```bash
# Location: GitHub App settings
# https://github.com/organizations/TEC-The-ELidoras-Codex/settings/apps/tec-resonance-automation

# Click "Generate new client secret"
# Copy the full secret (e.g., ghp_...e8f40935)

# Add to .env.local:
GITHUB_APP_CLIENT_SECRET=ghp_...e8f40935
```

#### **1B. Get Private Key**

```bash
# In GitHub App settings, click "Generate a new private key"
# This downloads a file like: tec-resonance-automation.2024-11-10.private-key.pem

# Copy contents and add to .env.local:
GITHUB_APP_PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEA...
[rest of key]
-----END RSA PRIVATE KEY-----

# OR use multiline in .env.local:
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nMIIEowI...\n-----END RSA PRIVATE KEY-----"
```

#### **1C. Generate Webhook Secret**

```bash
# Generate strong random secret
WEBHOOK_SECRET=$(openssl rand -hex 32)
echo "Use this: $WEBHOOK_SECRET"

# Add to .env.local:
GITHUB_APP_WEBHOOK_SECRET=<output-from-above>

# Example output: abc123def456abc123def456abc123de
```

---

### **Step 2️⃣: Bitwarden Secrets (BWS)**

#### **2A. Create Machine Account in Bitwarden**

```bash
# 1. Log in to Bitwarden Admin Console
# 2. Go to: Organization Settings → Machine Accounts
# 3. Click "+ Create" → "Create Machine Account"
# 4. Name: "LuminAI Codex CI/CD"
# 5. Download credentials (`.bw` config file)
```

#### **2B. Extract Credentials**

```bash
# From downloaded .bw file, extract:
BW_CLIENTID="your-client-id"
BW_CLIENTSECRET="your-client-secret"

# For Bitwarden Secrets Manager:
BWS_ACCESS_TOKEN="bws_..." # If using BWS instead of CLI

# Add to .env.local:
BW_CLIENTID=<from-config>
BW_CLIENTSECRET=<from-config>
```

#### **2C. Test Bitwarden Connection**

```bash
# Add to .env.local and test:
export BW_CLIENTID="your-id"
export BW_CLIENTSECRET="your-secret"

# Try login
bw login --apikey

# Get session
export BW_SESSION=$(bw unlock --raw)

# List items
bw list items --search "OpenAI"
```

---

### **Step 3️⃣: Security Secrets**

#### **3A. Generate Session Secret**

```bash
# Generate random session secret
SESSION_SECRET=$(openssl rand -base64 32)
echo "Session Secret: $SESSION_SECRET"

# Add to .env.local:
SESSION_SECRET=<output-from-above>
```

#### **3B. Generate JWT Secret**

```bash
# Generate random JWT secret
JWT_SECRET=$(openssl rand -hex 32)
echo "JWT Secret: $JWT_SECRET"

# Add to .env.local:
JWT_SECRET=<output-from-above>
```

#### **3C. Add Rate Limiting**

```env
# .env.local
API_RATE_LIMIT=100              # Requests per minute
API_TIMEOUT=30000               # Timeout in ms
```

---

### **Step 4️⃣: Database (Optional but Recommended)**

```bash
# If using PostgreSQL locally:
# 1. Install PostgreSQL
# 2. Create database

psql -U postgres
create database luminai_codex;
create user luminai with password 'your-secure-password';
grant all privileges on database luminai_codex to luminai;

# Add to .env.local:
DATABASE_URL=postgresql://luminai:your-secure-password@localhost:5432/luminai_codex
```

---

### **Step 5️⃣: Communication Services**

#### **5A. Discord Bot (✅ Recommended for LuminAI)**

```bash
# 1. Go to: https://discord.com/developers/applications
# 2. Select "LuminAI_Codex" bot
# 3. Go to "Bot" section
# 4. Click "Reset Token" to get a new one (view once!)
# 5. Copy the full token immediately

# 6. Enable Intents (in Discord Portal):
#    ✅ Presence Intent
#    ✅ Server Members Intent
#    ✅ Message Content Intent

# Add to .env.local:
DISCORD_BOT_TOKEN=MzA0YOUR_FULL_TOKEN_HERE
DISCORD_GUILD_ID=your-discord-server-id        # (optional)
```

#### **5B. Slack Bot (❌ Skip for Now - Optional Only)**

```env
# ONLY add if you want Slack notifications later
# For now, leave commented out

# SLACK_BOT_TOKEN=xoxb-...
# SLACK_SIGNING_SECRET=abc123def456
```

#### **5C. Invite Discord Bot to Your Server**

```bash
# In Discord Developer Portal:
# OAuth2 → URL Generator
# Scopes: ✅ bot
# Permissions:
#   ✅ Send Messages
#   ✅ Embed Links
#   ✅ Attach Files
#   ✅ Read Message History
#   ✅ Use Slash Commands

# Copy generated URL and open to invite bot
```

---

## 📋 Complete Updated `.env.local` Template

```env
# .env.local - LOCAL DEVELOPMENT ONLY
# ⚠️ NEVER COMMIT THIS FILE
# Copy real values from Bitwarden or GitHub Secrets

# ===== CORE =====
ENVIRONMENT=development
DEBUG=false
NODE_ENV=development
LOG_LEVEL=debug

# ===== GITHUB APP (TEC Resonance Automation) =====
GITHUB_APP_ID=2186310
GITHUB_APP_CLIENT_ID=Iv23liuCJbwDvim9WppS
GITHUB_APP_CLIENT_SECRET=ghp_<generated-secret>
GITHUB_APP_PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----
GITHUB_APP_WEBHOOK_SECRET=<generated-webhook-secret>
GITHUB_APP_INSTALLATION_ID=auto-populated-from-webhook

# ===== GITHUB TOKENS =====
GITHUB_ORG=TEC-The-ELidoras-Codex
GITHUB_REPO=luminai-codex
GITHUB_TOKEN=ghp_<your-pat>
GITHUB_PROJECTS_TOKEN=ghp_<your-projects-pat>
PROJECT_NUMBER=13

# ===== BITWARDEN SECRETS =====
BW_CLIENTID=<your-client-id>
BW_CLIENTSECRET=<your-client-secret>
BWS_ACCESS_TOKEN=bws_<your-token>

# ===== AI / ML SERVICES =====
OPENAI_API_KEY=sk-proj-...
OPENAI_ORG_ID=org-...
OPENAI_MODEL=gpt-4-turbo
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-3-opus
XAI_API_KEY=xai-...

# ===== TEC SERVICES =====
TEC_ARCADIA_URL=http://localhost:8080/resonance
TEC_ARCADIA_API_KEY=<your-key>

# ===== IMAGE GENERATION =====
SD_API_URL=http://127.0.0.1:7860
SD_API_KEY=

# ===== DATABASE =====
DATABASE_URL=postgresql://luminai:password@localhost:5432/luminai_codex
DB_HOST=localhost
DB_PORT=5432
DB_USER=luminai
DB_NAME=luminai_codex

# ===== SECURITY =====
SESSION_SECRET=<generated-session-secret>
JWT_SECRET=<generated-jwt-secret>
API_RATE_LIMIT=100
API_TIMEOUT=30000
CORS_ORIGINS=http://localhost:3000,http://localhost:8080

# ===== THIRD-PARTY SERVICES =====
SPOTIFY_CLIENT_ID=<your-id>
SPOTIFY_CLIENT_SECRET=<your-secret>
WORLDANVIL_API_KEY=<your-key>
DISCORD_BOT_TOKEN=<if-using>

# ===== WORDPRESS.COM =====
TEC_WPCOM_API_PASS=<your-pass>
WPCOM_SSH_USER=<your-user>
```

---

## ✅ Configuration Checklist

### **Immediate (This Week)**

- [ ] Generate GitHub App Client Secret
- [ ] Generate GitHub App Private Key (save securely)
- [ ] Generate Webhook Secret
- [ ] Create Bitwarden Machine Account
- [ ] Get BW_CLIENTID and BW_CLIENTSECRET
- [ ] Generate SESSION_SECRET
- [ ] Generate JWT_SECRET
- [ ] Update `.env.local` with all values

### **Testing (Before Committing)**

- [ ] Test GitHub App credentials
- [ ] Test Bitwarden connection
- [ ] Test all API keys (OpenAI, Anthropic, XAI)
- [ ] Verify database connection (if using)
- [ ] Verify local services (Arcadia, SD API)

### **Security (Before Production)**

- [ ] Store secrets in Bitwarden
- [ ] Add secrets to GitHub organization
- [ ] Enable GitHub branch protection
- [ ] Set up webhook receiver
- [ ] Configure IP allowlisting
- [ ] Document rotation schedule

---

## 🔄 Secret Rotation Schedule

```
Every 30 Days:
  - Review and verify all secrets are in use
  - Check GitHub App webhook delivery logs

Every 90 Days:
  - Rotate GITHUB_APP_CLIENT_SECRET
  - Rotate GITHUB_TOKEN_CLASSIC
  - Rotate API keys (if concerned about exposure)

Every 6 Months:
  - Rotate GITHUB_APP_PRIVATE_KEY (generate new)
  - Rotate SESSION_SECRET
  - Rotate JWT_SECRET
  - Rotate BW_CLIENTSECRET

Immediately:
  - If ANY secret is exposed
  - If team member leaves
  - If deployment is compromised
```

---

## 🚀 Next Steps

### **1. Update .env.local Locally**

```bash
cd /home/tec_tgcr/luminai-codex

# Open .env.local
nano .env.local

# Add/update:
GITHUB_APP_ID=2186310
GITHUB_APP_CLIENT_ID=Iv23liuCJbwDvim9WppS
GITHUB_APP_CLIENT_SECRET=<your-generated-secret>
GITHUB_APP_PRIVATE_KEY=<your-private-key>
GITHUB_APP_WEBHOOK_SECRET=<your-webhook-secret>
BW_CLIENTID=<your-bw-id>
BW_CLIENTSECRET=<your-bw-secret>
SESSION_SECRET=<generated>
JWT_SECRET=<generated>

# Save: Ctrl+O, Enter, Ctrl+X
```

### **2. Add to GitHub Secrets (Organization Level)**

```bash
# Using GitHub CLI
gh secret set GITHUB_APP_CLIENT_SECRET -b "your-secret"
gh secret set GITHUB_APP_PRIVATE_KEY < private-key.pem
gh secret set GITHUB_APP_WEBHOOK_SECRET -b "your-webhook-secret"
gh secret set BW_CLIENTID -b "your-bw-id"
gh secret set BW_CLIENTSECRET -b "your-bw-secret"
```

### **3. Store Backup in Bitwarden**

```bash
# Log in to Bitwarden Web Vault
# Create collection: "LuminAI Codex - Secrets"
# Add items for:
#   - GitHub App Credentials
#   - Bitwarden Machine Account
#   - Backup API Keys
```

### **4. Test Everything**

```bash
# Verify .env.local loads
node -e "require('dotenv').config(); console.log(process.env.GITHUB_APP_ID)"

# Should output: 2186310

# Test Bitwarden
bw login --apikey
export BW_SESSION=$(bw unlock --raw)
bw list items

# Test GitHub App
curl -H "Authorization: Bearer YOUR_TOKEN" https://api.github.com/app
```

---

## 📞 Reference Links

- **Generate GitHub Token**: <https://github.com/settings/tokens?type=beta>
- **GitHub App Settings**: <https://github.com/organizations/TEC-The-ELidoras-Codex/settings/apps/tec-resonance-automation>
- **Bitwarden CLI Docs**: <https://bitwarden.com/help/cli/>
- **OpenSSL Commands**: <https://www.openssl.org/docs/>

---

**Status**: 🟢 Ready to Implement

**Owner**: @Elidorascodex

**Last Updated**: November 10, 2025
