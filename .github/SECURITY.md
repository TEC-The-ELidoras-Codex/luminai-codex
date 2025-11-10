# 🔒 Security Policy – LuminAI Codex

**Last Updated**: November 10, 2025  
**Version**: 1.0  
**Status**: Active

---

## 📋 Table of Contents

1. [Reporting Security Vulnerabilities](#reporting-security-vulnerabilities)
2. [Vulnerability Response Timeline](#vulnerability-response-timeline)
3. [Security Advisories](#security-advisories)
4. [Supported Versions](#supported-versions)
5. [Security Best Practices](#security-best-practices)
6. [Bug Bounty Program](#bug-bounty-program)
7. [Dependabot Alerts](#dependabot-alerts)
8. [Secret Scanning](#secret-scanning)
9. [Code Scanning](#code-scanning)
10. [Escalation & Contact](#escalation--contact)

---

## 🚨 Reporting Security Vulnerabilities

**DO NOT** open a public GitHub issue for security vulnerabilities. Instead:

### **Option 1: Private Vulnerability Report (Recommended)**

1. Navigate to: **Settings → Security & Analysis → Private vulnerability reporting**
2. Click **"Report a vulnerability"**
3. Fill out the vulnerability form:
   - **Vulnerability type** (RCE, XSS, SSRF, Data Exposure, etc.)
   - **Affected component** (module, library, or workflow)
   - **Severity level** (Critical, High, Medium, Low)
   - **Description** (detailed reproduction steps)
   - **Impact** (what an attacker can do)
   - **Proof of concept** (if applicable)
4. Submit directly to the security team
5. GitHub creates a private security advisory automatically

### **Option 2: Email Report**

Send encrypted vulnerability details to:

```
📧 security@luminai-codex.dev
PGP Key: https://github.com/TEC-The-ELidoras-Codex/.github/SECURITY_PGP.pub
```

**Include**:

- Clear title: `[SECURITY] Vulnerability Name`
- Affected version(s)
- Component(s) affected
- Severity assessment
- Reproduction steps
- Potential impact
- Suggested fix (optional)

### **Option 3: Discord Security Channel (Team Members Only)**

If you're a team member, use the private `#security-reports` channel in Discord.

---

## ⏱️ Vulnerability Response Timeline

We are committed to the following response timeline:

| Severity | Initial Response | Assessment | Fix Release | Timeline |
|----------|------------------|------------|-------------|----------|
| **Critical** | < 4 hours | < 24 hours | < 72 hours | Hotfix release required |
| **High** | < 24 hours | < 48 hours | < 7 days | Security patch in next release |
| **Medium** | < 48 hours | < 1 week | < 14 days | Included in next scheduled release |
| **Low** | < 1 week | < 2 weeks | < 30 days | Next quarterly release |

### **Critical Severity Defined As**

- Remote Code Execution (RCE)
- Complete data breach (unencrypted user data exposure)
- Authentication bypass
- Privilege escalation
- Active exploitation in the wild

### **Response Process**

1. **Acknowledge** the report (confirmation email within response time)
2. **Assess** the vulnerability (reproduce, measure impact)
3. **Notify** affected parties (if applicable)
4. **Develop** a fix (with tests)
5. **Release** security patch (with advisory)
6. **Notify** reporter of resolution
7. **Disclose** publicly (after fix is released)

---

## 📢 Security Advisories

All security advisories are published on GitHub and in our security documentation.

### **Viewing Advisories**

- GitHub: [Security Advisories](https://github.com/TEC-The-ELidoras-Codex/luminai-codex/security/advisories)
- RSS Feed: Available on GitHub advisories page

### **Advisory Format** (CVSS 3.1 Scoring)

```
GHSA-XXXX-XXXX-XXXX
Title: [Vulnerability Name]
Severity: [Critical|High|Medium|Low]
CVSS Score: X.X
Affected Versions: [version ranges]
Patched Versions: [fix versions]
```

### **Public Disclosure**

- Vulnerabilities are disclosed after a fix is available and released
- Report-to-public delay: typically 90 days
- If attacker proof-of-concept is public, disclosure accelerates
- High/Critical vulnerabilities trigger immediate notification

---

## ✅ Supported Versions

Security updates are provided for:

| Version | Release Date | End of Life | Status |
|---------|--------------|------------|--------|
| **1.x** | Nov 2025 | Nov 2026 | 🟢 Active |
| **0.x** | Sep 2025 | Mar 2026 | 🟡 Security fixes only |
| **Pre-0.x** | Before Sep 2025 | Jun 2025 | 🔴 Unsupported |

**Security Update Releases**:

- Minor security patches: Released ASAP (emergency releases if Critical)
- Feature releases: Quarterly (Feb, May, Aug, Nov)
- Maintenance releases: As-needed

---

## 🛡️ Security Best Practices

### **For Developers**

#### **Secret Management**

```bash
# ✅ DO: Read secrets from environment variables
API_KEY = os.environ.get('OPENAI_API_KEY')

# ❌ DON'T: Hard-code secrets in code
API_KEY = "sk-proj-abcd1234..."

# ✅ DO: Use .env.local for local development
# See: docs/ENV_LOCAL_SETUP.md

# ❌ DON'T: Commit .env or .env.local to Git
```

#### **Dependency Management**

```bash
# ✅ DO: Keep dependencies updated
npm audit fix
pip install --upgrade -r requirements.txt

# ✅ DO: Check Dependabot alerts weekly
# https://github.com/TEC-The-ELidoras-Codex/luminai-codex/security/dependabot

# ❌ DON'T: Ignore deprecated or vulnerable packages
```

#### **Code Review**

```bash
# ✅ DO: Enable code scanning on all PRs
# ✅ DO: Review SARIF reports before merge
# ✅ DO: Address all security warnings

# ❌ DON'T: Merge with unresolved security alerts
```

#### **API Security**

```javascript
// ✅ DO: Validate all inputs
if (!validateInput(userInput)) throw new Error('Invalid input');

// ✅ DO: Use HTTPS only
const url = 'https://api.example.com';

// ❌ DON'T: Trust user input directly
const query = `SELECT * FROM users WHERE id = ${userId}`;  // SQL injection!
```

#### **Authentication**

```javascript
// ✅ DO: Hash passwords with bcrypt/scrypt
const hashedPassword = await bcrypt.hash(password, 12);

// ✅ DO: Use secure session management
req.session.regenerate();  // Prevent fixation attacks

// ❌ DON'T: Store plaintext passwords
password = userInput;  // NEVER!
```

### **For DevOps / Infrastructure**

#### **GitHub Secrets**

```yaml
# ✅ DO: Store sensitive values in GitHub Secrets
- name: Deploy with secret
  env:
    DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
  run: ./deploy.sh

# ❌ DON'T: Print secrets to logs
echo "My secret is $DEPLOY_KEY"  # NEVER!
```

#### **Workflow Security**

```yaml
# ✅ DO: Use pinned action versions
uses: actions/checkout@v4.1.1

# ✅ DO: Use minimal permissions
permissions:
  contents: read
  pull-requests: write

# ❌ DON'T: Use 'latest' or 'main' for actions
uses: some-action@main  # Unsafe!
```

---

## 💰 Bug Bounty Program

We offer a bug bounty program to recognize security researchers and incentivize responsible disclosure.

### **Program Guidelines**

#### **Eligible Vulnerabilities** ✅

- Remote Code Execution (RCE)
- SQL Injection or NoSQL Injection
- Authentication/Authorization bypass
- Sensitive data exposure (unencrypted PII)
- Server-Side Request Forgery (SSRF)
- Cross-Site Scripting (XSS)
- Cross-Site Request Forgery (CSRF)
- Privilege escalation
- API endpoint vulnerabilities
- Configuration errors leading to compromise

#### **Ineligible Reports** ❌

- Missing security headers (CSP, etc.)
- Missing rate limiting (unless leads to concrete attack)
- Social engineering (phishing)
- Physical security issues
- Automated scanner reports without proof of exploitation
- Reports already disclosed publicly

### **Reward Tiers**

| Severity | Complexity | Reward | Notes |
|----------|-----------|--------|-------|
| **Critical** | High | **$500–$1,000** | RCE, full data breach, auth bypass |
| **High** | Medium | **$250–$500** | Significant impact, reproducible |
| **Medium** | Low–Medium | **$50–$250** | Moderate impact, edge case |
| **Low** | Low | **$10–$50** | Minor impact, security hardening |
| **Duplicate** | Any | **$0** | Only first reporter receives bounty |

### **Reward Redemption**

- Method: GitHub Sponsors or direct bank transfer (USD)
- Timeline: Within 30 days of patch release
- Tax forms: Required for amounts > $600 (US) or > €600 (EU)

### **Responsible Disclosure Requirements**

To qualify for bounty:

1. Report vulnerability privately (no public disclosure)
2. Do NOT access other users' data or perform destructive actions
3. Do NOT attempt denial-of-service attacks
4. Do NOT social engineer employees
5. Avoid disruption to production systems
6. Wait for patch release before public disclosure
7. Provide clear proof of concept

---

## 🔧 Dependabot Alerts

Automated dependency scanning is **enabled** and monitors for vulnerabilities in:

- **Node.js** packages (npm, yarn)
- **Python** packages (pip, poetry)
- **Docker** base images
- **GitHub Actions**

### **Alert Settings** ✅

```
✅ Dependabot alerts: Enabled
✅ Auto-fixing pull requests: Enabled (minor versions only)
✅ Scheduled checks: Daily
✅ Email notifications: To security@luminai-codex.dev
```

### **Manual Checks**

```bash
# Check for vulnerable packages (Node.js)
npm audit

# Check for vulnerable packages (Python)
pip-audit

# Update safely
npm audit fix
pip install --upgrade pip && pip install -r requirements.txt --upgrade
```

### **Responding to Alerts**

1. Receive Dependabot PR automatically
2. Review the vulnerability details
3. Check CI/CD tests pass
4. Approve and merge PR
5. Deploy to staging/production

---

## 🔐 Secret Scanning

GitHub's secret scanning is **currently disabled** but should be enabled to detect accidentally committed secrets.

### **Enable Secret Scanning** (Recommended)

```
Settings → Security & Analysis → Secret Scanning → Enable
```

### **Secrets Protected**

- API keys (OpenAI, Anthropic, etc.)
- Private tokens (GitHub, GitLab)
- Database credentials
- SSH keys
- AWS/Azure credentials

### **What to Do If Secret Leaked**

1. **IMMEDIATELY** rotate the secret (generate new token)
2. Run secret scanning diagnostics
3. Report to security team
4. Audit logs for misuse
5. Update security advisories if needed

---

## 🧪 Code Scanning

GitHub Advanced Security includes **CodeQL** scanning for common vulnerabilities.

### **Currently Disabled** ⚠️

Enable via: **Settings → Code Security & Analysis → Code Scanning → Set up CodeQL**

### **Recommended Configuration**

```yaml
name: CodeQL Analysis
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  analyze:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      security-events: write
    steps:
      - uses: actions/checkout@v4
      - uses: github/codeql-action/init@v2
        with:
          languages: 'javascript', 'python'
      - uses: github/codeql-action/autobuild@v2
      - uses: github/codeql-action/analyze@v2
```

### **Alerts Tracked**

- SQL Injection vulnerabilities
- XSS vulnerabilities
- Path traversal bugs
- Hardcoded credentials
- Insecure randomness
- Missing authentication
- CSRF vulnerabilities

---

## 📞 Escalation & Contact

### **Security Team**

- **Email**: <security@luminai-codex.dev>
- **Discord**: `#security-reports` (team only)
- **Response Time**: Within 4 hours for Critical, 24 hours for High

### **Public Documentation**

- Privacy Policy: `docs/governance/Privacy_Policy.md`
- Terms of Service: `docs/governance/Terms_of_Service.md`
- Master Framework: `docs/governance/LUMINAI_MASTER_OPERATING_FRAMEWORK.md`

### **Incident Response**

For active security incidents (breach, compromise, ongoing attack):

1. Contact security team immediately
2. Use `#incident-response` channel in Discord (team only)
3. Prepare incident timeline, scope, and mitigation

### **Legal & Compliance**

- **Jurisdiction**: Delaware (US) + GDPR (EU)
- **Bug Bounty Governed By**: Responsible Disclosure Agreement
- **Incidents Reported To**: GitHub Security Advisory, FIRST, and affected users

---

## 🔄 Review & Updates

This security policy is reviewed **quarterly** and updated as:

- New vulnerabilities are discovered
- Tools/processes improve
- Regulatory requirements change
- Bug bounty program evolves

**Next Review**: February 10, 2026

---

## Acknowledgments

Thank you to our security researchers and community members who report vulnerabilities responsibly. Your contributions help keep LuminAI Codex secure.

**Recent Contributors**:

- (None yet — be the first!)

---

**Questions?** Contact <security@luminai-codex.dev>
