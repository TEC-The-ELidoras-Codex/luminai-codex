# 🔐 SECRETS MANAGEMENT - CRITICAL SECURITY PROTOCOL

## ⚠️ GOLDEN RULE

**NO REAL SECRETS ON YOUR LOCAL MACHINE UNLESS ABSOLUTELY NECESSARY.**

All secrets live in **ONE PLACE ONLY**:
- **GitHub Secrets** (for CI/CD)
- **Bitwarden** (for local development, if needed)
- **NEVER** in `.env.local` or any other file on disk

---

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
   - GitHub App → https://github.com/settings/apps
   - OpenAI → https://platform.openai.com/api-keys
   - Anthropic → https://console.anthropic.com
   - xAI → xAI dashboard
   - GitHub Tokens → https://github.com/settings/tokens

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

**Last Updated:** November 16, 2025  
**Status:** 🔒 ALL PROTECTIONS ACTIVE

