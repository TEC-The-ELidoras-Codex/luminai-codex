# Quick Action: Configure GitHub App in 10 Minutes

## What You Need to Do RIGHT NOW

### Step 1: Configure App Settings (2 min)

Go to: **<https://github.com/settings/apps/tec-resonance-automation>**

**Update these fields:**

1. **Description** (update to):

   ```
   Automated build, resonance verification, and deployment for The Elidoras Codex.
   Maintains TGCR compliance, provenance, and documentation integrity.
   Handles CI/CD orchestration for LuminAI and Airth agents.
   ```

2. **Add Logo** (optional but recommended):
   - Upload 200x200px PNG with cyan (#00D5C4) and violet (#6A00F4) gradient
   - Save to `assets/logo/github-app-logo.png`

3. Click **Save changes**

---

### Step 2: Set Up Permissions (3 min)

Still in App Settings → **Permissions & events**

**Grant these Repository Permissions:**

| Permission | Select |
|-----------|--------|
| Contents | Read & write |
| Pull Requests | Read & write |
| Workflows | Read & write |
| Checks | Read & write |

**Organization Permissions:**

| Permission | Select |
|-----------|--------|
| Members | Read |

**Subscribe to these Events:**

- ✅ `push`
- ✅ `pull_request`
- ✅ `pull_request_review`
- ✅ `workflow_run`
- ✅ `check_run`

Click **Save changes**

---

### Step 3: Store Credentials as GitHub Secrets (2 min)

Go to: **<https://github.com/TEC-The-ELidoras-Codex/luminai-codex/settings/secrets/actions>**

Add these secrets:

#### 3a. GitHub App ID

```
Name: GITHUB_APP_ID
Value: 2186310
```

#### 3b. GitHub App Private Key

1. Go back to **<https://github.com/settings/apps/tec-resonance-automation>**
2. Scroll to **Private keys**
3. Click **Generate a new private key**
4. GitHub downloads a `.pem` file
5. Open it, copy full contents
6. Paste as:

   ```
   Name: GITHUB_APP_PRIVATE_KEY
   Value: [paste entire PEM file content]
   ```

#### 3c. App Client ID

```
Name: GITHUB_APP_CLIENT_ID
Value: Iv23liuCJbwDvim9WppS
```

---

### Step 4: Install App on Repository (2 min)

Go to: **<https://github.com/apps/tec-resonance-automation/installations/new>**

1. Select organization: **TEC-The-ELidoras-Codex**
2. Under "Select repositories":
   - ✅ **Only select repositories**
   - ✅ **luminai-codex**
3. Click **Install**
4. Review permissions, click **Authorize**

**✅ App is now installed!**

---

### Step 5: Create Test Workflow (1 min)

Create file: `.github/workflows/tgcr-test.yml`

```yaml
name: TGCR Test

on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Get GitHub App Token
        uses: actions/create-github-app-token@v1
        with:
          app-id: ${{ secrets.GITHUB_APP_ID }}
          private-key: ${{ secrets.GITHUB_APP_PRIVATE_KEY }}
      
      - name: Verify Token Works
        run: |
          echo "✅ GitHub App token generated successfully"
          echo "App can now authenticate with GitHub"
```

Commit and push:

```bash
git add .github/workflows/tgcr-test.yml
git commit -m "✅ Add GitHub App test workflow"
git push origin main
```

**Check:** Go to **Actions** tab → see green checkmark = ✅ App works!

---

## Summary of What Was Set Up

| Item | Status |
|------|--------|
| App Name | `TEC Resonance Automation` |
| App ID | `2186310` |
| Permissions | Read & Write (Contents, PRs, Workflows, Checks) |
| Events | Push, PR, PR Review, Workflow Run, Check Run |
| Installation | ✅ On luminai-codex repo |
| Secrets | ✅ Stored in GitHub |
| Test Workflow | ✅ Ready to test |

---

## Next Steps (After Initial Setup)

1. **Create TGCR validator** (`src/tools/tgcr_validator.py`)
   - Check commits for compliance
   - Score resonance (φᵗ × ψʳ × Φᴱ)

2. **Create deployment workflows**
   - Auto-deploy on main → production
   - Auto-deploy on develop → staging

3. **Set up status checks**
   - Block merges until TGCR compliance passes
   - Require App approval on PRs

4. **Enable Marketplace listing** (optional)
   - Let other GitHub users install your App

---

**Questions?** See `GITHUB_APP_SETUP.md` for full details.
