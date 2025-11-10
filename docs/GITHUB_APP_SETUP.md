# 🤖 TEC Resonance Automation - GitHub App Setup

**GitHub App**: TEC Resonance Automation  
**App ID**: 2186310  
**Link**: <https://github.com/apps/tec-resonance-automation>  
**Status**: Active & Ready for Configuration

---

## ⚡ Quick Reference

| Item | Value | Where to Get |
|------|-------|---|
| **App ID** | 2186310 | Already configured |
| **Client ID** | Iv23liuCJbwDvim9WppS | Dashboard (visible) |
| **Client Secret** | `*****e8f40935` | Generate new at: Settings → Developer settings → GitHub Apps → TEC Resonance Automation |
| **Private Key** | `SHA256:bKpx...16ys=` | Generate new (never commit) |
| **Webhook Secret** | _(not set yet)_ | **Generate before deploying** |
| **Installation ID** | _(auto-populated)_ | Check webhook payload or API |

---

## 🔧 Setup Decision: Organization App vs. OAuth

### **❓ Should You Use Organization App or Org-level OAuth?**

**Recommendation**: Keep as **Organization App** (current setup) because:

✅ **Already configured** with App ID `2186310`  
✅ **Simpler for CI/CD** - no per-user authorization needed  
✅ **Org-wide automation** - triggers on any repo in organization  
✅ **Better for bots** - cleaner audit trail  
✅ **OAuth optional** - only if users need personal auth

**Current Setup**: ✅ **Organization App** (Correct)

```
TEC Resonance Automation (Org App)
├── Installs on: TEC-The-ELidoras-Codex organization
├── Triggers: All repos in org + PRs, issues, workflows
├── Auth: Machine account (no user login needed)
└── Use case: CI/CD automation, brand asset deployment
```

---

## 🚀 Getting Started: First-Time Setup

### **Step 1: Generate/Rotate Client Secret**

```bash
# Go to GitHub App settings
# https://github.com/organizations/TEC-The-ELidoras-Codex/settings/apps/tec-resonance-automation

# Click "Generate new client secret"
# Copy the full secret (not just visible part)
# Add to environment:

export GITHUB_APP_CLIENT_SECRET="<your-new-secret>"
# Store in: Bitwarden or GitHub Secrets
```

### **Step 2: Generate Private Key**

```bash
# On GitHub App page, click "Generate a new private key"
# This downloads a `.pem` file

# Store securely:
cat > ~/.ssh/github-app-private-key.pem << 'EOF'
-----BEGIN RSA PRIVATE KEY-----
[paste your key here]
-----END RSA PRIVATE KEY-----
EOF

chmod 600 ~/.ssh/github-app-private-key.pem

# Add to .env.local:
export GITHUB_APP_PRIVATE_KEY=$(cat ~/.ssh/github-app-private-key.pem)
```

### **Step 3: Generate Webhook Secret**

```bash
# Generate a strong secret
WEBHOOK_SECRET=$(openssl rand -hex 32)
echo $WEBHOOK_SECRET

# Store in:
# 1. GitHub Secrets (for CI/CD)
# 2. Bitwarden (for team reference)
# 3. .env.local (for local testing)

export GITHUB_APP_WEBHOOK_SECRET="$WEBHOOK_SECRET"
```

### **Step 4: Set Webhook URL**

```
App Settings → Webhook → Webhook URL:
https://api.luminaicodex.com/webhooks/github
              ↑
        Your webhook endpoint

Example for local testing:
https://localhost:3000/webhooks/github
(Using ngrok tunnel)
```

### **Step 5: Configure Permissions**

**Repository Permissions** (already selected ✅):

- ✅ Actions (read/write) - Workflows & artifacts
- ✅ Administration (read) - Repo settings
- ✅ Checks (read/write) - Code checks
- ✅ Code scanning (read/write) - SAST alerts
- ✅ Commit statuses (read/write) - CI status
- ✅ Contents (read/write) - File access
- ✅ Deployments (read/write) - Deployment management
- ✅ Issues (read/write) - Issue automation
- ✅ Pull requests (read/write) - PR automation
- ✅ Workflows (read/write) - GitHub Actions

**Organization Permissions** (Update):

- ✅ Administration (read) - Org settings
- ✅ Members (read) - Team access
- ✅ Webhooks (read/write) - Org webhooks

### **Step 6: Subscribe to Webhook Events**

```
✅ Selected Events:

Infrastructure:
  - Push
  - Create (branch/tag)
  - Delete (branch/tag)
  - Repository

Code Quality:
  - Code scanning alert
  - Secret scanning alert
  - Branch protection rule

Automation:
  - Issues
  - Issue comment
  - Pull request
  - Pull request review
  - Workflow dispatch
  - Workflow run

Brand/Assets:
  - Label
  - Projects
  - Discussions
```

---

## 📦 Environment Variables for GitHub App

### **In `.env.local`**

```bash
# GitHub App Configuration
GITHUB_APP_ID=2186310
GITHUB_APP_CLIENT_ID=Iv23liuCJbwDvim9WppS
GITHUB_APP_CLIENT_SECRET=<rotate every 6 months>
GITHUB_APP_PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----
GITHUB_APP_WEBHOOK_SECRET=<32-char-hex-secret>
GITHUB_APP_INSTALLATION_ID=<auto-populated-from-webhook>

# GitHub API
GITHUB_ORG=TEC-The-ELidoras-Codex
GITHUB_REPO=luminai-codex
GITHUB_TOKEN=ghp_<your-pat-token>
```

### **In GitHub Secrets** (Organization Settings)

```
Settings → Secrets and variables → Actions → Repository secrets

GITHUB_APP_CLIENT_SECRET      = <your-secret>
GITHUB_APP_PRIVATE_KEY        = <your-private-key>
GITHUB_APP_WEBHOOK_SECRET     = <your-webhook-secret>
GITHUB_TOKEN_CLASSIC          = <your-pat>
BWS_ACCESS_TOKEN              = <your-bitwarden-token>
```

**How to set GitHub Secrets**:

```bash
# Using GitHub CLI
gh secret set GITHUB_APP_CLIENT_SECRET -b "your-secret-value"
gh secret set GITHUB_APP_PRIVATE_KEY < private-key.pem
gh secret set GITHUB_APP_WEBHOOK_SECRET -b "your-webhook-secret"
```

---

## 🔐 Security: Permissions Breakdown

### **What Should Be Private/Secure?**

```
🔴 HIGHLY SENSITIVE (Never share):
  - GITHUB_APP_PRIVATE_KEY      (can generate installation tokens)
  - GITHUB_APP_CLIENT_SECRET    (authenticate as app)
  - GITHUB_APP_WEBHOOK_SECRET   (validate webhook signatures)

🟡 SENSITIVE (Limit to trusted users):
  - GITHUB_TOKEN_CLASSIC        (can access all org repos)
  - BW_CLIENTSECRET             (Bitwarden machine account)

🟢 PUBLIC (OK to share):
  - GITHUB_APP_ID               (2186310)
  - GITHUB_APP_CLIENT_ID        (Iv23liuCJbwDvim9WppS)
  - GitHub App public link      (https://github.com/apps/...)
```

### **Where to Store Each**

```
.env.local (Local Dev Only):          .gitignore ✅
├── GITHUB_APP_CLIENT_SECRET
├── GITHUB_APP_PRIVATE_KEY
├── GITHUB_APP_WEBHOOK_SECRET
└── All API keys

GitHub Secrets (Org Settings):         Private 🔐
├── GITHUB_APP_CLIENT_SECRET
├── GITHUB_APP_PRIVATE_KEY
├── GITHUB_APP_WEBHOOK_SECRET
└── GITHUB_TOKEN_CLASSIC

Bitwarden Vault:                       Encrypted 🛡️
├── All secrets (backup)
├── Rotation dates
└── Access logs
```

---

## 🧪 Testing Your GitHub App

### **Test 1: Verify App Installation**

```bash
# Using GitHub CLI
gh api -H "Accept: application/vnd.github+json" /app/installations

# Using curl
curl -H "Authorization: Bearer YOUR_GITHUB_TOKEN" \
  https://api.github.com/app/installations

# Expected response:
{
  "total_count": 1,
  "installations": [
    {
      "id": <your-installation-id>,
      "app_id": 2186310,
      "account": {
        "login": "TEC-The-ELidoras-Codex",
        "type": "Organization"
      }
    }
  ]
}
```

### **Test 2: Verify Webhook Delivery**

```bash
# Go to GitHub App settings → Recent deliveries
# Click a webhook to see:
# - Request body (the event data)
# - Response code (200 = success)
# - Signature (X-Hub-Signature-256)

# Validate signature locally:
openssl dgst -sha256 -hmac "${WEBHOOK_SECRET}" webhook_payload.json

# Should match: X-Hub-Signature-256 header value
```

### **Test 3: Test Installation Token Creation**

```bash
# Create a temporary installation access token
curl -X POST \
  -H "Authorization: Bearer $(jwt-from-app)" \
  https://api.github.com/app/installations/<installation-id>/access_tokens

# Use this token to access org repos (1 hour validity)
```

### **Test 4: Trigger Webhook Manually**

```bash
# Simulate a webhook for testing:
curl -X POST \
  -H "X-Hub-Signature-256: sha256=$(openssl dgst -sha256 -hmac "${WEBHOOK_SECRET}" -hex -r | cut -d' ' -f1)" \
  -H "Content-Type: application/json" \
  -d @webhook_payload.json \
  https://your-webhook-url.com/webhooks/github
```

---

## 📋 Best Practices

### **✅ DO**

- ✅ Rotate private key every 6 months
- ✅ Rotate client secret every 6 months
- ✅ Store secrets in Bitwarden + GitHub Secrets
- ✅ Monitor webhook delivery failures
- ✅ Use installation tokens (1-hour expiry)
- ✅ Validate webhook signatures (X-Hub-Signature-256)
- ✅ Log all webhook events for audit
- ✅ Test webhook before deploying
- ✅ Use IP allowlist for webhook source

### **❌ DON'T**

- ❌ Commit private keys to git (even accidentally)
- ❌ Use the same secret across environments
- ❌ Share secrets in Slack, email, or chat
- ❌ Store secrets in plain text files
- ❌ Disable webhook signature validation
- ❌ Use personal access token for app auth
- ❌ Grant unnecessary permissions
- ❌ Leave old secrets active after rotation
- ❌ Skip monitoring webhook deliveries

---

## 🐛 Troubleshooting

### **Issue: "401 Bad credentials"**

```bash
# Check if app is properly authenticated
# ❌ Problem: Private key not loaded correctly
# ✅ Solution:
export GITHUB_APP_PRIVATE_KEY=$(cat ~/.ssh/github-app-private-key.pem)

# Or if using JWT:
jwt-sign --key private-key.pem --algorithm RS256 {payload}
```

### **Issue: "404 Not Found" on webhook**

```bash
# Check if webhook URL is correct
# ❌ Problem: Typo in URL or endpoint not implemented
# ✅ Solution:
# 1. Verify endpoint exists: curl https://your-domain/webhooks/github
# 2. Check if app is installed: gh api /app/installations
# 3. View recent deliveries in GitHub: Settings → Developer settings → GitHub Apps → Recent deliveries
```

### **Issue: "Webhook signature verification failed"**

```bash
# Check if secret matches
# ❌ Problem: Different secrets in GitHub vs. code
# ✅ Solution:

# Re-generate secret:
WEBHOOK_SECRET=$(openssl rand -hex 32)
echo "New secret: $WEBHOOK_SECRET"

# Update in GitHub: Settings → Webhook → Secret
# Update in code: GITHUB_APP_WEBHOOK_SECRET
# Update in Bitwarden: Password manager
```

### **Issue: "Permission denied" on repo access**

```bash
# Check if app has required permissions
# ❌ Problem: Missing permissions in GitHub App settings
# ✅ Solution:
# 1. Go to: GitHub App settings → Repository permissions
# 2. Add missing permissions (Contents, Issues, PullRequests, etc.)
# 3. Re-install app or request permissions
```

---

## 📊 Monitoring & Logging

### **GitHub App Activity**

```bash
# View webhook deliveries:
# https://github.com/organizations/TEC-The-ELidoras-Codex/settings/apps/tec-resonance-automation/advanced

# Or via API:
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.github.com/app/hook/deliveries
```

### **Logs to Capture**

```
✅ Webhook received (timestamp, payload size)
✅ Signature validated (success/failure)
✅ Event type (push, pull_request, issues, etc.)
✅ Action taken (status, error)
✅ Rate limit status
✅ Installation token created/expired
```

---

## 🎯 Next Steps

### **Phase 1: This Week**

- [ ] Generate new client secret
- [ ] Generate new private key
- [ ] Generate webhook secret
- [ ] Set webhook URL (ngrok for local testing)
- [ ] Add to GitHub Secrets

### **Phase 2: Next Week**

- [ ] Implement webhook receiver endpoint
- [ ] Add signature validation
- [ ] Test webhook deliveries
- [ ] Set up monitoring/alerts
- [ ] Document deployment process

### **Phase 3: Production**

- [ ] Deploy to production environment
- [ ] Enable IP allowlisting
- [ ] Set up CI/CD pipeline
- [ ] Test brand asset deployment
- [ ] Monitor for errors

---

## 📞 Quick Links

- **GitHub App Settings**: <https://github.com/organizations/TEC-The-ELidoras-Codex/settings/apps/tec-resonance-automation>
- **Generate Personal Token**: <https://github.com/settings/tokens?type=beta>
- **Webhook Documentation**: <https://docs.github.com/en/developers/webhooks-and-events/webhooks>
- **GitHub App API**: <https://docs.github.com/en/rest/apps>
- **Installation ID Info**: <https://docs.github.com/en/rest/apps/installations>

---

**Status**: 🔄 **Ready for Local Testing**

**Owner**: @Elidorascodex (Infrastructure Team)

**Last Updated**: November 10, 2025
