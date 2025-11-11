# 🔐 Security Setup & Configuration Checklist

**Last Updated**: November 10, 2025  
**Status**: Implementation Guide

---

## ✅ Repository-Level Security

### Access & Permissions

- [ ] **Branch Protection** (Settings → Branches → main)
  - [x] Require PR reviews before merge (2+ approvals)
  - [x] Require status checks to pass (CodeQL, pytest, linting)
  - [x] Dismiss stale pull request approvals
  - [x] Require code owner approval
  - [x] Restrict who can push to matching branches

- [ ] **GitHub App Permissions** (Settings → Security & Analysis)
  - [x] Enable Dependabot alerts
  - [x] Enable secret scanning
  - [x] Enable code scanning (CodeQL)
  - [x] Enable private vulnerability reporting

### Teams & Roles

- [ ] **Team Structure**
  - [x] `@TEC-The-ELidoras-Codex/admins` — Full repo access (push, admin, merge)
  - [x] `@TEC-The-ELidoras-Codex/maintainers` — PR review & merge (maintain role)
  - [x] `@TEC-The-ELidoras-Codex/contributors` — PR submission only (triage role)

- [ ] **Secrets Management** (Settings → Secrets & Variables)
  - [ ] Store API keys as repository secrets:
    - `OPENAI_API_KEY`
    - `ANTHROPIC_API_KEY`
    - `XAI_API_KEY`
    - `DISCORD_BOT_TOKEN`
    - `SLACK_BOT_TOKEN`
    - `GITHUB_APP_PRIVATE_KEY`
    - `NOTION_API_KEY`
    - `AZURE_COSMOS_DB_CONNECTION_STRING`
  - [ ] Set environment variables for non-sensitive config

---

## ✅ Code Security

### Automated Scanning

- [ ] **CodeQL Analysis**
  - Create `.github/workflows/codeql-analysis.yml`
  - Run on: `push`, `pull_request`, `schedule` (weekly)
  - Language: Python, JavaScript
  - Upload results to SARIF

- [ ] **Dependabot Configuration** (`.github/dependabot.yml`)

  ```yaml
  version: 2
  updates:
    - package-ecosystem: "pip"
      directory: "/"
      schedule:
        interval: "daily"
      allow:
        - dependency-type: "production"
      reviewers:
        - "TEC-The-ELidoras-Codex/maintainers"
  
    - package-ecosystem: "npm"
      directory: "/"
      schedule:
        interval: "daily"
  ```

- [ ] **SAST Tools** (Pre-commit hooks)
  - Bandit: Python security linting
  - npm audit: JavaScript vulnerability scanning
  - Semgrep: Semantic code scanning

### Vulnerability Management

- [ ] **Regular Audits**

  ```bash
  pip audit
  npm audit
  poetry audit  # if using poetry
  ```

- [ ] **Patch Management**
  - Auto-merge Dependabot PRs for patches/minor versions
  - Manual review for major version upgrades
  - Test all updates in staging before production

---

## ✅ Secrets Management

### Environment Variables (.env.local - NEVER commit)

```
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
XAI_API_KEY=...
DISCORD_TOKEN=...
SLACK_TOKEN=...
GITHUB_APP_ID=...
GITHUB_APP_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----...
NOTION_TOKEN=...
AZURE_COSMOS_CONNECTION_STRING=...
```

### Secret Scanning Configuration

- [ ] GitHub Secret Scanning (automatically enabled)
- [ ] Custom patterns for internal APIs
- [ ] Notifications to <security@luminai-codex.dev>
- [ ] Auto-invalidate exposed credentials

### Bitwarden Backup (for team secrets)

```bash
python scripts/development/setup_local_env.py
python scripts/development/check_env.py --file .env.local
```

---

## ✅ CI/CD Security

### GitHub Actions Workflows

- [ ] **Create `.github/workflows/security.yml`**

  ```yaml
  name: Security Checks
  on: [push, pull_request]
  
  jobs:
    bandit:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - name: Run Bandit
          run: pip install bandit && bandit -r src/
    
    npm-audit:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - name: npm audit
          run: npm audit --audit-level=moderate
  ```

- [ ] **Create `.github/workflows/tests.yml`**

  ```yaml
  name: Tests
  on: [push, pull_request]
  
  jobs:
    pytest:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: actions/setup-python@v4
          with:
            python-version: "3.12"
        - run: pip install -r requirements.txt
        - run: pytest tests/ -q
  ```

### Status Checks (Branch Protection)

- [x] CodeQL analysis must pass
- [x] Tests must pass
- [x] Security scanning must pass
- [x] At least 2 PR approvals
- [x] No merge conflicts

---

## ✅ Documentation Security

### SECURITY.md Checklist

- [x] Vulnerability reporting process (private + email)
- [x] Response timelines (critical: 24h, high: 7d, medium: 14d, low: 30d)
- [x] Security advisories archive
- [x] Supported versions
- [x] Bug bounty program (if applicable)
- [x] Contact information

### Deployment Security

- [ ] **Production Deployment Checklist** (`docs/deployment/DEPLOYMENT_CHECKLIST.md`)
  - [ ] All tests passing
  - [ ] Security scan results reviewed
  - [ ] No known CVEs in dependencies
  - [ ] Secrets rotated within past 30 days
  - [ ] Backup & rollback plan documented

- [ ] **Staging Environment**
  - Use separate secrets (`_STAGING` suffix)
  - Test all changes before production
  - Mirror production architecture

---

## ✅ Dependency Management

### Current Stack Analysis

```
Python:
  - fastapi 0.104+
  - pydantic 2.6+
  - python-dotenv 1.0+
  - rich 13.7+
  - typer 0.12+
  - httpx 0.27+
  - pytest 8.0+

JavaScript/Node:
  - dotenv 17.2.3
  - [additional deps to be added]

External Services:
  - OpenAI API
  - Anthropic Claude
  - xAI Grok
  - Azure Cosmos DB
  - GitHub App
  - Discord
  - Slack
  - Notion
```

### Upgrade Strategy

1. **Automated**: Patch & minor upgrades (auto-merge)
2. **Manual Review**: Major version upgrades
3. **Testing**: All updates tested in staging
4. **Rollback**: Keep previous versions tagged/releasable

---

## ✅ Incident Response Plan

### Security Incident Workflow

1. **Detection** → Alert <security@luminai-codex.dev>
2. **Classification** → Determine severity (Critical/High/Medium/Low)
3. **Triage** → Assign to responsible team member
4. **Mitigation** → Apply immediate fix or disable feature
5. **Notification** → Inform affected users (if applicable)
6. **Resolution** → Ship permanent fix
7. **Post-Mortem** → Document learnings

### Contact & Escalation

```
Primary:      security@luminai-codex.dev
PGP Backup:   https://github.com/TEC-The-ELidoras-Codex/.github/SECURITY_PGP.pub
GitHub:       Private vulnerability report via Settings → Security & Analysis
Slack/Teams:  #security-incidents (if team member)
```

---

## ✅ Compliance & Audit

### Code Audit Checklist

- [ ] No hardcoded credentials
- [ ] No plaintext passwords in comments
- [ ] API keys properly scoped (read-only where possible)
- [ ] User inputs properly validated & sanitized
- [ ] Error messages don't leak sensitive info
- [ ] Logging doesn't capture secrets
- [ ] CORS/CSRF properly configured

### Regular Reviews

- [ ] Monthly: Dependabot PRs review & merge
- [ ] Quarterly: Full security audit
- [ ] Annually: Third-party penetration test (if budget allows)

---

## 🚀 Next Steps

1. **Enable all GitHub security features** (if not already done)
2. **Add CI/CD workflows** (copy templates above)
3. **Configure Dependabot** properly in `.github/dependabot.yml`
4. **Set up team roles** with appropriate permissions
5. **Review & rotate secrets** regularly
6. **Test incident response** plan quarterly
7. **Document all security changes** in CHANGELOG

---

**Questions?** Refer to `.github/SECURITY.md` or contact the security team.
