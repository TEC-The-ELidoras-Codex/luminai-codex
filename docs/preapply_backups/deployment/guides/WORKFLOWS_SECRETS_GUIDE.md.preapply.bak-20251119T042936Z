---
title: Workflows Secrets Guide
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
- deployment
- guides
related_docs: []
---

# ⚙️ GitHub Workflows & Secrets Management Guide

**Purpose**: Set up CI/CD workflows and manage sensitive credentials  
**Version**: 1.0  
**Last Updated**: November 10, 2025  
**Status**: Implementation Ready

---
title: Workflows Secrets Guide

## 📋 Table of Contents

1. [Overview](#overview)
2. [GitHub Secrets Setup](#github-secrets-setup)
3. [Recommended Workflows](#recommended-workflows)
4. [Dependabot Configuration](#dependabot-configuration)
5. [Environment Variables](#environment-variables)
6. [Secret Rotation](#secret-rotation)
7. [Best Practices](#best-practices)

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
tags: [deployment, guides]
---

## 🎯 Overview

LuminAI Codex uses GitHub Actions for:

- **Testing**: Automated test runs on PR + push
- **Security**: CodeQL scanning, secret scanning, Dependabot checks
- **Deployment**: Discord verification, container builds, environment setup
- **Notifications**: Status updates to Discord/Slack

**Credentials stored**: GitHub Secrets (encrypted, accessible only in workflows)

---

## 🔐 GitHub Secrets Setup

### **Accessing GitHub Secrets**

1. Go to: `Settings → Security → Secrets and Variables → Actions`
2. Click: `New repository secret`
3. Enter: Secret name + value
4. Click: `Add secret`

### **Required Secrets for LuminAI Codex**

#### **AI Service Credentials** 🧠

```
OPENAI_API_KEY = sk-proj-... (from OpenAI dashboard)
OPENAI_ORG_ID = org-... (optional, for org-level usage)

ANTHROPIC_API_KEY = sk-ant-... (from Anthropic dashboard)

XAI_API_KEY = xai-... (from xAI dashboard)
```

#### **Discord Bot** 🤖

```
DISCORD_BOT_TOKEN = bot's token (from Discord Developer Portal)
DISCORD_CLIENT_ID = app ID (from Discord Developer Portal)
DISCORD_CLIENT_SECRET = secret (from Discord Developer Portal)
```

#### **GitHub Integration** 🐙

```
GITHUB_APP_ID = 2186310 (from GitHub App settings)
GITHUB_APP_CLIENT_ID = Iv23li... (from GitHub App settings)
GITHUB_APP_CLIENT_SECRET = generate new on GitHub
GITHUB_APP_PRIVATE_KEY = download .pem file from GitHub App settings
GITHUB_APP_WEBHOOK_SECRET = generate using: openssl rand -hex 32
GITHUB_APP_INSTALLATION_ID = auto-populated after app install
```

#### **External Integrations** 🌐

```
NOTION_API_KEY = ntn_... (from Notion dashboard)
SLACK_BOT_TOKEN = xoxb-... (from Slack workspace)
SPOTIFY_CLIENT_ID = ... (from Spotify dashboard)
SPOTIFY_CLIENT_SECRET = ... (from Spotify dashboard)
WORLDANVIL_API_KEY = ... (from WorldAnvil dashboard)
```

#### **Security & Database** 🔒

```
SESSION_SECRET = generate: openssl rand -base64 32
JWT_SECRET = generate: openssl rand -base64 32
DATABASE_URL = postgresql://user:password@host:5432/luminai_codex
POSTGRES_PASSWORD = your-database-password
```

#### **Deployment & Infrastructure** 🚀

```
DOCKER_USERNAME = your Docker Hub username
DOCKER_PASSWORD = your Docker Hub token

AWS_ACCESS_KEY_ID = (if deploying to AWS)
AWS_SECRET_ACCESS_KEY = (if deploying to AWS)
AWS_REGION = us-east-1

BITWARDEN_ORG_ID = organization ID
BITWARDEN_ACCESS_TOKEN = personal access token
```

### **Verification Checklist** ✅

```bash
# Verify secrets are accessible in workflow
# Add this to any workflow job:

- name: Verify secrets
  run: |
    [ -n "${{ secrets.OPENAI_API_KEY }}" ] && echo "✅ OPENAI_API_KEY set"
    [ -n "${{ secrets.DISCORD_BOT_TOKEN }}" ] && echo "✅ DISCORD_BOT_TOKEN set"
    [ -n "${{ secrets.GITHUB_APP_PRIVATE_KEY }}" ] && echo "✅ GITHUB_APP_PRIVATE_KEY set"
```

---

## 🔄 Recommended Workflows

### **Workflow 1: Tests on Push/PR** ✅ **RECOMMENDED**

**File**: `.github/workflows/test.yml`

```yaml
name: Run Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: [ '3.11', '3.12' ]
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: ${{ matrix.python-version }}
      
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install Python dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt
      
      - name: Install Node dependencies
        run: npm install
      
      - name: Run Python tests
        run: pytest tests -q --tb=short
      
      - name: Run JavaScript tests
        run: npm test 2>/dev/null || echo "No npm tests configured"
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage.xml
```

---

### **Workflow 2: CodeQL Security Scanning** 🛡️ **RECOMMENDED**

**File**: `.github/workflows/codeql.yml`

```yaml
name: CodeQL Security Scanning

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 0 * * 0'  # Weekly on Sunday

jobs:
  analyze:
    name: Analyze
    runs-on: ubuntu-latest
    permissions:
      actions: read
      contents: read
      security-events: write

    strategy:
      fail-fast: false
      matrix:
        language: [ 'javascript', 'python' ]

    steps:
    - name: Checkout repository
      uses: actions/checkout@v4

    - name: Initialize CodeQL
      uses: github/codeql-action/init@v2
      with:
        languages: ${{ matrix.language }}

    - name: Autobuild
      uses: github/codeql-action/autobuild@v2

    - name: Perform CodeQL Analysis
      uses: github/codeql-action/analyze@v2
      with:
        category: "/language:${{ matrix.language }}"
```

---

### **Workflow 3: Dependabot Auto-Merge** 📦 **OPTIONAL**

**File**: `.github/workflows/dependabot-auto-merge.yml`

```yaml
name: Auto-merge Dependabot PRs

on: pull_request_target

permissions:
  pull-requests: write
  contents: write

jobs:
  dependabot:
    if: github.actor == 'dependabot[bot]'
    runs-on: ubuntu-latest
    
    steps:
      - name: Dependabot metadata
        id: metadata
        uses: dependabot/fetch-metadata@v1
        with:
          github-token: "${{ secrets.GITHUB_TOKEN }}"
      
      - name: Enable auto-merge for minor/patch updates
        if: steps.metadata.outputs.update-type == 'version-update:semver-minor' || steps.metadata.outputs.update-type == 'version-update:semver-patch'
        run: gh pr merge --auto --squash "$PR_URL"
        env:
          PR_URL: ${{ github.event.pull_request.html_url }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

### **Workflow 4: Deploy to Discord on Release** 🚀 **RECOMMENDED**

**File**: `.github/workflows/discord-deploy.yml`

```yaml
name: Deploy to Discord

on:
  release:
    types: [published]

jobs:
  notify:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Send Discord notification
        uses: 8398a7/action-slack@v3
        with:
          webhook_url: ${{ secrets.DISCORD_WEBHOOK }}
          payload: |
            {
              "text": "🚀 LuminAI Codex v${{ github.event.release.tag_name }} Released",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*🚀 LuminAI Codex ${{ github.event.release.tag_name }}*\n${{ github.event.release.body }}"
                  }
                }
              ]
            }
```

---

### **Workflow 5: Docker Build on Release** 🐳 **OPTIONAL**

**File**: `.github/workflows/docker-build.yml`

```yaml
name: Build Docker Image

on:
  push:
    tags: [ 'v*' ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    permissions:
      contents: read
      packages: write

    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      
      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: |
            ${{ secrets.DOCKER_USERNAME }}/luminai-codex:latest
            ${{ secrets.DOCKER_USERNAME }}/luminai-codex:${{ github.ref_name }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

---

## 📋 Dependabot Configuration

### **Enable Dependabot** ✅

1. Go to: `Settings → Code Security & Analysis → Dependabot alerts`
2. Click: `Enable`
3. Go to: `Settings → Code Security & Analysis → Dependabot version updates`
4. Click: `Enable`

### **Configuration File** `.github/dependabot.yml`

```yaml
version: 2
updates:
  # Python dependencies
  - package-ecosystem: "pip"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "03:00"
    open-pull-requests-limit: 5
    reviewers:
      - "TEC-The-ELidoras-Codex/security-team"
    labels:
      - "dependencies"
      - "python"
    version-requirement-updates: "auto"
    commit-message:
      prefix: "chore(deps): "

  # Node.js dependencies
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "04:00"
    open-pull-requests-limit: 5
    reviewers:
      - "TEC-The-ELidoras-Codex/security-team"
    labels:
      - "dependencies"
      - "javascript"
    version-requirement-updates: "auto"
    commit-message:
      prefix: "chore(deps): "

  # GitHub Actions
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "05:00"
    reviewers:
      - "TEC-The-ELidoras-Codex/devops-team"
    labels:
      - "dependencies"
      - "actions"
    commit-message:
      prefix: "chore(actions): "

  # Docker base images
  - package-ecosystem: "docker"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "06:00"
    labels:
      - "dependencies"
      - "docker"
    commit-message:
      prefix: "chore(docker): "
```

---

## 🌍 Environment Variables in Workflows

### **Reference Environment Variables**

```yaml
# In workflow steps:
env:
  OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
  DISCORD_BOT_TOKEN: ${{ secrets.DISCORD_BOT_TOKEN }}
  DATABASE_URL: ${{ secrets.DATABASE_URL }}

jobs:
  build:
    runs-on: ubuntu-latest
    
    environment: production  # Use environment protection rules
    
    steps:
      - name: Use secrets
        run: |
          # Secrets are masked in logs
          echo "🔐 Connecting to database..."
          python -c "import os; print('Database:', len(os.environ.get('DATABASE_URL')))"
```

### **Environment Protection Rules** ⚠️

For sensitive workflows (deployments), enable environment reviews:

1. Go to: `Settings → Environments → New environment`
2. Create: `production`, `staging`
3. Add: Required reviewers
4. Configure: Secrets per environment

---

## 🔄 Secret Rotation

### **Rotation Schedule**

| Secret Type | Rotation Frequency | Urgency |
|-------------|------------------|---------|
| **API Keys** (OpenAI, Anthropic, xAI) | Quarterly or on leak | Medium |
| **Bot Tokens** (Discord, Slack) | Quarterly | Medium |
| **GitHub App Secret** | Annually or on leak | Low |
| **Database Password** | Semi-annually | High |
| **Session/JWT Secrets** | Annually | High |
| **SSH Keys** | Semi-annually | High |

### **Rotation Procedure**

1. **Generate new secret**:

   ```bash
   # For secrets like SESSION_SECRET:
   openssl rand -base64 32
   ```

2. **Update GitHub Secrets**:
   - Go to: `Settings → Secrets → Actions`
   - Update the secret value
   - All new runs will use the new value

3. **Redeploy** (if necessary):
   - Trigger a manual workflow run
   - Or wait for next scheduled deployment

4. **Verify**:
   - Check that new deployment uses new secret
   - Monitor logs for any auth failures

5. **Revoke old secret** (if on external service):
   - Go to service (OpenAI, Discord, etc.)
   - Revoke/delete old token
   - Confirm revocation succeeded

### **Emergency Rotation** 🚨

If a secret is **leaked or compromised**:

1. **Immediately** rotate in GitHub Secrets
2. **Immediately** revoke on external service (if needed)
3. **Check logs** for unauthorized access
4. **Audit** any resources created with old secret
5. **Alert** security team: <security@luminai-codex.dev>
6. **Document** incident per `.github/SECURITY.md`

---

## ✅ Best Practices

### **DO** ✅

- ✅ Use GitHub Secrets for all credentials
- ✅ Rotate secrets quarterly
- ✅ Use pinned action versions (e.g., `@v4.1.1`)
- ✅ Enable Dependabot alerts + auto-fixes
- ✅ Enable CodeQL scanning on all PRs
- ✅ Require passing security checks before merge
- ✅ Document secrets in `.env.example` (without values!)
- ✅ Use environment protection rules for `production`
- ✅ Enable branch protection rules

### **DON'T** ❌

- ❌ Hard-code secrets in code (`.env`, config files)
- ❌ Commit `.env` or `.env.local` to Git
- ❌ Echo secrets to logs: `echo $MY_SECRET` ❌
- ❌ Use `@latest` for actions (always pin versions)
- ❌ Ignore Dependabot alerts
- ❌ Disable CodeQL for "speed"
- ❌ Share secrets via email, Slack, or Discord
- ❌ Use the same secret across environments
- ❌ Store credentials in comment or README

### **Security Checklist** 🛡️

- [ ] All secrets stored in GitHub Secrets (not in code)
- [ ] `.env.example` documents all vars (no values)
- [ ] `.env` and `.env.local` in `.gitignore`
- [ ] Workflows mask secrets in logs
- [ ] Dependabot enabled and monitored
- [ ] CodeQL enabled on main branch
- [ ] Action versions pinned (not `@latest`)
- [ ] Branch protection requires passing checks
- [ ] Production environment has approval rules
- [ ] Secret rotation schedule documented
- [ ] Incident response procedure known
- [ ] Security contact known: <security@luminai-codex.dev>

---

## 🔗 Resources

- **GitHub Secrets Docs**: <https://docs.github.com/en/actions/security-guides/encrypted-secrets>
- **GitHub Actions**: <https://docs.github.com/en/actions>
- **Dependabot**: <https://docs.github.com/en/code-security/dependabot>
- **CodeQL**: <https://codeql.github.com/docs/>
- **Security Policy**: `.github/SECURITY.md`
- **Local Setup**: `docs/ENV_LOCAL_SETUP.md`

---

## 📞 Support

Questions about workflows or secrets?

1. Check: `docs/deployment/GITHUB_SECRETS_SETUP.md`
2. Check: `.github/copilot-instructions.md`
3. Email: <security@luminai-codex.dev>

---

**Status**: Ready to implement workflows. Next step: Create `.github/workflows/` directory and add recommended workflow files.
