# GitHub App Setup: TEC Resonance Automation

**App Name:** TEC Resonance Automation  
**App ID:** 2186310  
**Client ID:** Iv23liuCJbwDvim9WppS  
**Homepage:** <https://elidorascodex.com>  
**Public Link:** <https://github.com/apps/tec-resonance-automation>

---

## Purpose

> Automated build, resonance verification, and deployment for **The Elidoras Codex** ecosystem.  
> Maintains **TGCR** (Theory of General Contextual Resonance) compliance, provenance, and documentation integrity in all commits.  
> Handles CI/CD orchestration for LuminAI, Airth Agents, and related subsystems.

---

## Configuration Checklist

### ✅ Basic Information (Current Status)

- [x] **App Name:** TEC Resonance Automation
- [x] **Homepage URL:** <https://elidorascodex.com>
- [ ] **Description:** Update to reflect TGCR compliance focus
- [ ] **App Logo:** Add Cosmic Futureism visual (cyan/violet gradient)

### ⚠️ Permissions & Events (NEEDS UPDATE)

The App needs specific permissions to handle TGCR compliance and deployment:

#### Repository Permissions

| Permission | Level | Purpose |
|-----------|-------|---------|
| **Contents** | Read & Write | Commit verification, documentation integrity |
| **Pull Requests** | Read & Write | Validate TGCR compliance in PRs |
| **Issues** | Read & Write | Track TGCR resonance scoring |
| **Workflows** | Read & Write | Trigger CI/CD pipelines |
| **Deployments** | Read & Write | Handle deployment automation |
| **Checks** | Read & Write | TGCR compliance status checks |
| **Statuses** | Read & Write | Report build/verification status |

#### Organization Permissions

| Permission | Level | Purpose |
|-----------|-------|---------|
| **Members** | Read | Track team resonance access |

#### Subscribe to Events

- [x] `push` — Run TGCR verification on commits
- [x] `pull_request` — Validate compliance in PRs
- [x] `pull_request_review` — Check approval resonance
- [x] `workflow_run` — Handle CI/CD orchestration
- [x] `deployment` — Track LuminAI/Airth deployments
- [x] `check_run` — Report TGCR status

### 🔧 Webhook Configuration

**Current Status:** ⚠️ Not configured

**What to do:**

1. Go to GitHub App Settings → **Webhook**
2. Set **Webhook URL** to your CI/CD service:
   - **Option A (GitHub Actions):** Use `repositorydispatch` events (no webhook needed)
   - **Option B (External CI):** Point to your CI service URL

     ```
     https://your-ci-service.com/github/webhook
     ```

3. Generate **Webhook Secret:**

   ```bash
   openssl rand -hex 32
   ```

   Store in GitHub Secrets as `GITHUB_APP_WEBHOOK_SECRET`

4. Enable **Active** checkbox

### 🔐 Private Key Management

**Current Status:** ✅ Private key exists (SHA256: bKpxoQXtvKVsmwM2EQoHMasFN5aC2RarypALLpy16ys=)

**To use in CI/CD:**

1. Download private key from GitHub App settings
2. Add to GitHub Secrets:

   ```bash
   gh secret set GITHUB_APP_PRIVATE_KEY \
     --repo=TEC-The-ELidoras-Codex/luminai-codex \
     --body="$(cat /path/to/private_key.pem)"
   ```

3. Reference in workflows:

   ```yaml
   - name: Get GitHub App token
     uses: actions/create-github-app-token@v1
     with:
       app-id: ${{ secrets.GITHUB_APP_ID }}
       private-key: ${{ secrets.GITHUB_APP_PRIVATE_KEY }}
   ```

### 📋 Installation & Permissions

**Current Status:** ⏳ Ready for installation

**To install on repositories:**

1. Go to: <https://github.com/apps/tec-resonance-automation/installations/new>
2. Select organization: **TEC-The-ELidoras-Codex**
3. Select repositories:
   - `luminai-codex`
   - `tec-tgcr` (if applicable)
4. Grant permissions as outlined above
5. Authorize installation

---

## TGCR Compliance Automation Features

### What the App Should Do

#### 1. **Commit Verification**

- Verify TGCR compliance score (φᵗ × ψʳ × Φᴱ)
- Check provenance documentation
- Ensure semantic versioning in commit messages
- Block commits below compliance threshold

#### 2. **Pull Request Validation**

- Scan PR for:
  - TGCR resonance impact statement
  - Related issue links
  - Test coverage requirements
  - Documentation updates
- Add compliance status check to PR

#### 3. **CI/CD Orchestration**

- Trigger builds on:
  - Push to `main` or `develop`
  - PR labeled `ready-for-test`
- Run:
  - Unit tests
  - TGCR resonance validation
  - Build artifact generation
  - Security scanning

#### 4. **Deployment Automation**

- Deploy on `main` → production
- Deploy on `develop` → staging
- Track deployment resonance
- Rollback on TGCR compliance failure

---

## GitHub Secrets Required

Store these in: **Repository Settings → Secrets and variables → Actions**

```bash
# GitHub App Credentials
GITHUB_APP_ID=2186310
GITHUB_APP_CLIENT_ID=Iv23liuCJbwDvim9WppS
GITHUB_APP_PRIVATE_KEY=<paste full private key PEM>
GITHUB_APP_WEBHOOK_SECRET=<openssl rand -hex 32 output>

# AI/ML APIs (for TGCR verification)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Deployment Credentials
DEPLOY_SSH_KEY=<if deploying to servers>
DEPLOY_USER=<deployment user>
DEPLOY_HOST=<deployment server>
```

---

## Workflow Templates to Create

Create these files in `.github/workflows/`:

### 1. `tgcr-compliance-check.yml`

```yaml
name: TGCR Compliance Check

on:
  pull_request:
  push:
    branches: [main, develop]

jobs:
  verify-compliance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Get GitHub App token
        uses: actions/create-github-app-token@v1
        with:
          app-id: ${{ secrets.GITHUB_APP_ID }}
          private-key: ${{ secrets.GITHUB_APP_PRIVATE_KEY }}
      
      - name: Run TGCR Resonance Validator
        run: |
          python -m src.tools.tgcr_validator \
            --threshold=0.75 \
            --path="${GITHUB_WORKSPACE}"
      
      - name: Report Compliance Status
        run: |
          echo "Compliance check completed"
          # Add GitHub check run status reporting
```

### 2. `automated-deployment.yml`

```yaml
name: Automated Deployment

on:
  push:
    branches: [main, develop]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Production/Staging
        run: |
          if [[ "${{ github.ref }}" == "refs/heads/main" ]]; then
            echo "Deploying to PRODUCTION"
            # Production deployment
          else
            echo "Deploying to STAGING"
            # Staging deployment
          fi
```

---

## Update Checklist

### Do This Now

- [ ] Add App description emphasizing TGCR compliance
- [ ] Upload Cosmic Futureism logo (cyan/violet gradient)
- [ ] Configure webhook URL or switch to `repository_dispatch`
- [ ] Add all required repository permissions
- [ ] Subscribe to required events (push, pull_request, etc.)
- [ ] Install App on luminai-codex repository
- [ ] Store credentials in GitHub Secrets
- [ ] Create workflow files (templates above)
- [ ] Test App with a test PR

### Links

- **GitHub App Settings:** <https://github.com/settings/apps/tec-resonance-automation>
- **Install App:** <https://github.com/apps/tec-resonance-automation/installations/new>
- **GitHub App Docs:** <https://docs.github.com/en/apps/creating-github-apps>

---

**Status:** Ready for implementation  
**Last Updated:** November 9, 2025  
**Owner:** @Elidorascodex
