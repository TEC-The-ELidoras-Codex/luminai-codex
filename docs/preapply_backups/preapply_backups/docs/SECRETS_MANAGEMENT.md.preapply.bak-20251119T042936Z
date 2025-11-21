---
title: Secrets Management
date_created: '2025-11-18'
date_updated: '2025-11-18'
status: draft
approvers:
- persona: Ely
  role: Engineering Steward
owner_checklist:
- '[ ] Read and understood'
- '[ ] Cross-linked in TEC_HUB.md and STRUCTURE.md'
- '[ ] Tested commands/steps (if procedural)'
- '[ ] Old version archived if replaced'
tags:
- docs
related_docs: []
---

# 🔐 SECRETS MANAGEMENT - CRITICAL SECURITY PROTOCOL

## ⚠️ GOLDEN RULE

**NO REAL SECRETS ON YOUR LOCAL MACHINE UNLESS ABSOLUTELY NECESSARY.**

All secrets live in **ONE PLACE ONLY**:

- **GitHub Secrets** (for CI/CD)
- **Bitwarden** (for local development, if needed)
- **NEVER** in `.env.local` or any other file on disk

---
title: Secrets Management

## File Structure (What's Where)

```
✅ COMMITTED TO GIT (Public)
└── .env.example          # TEMPLATE ONLY - safe placeholders like "your-api-key"

❌ NEVER COMMITTED (Private - Gitignored)
├── .env.local            # Local development (populated manually from Bitwarden ONLY)
├── .env.production       # Production secrets (use CI/CD or remote config instead)
└── .env.*.local          # Any variant

💾 SECRETS VAULT (Bitwarden)
└── Folder: TEC/LuminAI Codex
    ├── GitHub App
    ├── OpenAI API
    ├── Anthropic API
    ├── xAI API
    └── [Other services]
```

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
tags: [docs]

---

## How to Use Secrets Securely

### Option 1: Using Bitwarden (Recommended for Development)

```bash
# 1. Login to Bitwarden CLI
bw login

# 2. Create mapping file at secrets-local/bw/mapping.json
cat > secrets-local/bw/mapping.json << 'EOF'
{
  "OPENAI_API_KEY": "OpenAI API",
  "ANTHROPIC_API_KEY": "Anthropic API",
  "GITHUB_APP_PRIVATE_KEY": "GitHub App",
  "XAI_API_KEY": "xAI API"
}
EOF

# 3. Generate .env.local from Bitwarden
./scripts/development/generate_env_from_bitwarden.sh

# ✅ .env.local is now populated with real secrets (gitignored)
# ❌ NEVER commit .env.local
```

### Option 2: GitHub Secrets (For CI/CD)

All CI/CD workflows automatically have access to GitHub Secrets:

```yaml
# In GitHub Actions workflow
- name: Run tests
  env:
    OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
    ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
  run: npm test
```

### Option 3: Manual Setup (If Bitwarden unavailable)

```bash
# 1. Copy template
cp .env.example .env.local

# 2. Edit .env.local with YOUR REAL SECRETS
nano .env.local

# 3. DO NOT commit it
# Git pre-commit hook will reject attempts to commit .env files
```

---

## Git Protections (Automatic)

### 🛡️ Pre-commit Hook

Located at: `.git/hooks/pre-commit`

**What it does:**

- Scans staged files for `.env*` patterns
- Blocks commit if any `.env` file is staged
- Error message explains why and how to fix

**If you accidentally stage `.env.local`:**

```bash
git reset HEAD .env.local        # Unstage it
git checkout -- .env.local       # Restore from disk
git commit -m "..."              # Try again
```

### 🛡️ .gitignore Rules

Located at: `.gitignore`

```gitignore
.env              # Any .env file
.env.local        # Local development secrets
.env.*.local      # Variants like .env.production.local
```

---

## ⚡ Emergency: If Secrets Leak

**Immediate actions (within 5 minutes):**

1. **Identify what leaked** (check `.env.local`, git history)
2. **Revoke everything:**
   - GitHub App → <https://github.com/settings/apps>
   - OpenAI → <https://platform.openai.com/api-keys>
   - Anthropic → <https://console.anthropic.com>
   - xAI → xAI dashboard
   - GitHub Tokens → <https://github.com/settings/tokens>

3. **Update Bitwarden** with new credentials

4. **Notify team** if in organization

---

## ✅ Checklist: Before You Code

- [ ] `.env.local` is in `.gitignore`
- [ ] Only `.env.example` (template) is committed
- [ ] Pre-commit hook is installed and executable
- [ ] All real secrets in Bitwarden or GitHub Secrets
- [ ] Your local `.env.local` file is gitignored

---

## Commands Reference

```bash
# Check if .env.local would be committed (pre-commit hook)
git commit --dry-run

# View current secrets (DO NOT SHARE OUTPUT)
cat .env.local

# Regenerate from Bitwarden
./scripts/development/generate_env_from_bitwarden.sh

# Verify pre-commit hook is working
git add .env.local  # Should work (won't actually add)
git commit -m "test"  # Should FAIL with security warning
```

---

## ⚙️ Quick helpers included in repo

To make adding repository secrets easier, this repo now includes interactive helper scripts:

- `scripts/secrets/add_github_secrets.sh` — Bash script (WSL / Linux / macOS) that prompts for each secret and uses the `gh` CLI to set repository secrets.
- `scripts/secrets/add_github_secrets.ps1` — PowerShell script equivalent for Windows PowerShell.

Usage (example):

```bash
# Login to GitHub CLI first:
gh auth login

# Then run the interactive helper (WSL / bash):
./scripts/secrets/add_github_secrets.sh

# Or in PowerShell:
./scripts/secrets/add_github_secrets.ps1
```

Important: do not paste secrets into chat or issue trackers. Use these interactive scripts locally so values are read from stdin and sent directly to GitHub.

### Bitwarden → GitHub automation

If you keep secrets in Bitwarden (the recommended approach), you can automate pushing them to GitHub using the Bitwarden CLI and the GitHub CLI. The repo includes a helper script:

- `scripts/secrets/bitwarden_to_github.sh` — reads `secrets-local/bw/mapping.json` (JSON map ENV_NAME -> Bitwarden item title) and sets GitHub Actions secrets using your current `bw` session and `gh` login.

Example mapping template: `secrets-local/bw/mapping.json.example` (copy to `secrets-local/bw/mapping.json` and edit names to match your Bitwarden items).

Usage (WSL / bash):

```bash
# 1) Login and unlock Bitwarden CLI
bw login
bw unlock
export BW_SESSION=$(bw unlock --raw)

# 2) Authenticate gh CLI
gh auth login

# 3) Copy the example mapping and edit
cp secrets-local/bw/mapping.json.example secrets-local/bw/mapping.json
# Edit secrets-local/bw/mapping.json to match your Bitwarden item names

# 4) Run the sync script
./scripts/secrets/bitwarden_to_github.sh
```

Important: the script reads the `BW_SESSION` environment variable to authenticate with `bw` (do not commit your session value). The script extracts common fields from Bitwarden items in this order: `.login.password`, `.notes`, and then `.fields[].value`.


## Optional backend secrets (Arcadia / FOLD)

Some entries you may see in `.env.example` (for example `TEC_ARCADIA_URL`,
`TEC_ARCADIA_API_KEY`, and `FOLD_API_URL`) are optional placeholders that come from
the repository's server/back-end scaffolding and deployment documentation. They are
present to support running the Arcadia "resonance" backend or other server-side
integrations from this repo.

If you only use this repository as a static site (GitHub Pages) or manage a
separate WordPress site (not deployed from this repo), you do NOT need these
values. They were included by the original project scaffolding (templates and
deployment docs) or added by previous maintainers to document optional integrations.

How to restore/enable them if you ever need them:

1. Create Bitwarden items with clear names (example: "Arcadia API Key", "Fold API URL").
2. Copy `secrets-local/bw/mapping.json.example` → `secrets-local/bw/mapping.json` and
   add mapping entries like:

```json
{
  "TEC_ARCADIA_API_KEY": "Arcadia API Key",
  "FOLD_API_URL": "Fold API URL"
}
```

3. Unlock Bitwarden and run the `bitwarden_to_github.sh` helper to populate GitHub
   Actions secrets, or manually add them to GitHub repo secrets if preferred.

Notes on provenance: these keys typically originate from one of these places:

- The project's initial scaffold/template that included a backend service definition.
- Developer-added entries for optional integrations that may be run locally by
  engineers (resonance testing, dev-only services).
- Documentation in `docs/deployment/backend/07_TECH_ENV_AND_SECRETS.md` which
  intentionally lists optional integrations.

If you'd like, I can prune these optional placeholders from `.env.example` and
the default mapping file to keep the repo minimal — or leave them commented as
optional examples. Tell me which you prefer.

**Last Updated:** November 16, 2025  
**Status:** 🔒 ALL PROTECTIONS ACTIVE

---

## ♻️ Rotation Log & Schedule

Maintain an auditable trail of secret rotations. Rotate high-risk credentials (LLM provider keys, GitHub tokens) at least every 30 days or immediately upon suspected exposure.

| Date | Actor | Secret(s) Rotated | Reason | New Expiry / Next Review |
|------|-------|-------------------|--------|--------------------------|
| 2025-11-16 | system init | (baseline entry) | Establish log | 2025-12-16 |
| YYYY-MM-DD | YOUR_NAME | OPENAI_API_KEY | Routine 30d rotation | +30d |
| YYYY-MM-DD | YOUR_NAME | ANTHROPIC_API_KEY | Routine 30d rotation | +30d |
| YYYY-MM-DD | YOUR_NAME | XAI_API_KEY | Routine 30d rotation | +30d |
| YYYY-MM-DD | YOUR_NAME | GITHUB_APP_PRIVATE_KEY | Scope change / renewal | +90d |
| YYYY-MM-DD | YOUR_NAME | github_pat_* | Token scoped reduction | +30d |

### Rotation Checklist

- [ ] Revoke old key in provider dashboard
- [ ] Generate new key with LEAST required scopes
- [ ] Update Bitwarden entry (attach creation timestamp)
- [ ] Update GitHub Secret (Actions) if used in CI
- [ ] Run a smoke test referencing the new key
- [ ] Log rotation above (do NOT paste the secret)
- [ ] Schedule next rotation (calendar reminder)

### Automated Future Enhancement (Planned)

Implement `scripts/security/rotate_secrets.py` to:

1. Fetch Bitwarden items by tag `auto-rotate`
2. Create provider API calls (where available)
3. Update vault + emit signed rotation receipt to `reports/secret-rotations/`

---

## Optional backend secrets (Arcadia / FOLD)

Some entries in .env.example (for example TEC_ARCADIA_URL, TEC_ARCADIA_API_KEY, FOLD_API_URL) are optional placeholders from the project's backend scaffolding. If you only run a static site (GitHub Pages) or manage a separate WordPress instance, you can ignore these. They were added by repository scaffolding or maintainers. See docs/deployment/backend/07_TECH_ENV_AND_SECRETS.md for details.
