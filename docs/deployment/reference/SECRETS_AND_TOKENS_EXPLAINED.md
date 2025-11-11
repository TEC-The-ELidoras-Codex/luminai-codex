# ⚠️ DEPRECATED — See SECRETS_DEPLOYMENT_GUIDE.md

> This file is deprecated. **Use [SECRETS_DEPLOYMENT_GUIDE.md](./SECRETS_DEPLOYMENT_GUIDE.md)** instead — it's the canonical reference combining all secrets, tokens, and deployment info.

---

# 🔐 Secrets, Tokens & Keys — Complete Breakdown

**Your situation:** You've created a Project Token (ID: 9632767) and you're confused about which tokens go where. This guide clears it up.

---

## Quick Reference Table

| Token Type | What It Is | Use Case | Where to Store | Permissions |
|---|---|---|---|---|
| **Personal Access Token (PAT)** | Fine-grained GitHub auth token for personal use | Git over HTTPS, local API calls | Local machine only (`.env.local`) | Custom (you choose) |
| **Project Token** (ID: 9632767) | Token scoped to GitHub Projects API | Read/update project data, automation | GitHub Secrets (`GITHUB_PROJECTS_TOKEN`) | Fixed (read/write to projects + more) |
| **GitHub App Private Key** (in `.env.local`) | Secret key to authenticate as the GitHub App | GitHub Actions CI/CD automation, webhooks | GitHub Secrets (`GITHUB_APP_PRIVATE_KEY`) | Defined by app installation |
| **Bitwarden Machine Account** | Service account for Bitwarden vault access | CI/CD accessing team secrets vault | GitHub Secrets (`BW_CLIENTID`, `BW_CLIENTSECRET`) | Read access to org vault |
| **AI API Keys** (OpenAI, Anthropic, xAI) | Authentication for AI services | Agent reasoning, embeddings, generation | GitHub Secrets or `.env.local` | API-specific (usage limits set by account) |
| **TEC_ARCADIA_API_KEY** | Arcadia service authentication | Connecting to TEC internal services | `.env.local` + GitHub Secrets | Custom to your TEC setup |

---

## 🎯 YOUR TOKENS EXPLAINED

### 1. **Personal Access Token (PAT)** — What You Just Created

**Token Name:** `luminai-codex`  
**Token ID:** 9632767  
**What it does:** Authenticates YOU (as yourself) to GitHub.

**Permissions you granted:**

```
✓ Read access to members
✓ Read & Write: organization actions variables, secrets, projects
✓ Read & Write: Dependabot alerts, actions, code, commits, issues, PRs, deployments, etc.
```

**Where to use:**

- ❌ **NOT for GitHub Actions CI/CD** (use GitHub App instead)
- ✅ Local development: `git push`, `git pull` with HTTPS
- ✅ Local scripts: `gh` CLI commands (GitHub CLI)
- ✅ Personal API calls to GitHub REST/GraphQL

**Where to store:**

- **Local machine ONLY** — in `.env.local` or via `gh` CLI auth
- **NOT in GitHub repository secrets** (defeats the purpose of a token)

**DO THIS (locally):**

```bash
# Option A: Use GitHub CLI (recommended)
gh auth login  # Paste token when prompted
gh repo view TEC-The-ELidoras-Codex/luminai-codex

# Option B: Use git credential helper
git config --global credential.helper cache
# Git will prompt for token on first push, then cache it
```

**DON'T DO THIS:**

```bash
# ✗ Don't add personal PAT to GitHub Secrets (that's for CI, not personal use)
gh secret set MY_PAT  # Wrong use of personal token
```

---

### 2. **Project Token** — The One You Created (ID: 9632767)

**What is it?** A token **scoped to your Projects API** with broad permissions.

**Permissions (fixed, non-customizable for project tokens):**

```
✓ Read access to members
✓ Read & Write: organization actions variables, secrets, projects
✓ Read & Write: Dependabot, actions, code, commits, PRs, deployments, etc.
```

**Use cases:**

- Updating GitHub Projects (project.13) from CI/CD
- Reading/writing project automation
- Updating issue/PR status on project board

**Where to store:**

- **GitHub Secrets** (this one DOES go in repo secrets)
- Add as: `GITHUB_PROJECTS_TOKEN`

**How to use in workflows:**

```yaml
# .github/workflows/update-project.yml
name: Update Project
on: [pull_request, issues]
jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - name: Update Project Status
        run: |
          curl -X POST https://api.github.com/graphql \
            -H "Authorization: Bearer ${{ secrets.GITHUB_PROJECTS_TOKEN }}" \
            -d '{"query":"mutation { ... }"}'
```

---

### 3. **GitHub App Credentials** (What You Already Have)

**Components:**

- `GITHUB_APP_ID=2186310`
- `GITHUB_APP_CLIENT_ID=Iv23liuCJbwDvim9WppS`
- `GITHUB_APP_CLIENT_SECRET=ef9e63af8b236c07cd4d20c5478cbab1e8f40935`
- `GITHUB_APP_PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----...`
- `GITHUB_APP_INSTALLATION_ID=<auto-populated>`

**What is it?** An installed GitHub App that acts as a bot/service account.

**Where to store:**

- **GitHub Secrets** (for CI/CD to use):
  - `GITHUB_APP_ID`
  - `GITHUB_APP_CLIENT_ID`
  - `GITHUB_APP_CLIENT_SECRET`
  - `GITHUB_APP_PRIVATE_KEY`
  - `GITHUB_APP_INSTALLATION_ID`

**Where NOT to store it:**

- ❌ Commit it to the repo (already in `.env.local` which is gitignored — that's fine for local, but secrets must go in GitHub Secrets for CI)

**Use cases:**

- CI/CD workflows (GitHub Actions)
- Automated GitHub operations (create issues, update PRs, post comments)
- Webhooks responding to repo events

---

### 4. **TEC_ARCADIA Keys** — Your Internal Service

From your `.env.local`:

```
TEC_ARCADIA_URL=http://localhost:8080/resonance
TEC_ARCADIA_API_KEY=fold_sk_-iLBJurnrd5xRCdhQOFg8B6YfyWGcKACxDUraqv4Vx8
```

**Questions:**

- Q: "What is my TEC_ARCADIA_PKEY and FOLD_KEY?"
- A: These appear to be part of the same credential system (TEC Arcadia service).

**Where to get them:**

- `TEC_ARCADIA_API_KEY` — appears to be the "fold key" (prefix `fold_sk_...`)
- If you have a separate "PKEY" (private key), it would be generated or downloaded from your TEC Arcadia admin console

**Where to store:**

- **Local:** `.env.local` (for local Arcadia testing)
- **GitHub Secrets:** `TEC_ARCADIA_API_KEY` (if CI needs to call Arcadia)

**In workflows:**

```yaml
env:
  TEC_ARCADIA_URL: http://localhost:8080/resonance  # or prod URL
  TEC_ARCADIA_API_KEY: ${{ secrets.TEC_ARCADIA_API_KEY }}
```

---

## 🚀 What to Add to GitHub Secrets NOW

Based on your `.env.local` and permissions, add these to GitHub repository secrets:

### Go to: Settings → Secrets and variables → Actions → New repository secret

| Secret Name | Value (from your `.env.local`) | Purpose |
|---|---|---|
| `GITHUB_APP_ID` | `2186310` | GitHub App authentication |
| `GITHUB_APP_CLIENT_ID` | `Iv23liuCJbwDvim9WppS` | GitHub App client |
| `GITHUB_APP_CLIENT_SECRET` | `ef9e63af...e8f40935` | GitHub App secret (keep safe!) |
| `GITHUB_APP_PRIVATE_KEY` | `-----BEGIN RSA PRIVATE KEY-----...-----END RSA PRIVATE KEY-----` | GitHub App signing key |
| `GITHUB_PROJECTS_TOKEN` | Your PAT or Project Token (ID: 9632767) | Project API access |
| `OPENAI_API_KEY` | `sk-proj-...` | OpenAI API |
| `ANTHROPIC_API_KEY` | `sk-ant-...` | Anthropic Claude |
| `XAI_API_KEY` | `xai-...` | xAI Grok |
| `TEC_ARCADIA_API_KEY` | `fold_sk_...` | TEC Arcadia service |
| `DISCORD_WEBHOOK_URL` | (paste your Captain Hook webhook) | Discord automation |
| `DATABASE_URL` | `postgresql://...` | Production DB (if deploying) |
| `BW_CLIENTID` | `b9ec4b72...` | Bitwarden machine account (optional) |
| `BW_CLIENTSECRET` | `Machine_Goddess_7134` | Bitwarden machine account (optional) |

---

## How to Add Secrets: Three Methods

### Method A: GitHub UI (Easiest)

1. Go to repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"**
3. Enter `OPENAI_API_KEY` in the "Name" field
4. Paste `sk-proj-...` in the "Secret" field
5. Click "Add secret"
6. Repeat for all secrets

### Method B: GitHub CLI (Recommended for multiple secrets)

```bash
# Install gh if needed: https://cli.github.com/

# Login (if not already)
gh auth login

# Add secrets one by one
gh secret set GITHUB_APP_ID --body "2186310" \
  --repo TEC-The-ELidoras-Codex/luminai-codex

gh secret set GITHUB_APP_CLIENT_SECRET --body "ef9e63af8b236c07cd4d20c5478cbab1e8f40935" \
  --repo TEC-The-ELidoras-Codex/luminai-codex

gh secret set OPENAI_API_KEY --body "sk-proj-..." \
  --repo TEC-The-ELidoras-Codex/luminai-codex

# For multiline (like PRIVATE_KEY), use a file:
gh secret set GITHUB_APP_PRIVATE_KEY --body "$(cat /path/to/private-key.pem)" \
  --repo TEC-The-ELidoras-Codex/luminai-codex

# Verify secrets were added
gh secret list --repo TEC-The-ELidoras-Codex/luminai-codex
```

### Method C: API (Advanced)

```bash
# Requires: curl + jq + PAT token
TOKEN="<your-github-pat>"
REPO="TEC-The-ELidoras-Codex/luminai-codex"
SECRET_NAME="OPENAI_API_KEY"
SECRET_VALUE="sk-proj-..."

curl -X PUT \
  -H "Authorization: token $TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/$REPO/actions/secrets/$SECRET_NAME \
  -d "{\"encrypted_value\": \"$(echo -n $SECRET_VALUE | openssl enc -aes-256-cbc -K $KEY -iv $IV | base64)\"}"
```

---

## 🎓 Quick Recap: What Goes Where

```
┌─────────────────────────────────────────────────────────┐
│  Your Machine (.env.local — gitignored)                 │
├─────────────────────────────────────────────────────────┤
│ • OPENAI_API_KEY                                        │
│ • ANTHROPIC_API_KEY                                     │
│ • XAI_API_KEY                                           │
│ • TEC_ARCADIA_API_KEY                                   │
│ • GitHub App credentials (for local testing)            │
│ • DATABASE_URL (local dev DB)                           │
│ • Personal PAT (optional, for gh CLI)                   │
└─────────────────────────────────────────────────────────┘
                         ↓ (copy/reference)
┌─────────────────────────────────────────────────────────┐
│  GitHub Repository Secrets (encrypted in GitHub)        │
├─────────────────────────────────────────────────────────┤
│ • GITHUB_APP_ID                                         │
│ • GITHUB_APP_CLIENT_ID                                  │
│ • GITHUB_APP_CLIENT_SECRET                              │
│ • GITHUB_APP_PRIVATE_KEY                                │
│ • GITHUB_PROJECTS_TOKEN (ID: 9632767)                   │
│ • OPENAI_API_KEY                                        │
│ • ANTHROPIC_API_KEY                                     │
│ • XAI_API_KEY                                           │
│ • TEC_ARCADIA_API_KEY                                   │
│ • DISCORD_WEBHOOK_URL                                   │
│ • DATABASE_URL (production)                             │
│ • BW_CLIENTID, BW_CLIENTSECRET (optional)               │
└─────────────────────────────────────────────────────────┘
                         ↓ (accessed in CI/CD workflows)
┌─────────────────────────────────────────────────────────┐
│  GitHub Actions Workflow (${{ secrets.VARIABLE_NAME }}) │
├─────────────────────────────────────────────────────────┤
│ env:                                                    │
│   OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}         │
│   GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}  (auto)     │
│   ...                                                   │
└─────────────────────────────────────────────────────────┘
```

---

## ⚠️ Security Checklist

- [ ] Personal PAT **NOT** in GitHub Secrets (it's for YOUR local machine only)
- [ ] Project Token **IS** in GitHub Secrets (it's for CI/CD)
- [ ] GitHub App private key **IS** in GitHub Secrets (CI/CD needs it)
- [ ] API keys (OpenAI, Anthropic, etc.) **ARE** in GitHub Secrets (for CI tests)
- [ ] `.env.local` is in `.gitignore` (never commit locally stored secrets)
- [ ] Rotate any keys that were exposed in commit history (you already redacted and force-pushed)
- [ ] Enable GitHub Secret Scanning in repo settings (Settings → Security & analysis)
- [ ] Review GitHub Actions logs — they mask secrets automatically, but double-check no keys leaked in output

---

## Next Steps

1. **Add secrets to GitHub** (use Method A or B above)
2. **Verify in GitHub UI** (go to Settings → Secrets, should see all entries)
3. **Update workflows** (use `${{ secrets.SECRET_NAME }}` in your `.yml` files)
4. **Test CI/CD** (push a small commit, watch Actions run with secrets accessible)
5. **Rotate compromised keys** (OpenAI, Anthropic, xAI keys that were in commit history should be regenerated)

---

## FAQ

**Q: Should I commit my Personal PAT to `.env.local`?**  
A: No. `.env.local` is gitignored (good), so it won't be committed. But don't add your personal PAT to GitHub Secrets — it's just for your local machine.

**Q: Can I use the Project Token for Git pushes?**  
A: Yes, a project token can be used for Git over HTTPS (like any PAT), but it's overkill. Use your personal PAT or GitHub CLI auth instead.

**Q: Where do I get the TEC_ARCADIA_PKEY?**  
A: If it's separate from `TEC_ARCADIA_API_KEY`, check your TEC Arcadia admin panel, Bitwarden vault, or ask your team. It might be part of the same `fold_sk_...` key or a separate file you received.

**Q: Do I need Bitwarden secrets in GitHub?**  
A: Only if your CI/CD needs to read from Bitwarden (advanced setup). For most projects, just store final API keys as secrets directly.

**Q: What if I accidentally committed a secret?**  
A: (Already done!) You rewrote history and force-pushed. Now rotate those keys at their provider (OpenAI console, Anthropic console, etc.). GitHub will still flag them as exposed until you confirm they're rotated.

---

## Resources

- [GitHub Secrets & Variables Documentation](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions)
- [GitHub CLI (gh) — Manage Secrets](https://cli.github.com/manual/gh_secret)
- [Fine-Grained Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token#creating-a-fine-grained-personal-access-token)
- [GitHub App Authentication](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/about-authentication-with-a-github-app)
