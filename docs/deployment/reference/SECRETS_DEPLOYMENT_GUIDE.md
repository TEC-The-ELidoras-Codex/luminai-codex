# 🔐 Secrets & Tokens — Deployment Guide

**THE canonical reference for all secrets, tokens, and API keys.**

**Status**: Complete & Authoritative  
**Last Updated**: November 10, 2025  
**Replaces**: SECRETS_CHECKLIST.md, SECRETS_AND_TOKENS_EXPLAINED.md, GITHUB_SECRETS_SETUP.md

---

## 🎯 TL;DR: What Goes Where

```
┌─────────────────────────────────────────────────────────┐
│  .env.local (GITIGNORED — LOCAL ONLY)                   │
├─────────────────────────────────────────────────────────┤
│ ✅ GITHUB APP CREDENTIALS (keep local)                  │
│    • GITHUB_APP_ID=2186310                              │
│    • GITHUB_APP_CLIENT_ID=Iv23liuCJbwDvim9WppS         │
│    • GITHUB_APP_CLIENT_SECRET=ef9e63af...               │
│    • GITHUB_APP_PRIVATE_KEY=-----BEGIN RSA...           │
│    • GITHUB_APP_WEBHOOK_SECRET=whsec_...                │
│                                                          │
│ ✅ PERSONAL TOKENS (keep local)                         │
│    • GITHUB_TOKEN=github_pat_11BMZXB... (personal PAT)  │
│    • GITHUB_PROJECTS_TOKEN=github_pat_...               │
│                                                          │
│ ✅ LOCAL SERVICES (keep local if testing locally)       │
│    • DATABASE_URL=postgresql://localhost                │
│    • REDIS_URL=redis://localhost                        │
│                                                          │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  GitHub Repository Secrets (CI/CD)                       │
├─────────────────────────────────────────────────────────┤
│ ✅ PRODUCTION SERVICES                                  │
│    • OPENAI_API_KEY=sk-proj-...                         │
│    • CLAUDE_API_KEY=sk-ant-...                          │
│    • XAI_API_KEY=xai-...                                │
│    • TEC_ARCADIA_API_KEY=fold_sk_...                    │
│    • FOLD_API_URL=https://api.tec-fold.local           │
│                                                          │
│ ✅ INTEGRATIONS                                         │
│    • DISCORD_BOT_TOKEN=...                              │
│    • DISCORD_PERMISSIONS_INTEGER=4292492996378320       │
│    • BW_CLIENTID=b9ec4b72...                            │
│    • BW_CLIENTSECRET=Machine_Goddess_7134               │
│    • SPOTIFY_CLIENT_ID=...                              │
│    • SPOTIFY_CLIENT_SECRET=...                          │
│    • TEC_WPCOM_API_PASS=...                             │
│    • WORLDANVIL_API_KEY=...                             │
│    • WPCOM_SSH_USER=...                                 │
│                                                          │
│ ✅ GITHUB-RELATED (only if workflows need them)         │
│    • PROJECT_TOKEN=github_pat_... (for automation)      │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 📋 Complete Secrets Reference

### Your Current Deployment (16 Secrets in GitHub)

| Secret Name | Type | Status | Purpose |
|---|---|---|---|
| `CLAUDE_API_KEY` | API Key | ✅ Fresh | Anthropic Claude 3 Opus |
| `OPENAI_API_KEY` | API Key | ✅ Fresh/Rotated | OpenAI GPT-4 |
| `XAI_API_KEY` | API Key | ✅ Active | xAI Grok |
| `TEC_ARCADIA_API_KEY` | API Key | ✅ Active | TEC internal service |
| `FOLD_API_URL` | URL | ✅ Set | <https://api.tec-fold.local> |
| `BW_CLIENTID` | Service Account | ✅ Active | Bitwarden vault access |
| `BW_CLIENTSECRET` | Service Account | ✅ Active | Bitwarden vault access |
| `DISCORD_BOT_TOKEN` | Bot Token | ✅ Active | Discord notifications |
| `DISCORD_PERMISSIONS_INTEGER` | Config | ✅ Set | 4292492996378320 |
| `PROJECT_TOKEN` | GitHub Token | ✅ Existing | GitHub Projects API |
| `SPOTIFY_CLIENT_ID` | API Key | ✅ Existing | Spotify integration |
| `SPOTIFY_CLIENT_SECRET` | API Key | ✅ Existing | Spotify integration |
| `TEC_WPCOM_API_PASS` | API Key | ✅ Existing | WordPress.com |
| `WORLDANVIL_API_KEY` | API Key | ✅ Existing | WorldAnvil integration |
| `WPCOM_SSH_USER` | SSH User | ✅ Existing | WordPress deployment |
| `ANTHROPIC_API_KEY` | ❌ DELETED | — | Superseded by CLAUDE_API_KEY |

---

## 🎯 Token Types Explained

### 1. GitHub Secrets (For CI/CD Workflows)

**What**: Encrypted environment variables stored in GitHub repo settings.

**When to use**: Workflows need external credentials (API keys, deployment creds, service tokens).

**Where to set**: GitHub repo → Settings → Secrets and variables → Actions → New repository secret

**In your workflows, use them**:

```yaml
# .github/workflows/security-and-tests.yml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Run tests with API keys
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          CLAUDE_API_KEY: ${{ secrets.CLAUDE_API_KEY }}
        run: pytest tests/ -v
```

**Current count**: 16 secrets configured ✅

---

### 2. Personal Access Token (PAT)

**What**: Your personal GitHub auth token (created for your user account).

**When to use**:

- ✅ Local development (git over HTTPS)
- ✅ Local scripts with `gh` CLI
- ✅ Personal API calls to GitHub REST/GraphQL

**When NOT to use**:

- ❌ GitHub Actions CI/CD (use GitHub App or Project Token instead)
- ❌ GitHub Repository Secrets (defeats the purpose)

**Where to store**: `.env.local` ONLY (never commit, never put in repo secrets)

**Your setup**:

- ✅ Token ID: `9632767` (fine-grained)
- ✅ Stored locally in `.env.local`
- ✅ Permissions: Actions, Secrets, Projects, Code, Issues, PRs, Deployments

**Usage**:

```bash
# Git will use token from .env.local or from system credential store
git push origin main

# Or use gh CLI explicitly
export GITHUB_TOKEN=github_pat_11BMZXB...
gh pr list

# Or store in .env.local and source before using
source .env.local
gh secret list
```

---

### 3. GitHub App Private Key (for Automation)

**What**: Secret key that authenticates your GitHub App (LuminAI-Codex).

**When to use**: Workflows need to act as the app (create issues, post comments, trigger other actions).

**Where to store**: `.env.local` ONLY (contains the RSA private key)

**Your setup**:

- ✅ App: LuminAI-Codex (ID: 2186310)
- ✅ Private Key: RSA 2048-bit (generated 2 weeks ago)
- ✅ NOT stored in GitHub Secrets (would expose it)

**Usage in workflows**:

```yaml
# .github/workflows/ci.yml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Authenticate as GitHub App
        id: generate_token
        uses: actions/create-github-app-token@v1
        with:
          app-id: ${{ vars.GITHUB_APP_ID }}
          private-key: ${{ secrets.GITHUB_APP_PRIVATE_KEY }}
          # Note: This requires GITHUB_APP_PRIVATE_KEY in GitHub Secrets
          # OR use local .env.local for development
```

**⚠️ IMPORTANT**: GitHub App credentials (ID, Client ID, Client Secret, Private Key, Webhook Secret) should NEVER be added to GitHub Secrets. They're for local development/testing only.

---

### 4. Project Token (GitHub Projects API)

**What**: Fine-grained token scoped specifically to GitHub Projects.

**When to use**: Workflows need to read/update project data.

**Where to store**: `.env.local` (for local scripts) OR GitHub Secrets `PROJECT_TOKEN` (for workflows).

**Your setup**:

- ✅ Token ID: `9632767`
- ✅ Stored in `.env.local` as `GITHUB_PROJECTS_TOKEN`
- ✅ Also in GitHub Secrets for CI/CD

**Usage**:

```bash
# Local: Use from .env.local
export GITHUB_PROJECTS_TOKEN=github_pat_...
curl -H "Authorization: bearer $GITHUB_PROJECTS_TOKEN" \
  https://api.github.com/graphql \
  -d '{"query": "{ viewer { login } }"}'

# In workflows: Use from GitHub Secrets
jobs:
  update-project:
    runs-on: ubuntu-latest
    steps:
      - name: Update project
        env:
          GITHUB_TOKEN: ${{ secrets.PROJECT_TOKEN }}
        run: gh project item-add $PROJECT_ID
```

---

### 5. Service Account Tokens (Bitwarden, Discord, Spotify)

**What**: Credentials for third-party services.

**When to use**: Workflows/apps need to access external services.

**Where to store**: GitHub Secrets (for CI/CD) AND `.env.local` (for local dev).

**Your current setup**:

| Service | Secret Names | Purpose |
|---|---|---|
| Bitwarden | `BW_CLIENTID`, `BW_CLIENTSECRET` | Access team vault |
| Discord | `DISCORD_BOT_TOKEN`, `DISCORD_PERMISSIONS_INTEGER` | Send notifications |
| Spotify | `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET` | Playlist fetching |
| WordPress | `TEC_WPCOM_API_PASS`, `WPCOM_SSH_USER` | Deployment |
| WorldAnvil | `WORLDANVIL_API_KEY` | Worldbuilding integration |

---

## 🚀 How to Add Secrets to GitHub

### Method 1: GitHub CLI (Recommended)

```bash
# Install gh if needed
# https://cli.github.com/

# Authenticate
gh auth login

# Add a secret
gh secret set OPENAI_API_KEY --body "sk-proj-YOUR_KEY_HERE"

# Add multiline secret (like a private key)
gh secret set GITHUB_APP_PRIVATE_KEY < /path/to/private_key.pem

# Verify all secrets
gh secret list
```

### Method 2: GitHub UI

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `OPENAI_API_KEY`
4. Value: `sk-proj-...`
5. Click **Add secret**

### Method 3: GitHub REST API

```bash
# Requires: curl, jq, GitHub PAT

REPO_OWNER="TEC-The-ELidoras-Codex"
REPO_NAME="luminai-codex"
SECRET_NAME="OPENAI_API_KEY"
SECRET_VALUE="sk-proj-..."

curl -X PUT \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/actions/secrets/$SECRET_NAME" \
  -d "{\"encrypted_value\": \"$(echo -n $SECRET_VALUE | base64)\"}"
```

---

## ⚠️ Security Checklist

- ✅ Never commit `.env.local` to git (check `.gitignore`)
- ✅ Never paste secrets in code comments or logs
- ✅ Rotate API keys if they're ever exposed (yours have been rotated after Phase 3 remediation)
- ✅ GitHub App credentials stay LOCAL ONLY (never in repo secrets)
- ✅ Use fine-grained PATs with minimal permissions (you did this ✓)
- ✅ Enable branch protection rules to require secret scanning
- ✅ Monitor Dependabot alerts for vulnerable dependencies

---

## 🔄 Workflow: Adding a New Secret

**Scenario**: You want to add a new API key to both local dev AND CI/CD.

**Step 1: Add to `.env.local` (local dev)**

```bash
# Edit .env.local
echo "MY_NEW_API_KEY=sk-new-key-here" >> .env.local

# Test locally
source .env.local
echo $MY_NEW_API_KEY  # Should print sk-new-key-here
```

**Step 2: Add to GitHub Secrets (for workflows)**

```bash
gh secret set MY_NEW_API_KEY --body "sk-new-key-here"
```

**Step 3: Use in your workflow**

```yaml
# .github/workflows/some-job.yml
jobs:
  job_name:
    runs-on: ubuntu-latest
    steps:
      - name: Use the secret
        env:
          MY_NEW_API_KEY: ${{ secrets.MY_NEW_API_KEY }}
        run: |
          # Your code here
          python script.py
```

**Step 4: Verify**

```bash
# Check local
source .env.local
echo $MY_NEW_API_KEY

# Check GitHub
gh secret list
```

---

## ✅ Your Deployment Status

| Category | Status | Details |
|---|---|---|
| **Local Secrets** | ✅ Complete | `.env.local` synced with all credentials |
| **GitHub Secrets** | ✅ Complete | 16 secrets configured & verified |
| **GitHub App** | ✅ Ready | LuminAI-Codex (ID: 2186310) active |
| **API Keys** | ✅ Fresh | Claude, OpenAI, xAI keys rotated |
| **Service Integrations** | ✅ Configured | Discord, Bitwarden, Spotify, WordPress ready |
| **Security Scanning** | ✅ Active | CodeQL, Bandit, Secret Scanner running |
| **PAT Created** | ✅ Complete | Token ID 9632767 for local automation |

---

## 🆘 Troubleshooting

| Problem | Solution |
|---|---|
| "Secret not found in workflow" | Verify name matches exactly (case-sensitive). Use `gh secret list` to confirm. |
| ".env.local not loading in workflow" | Workflows don't load `.env.local`; use `${{ secrets.NAME }}` syntax instead. |
| "Permission denied for secret" | Check GitHub token/PAT has `secrets: write` permission. |
| "API key rejected in workflow" | Verify the key is correct (not truncated) and hasn't expired. Check provider dashboard. |
| "Can't push to GitHub" | If using HTTPS, make sure PAT is valid. Try `git config --global credential.helper store`. |

---

## 📖 Related Guides

- **Local Setup**: `docs/deployment/ENV_LOCAL_SETUP.md`
- **Workflows**: `docs/deployment/WORKFLOWS_SECRETS_GUIDE.md`
- **GitHub App**: `docs/deployment/GITHUB_APP_SETUP.md`
- **Webhook Setup**: `docs/deployment/GITHUB_WEBHOOK_SETUP.md`

---

## 🎓 Next Steps

1. ✅ Verify all 16 secrets are in GitHub: `gh secret list`
2. ✅ Verify `.env.local` has all development variables
3. ⏳ Run local tests: `pytest tests/ -v`
4. ⏳ Push test commit to trigger CI/CD workflows
5. ⏳ Monitor GitHub Actions to confirm secrets work in workflows

---

**Questions?** See FAQ in related guides or check `.github/workflows/` for usage examples.
