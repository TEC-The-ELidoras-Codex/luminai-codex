# 🔐 LuminAI Codex — Privacy Policy

**Effective Date:** November 10, 2025  
**Last Updated:** November 10, 2025  
**Audience:** Users of LuminAI Codex (Discord Bot + Research Framework)

---

## 1. What We Collect (And Why)

### The Minimization Principle

We collect **only the minimum data needed** to:

1. **Provide AI assistance** (your prompts, so we can answer)
2. **Enable collaboration** (who you are, your server context)
3. **Maintain security** (unusual activity, failed authentications)
4. **Improve reliability** (system performance, error logs)

### Data Categories We Collect

#### Category 1: Interaction Data

- **What**: Discord message content (prompts you send)
- **Why**: To generate responses using AI models
- **How Long**: Retained for 30 days for debugging, then deleted
- **Your Control**: You can delete messages anytime; we delete from our logs within 24 hours
- **Encrypted**: Yes (TLS in transit, AES-256 at rest)

**Example Entry**:

```json
{
  "user_id": "discord_user_123",
  "server_id": "discord_guild_456",
  "message_id": "msg_789",
  "timestamp": "2025-11-10T14:32:00Z",
  "prompt_length": 145,
  "model_used": "gpt-4-turbo",
  "response_tokens": 256,
  "deleted": false
}
```

#### Category 2: Account Metadata

- **What**: Discord user ID, username, avatar URL, server role
- **Why**: To verify you, respect permissions, personalize responses
- **How Long**: Retained as long as you use the bot
- **Your Control**: We delete all records when you remove the bot from your server
- **Encrypted**: Yes (AES-256 at rest)

#### Category 3: System Health Metrics

- **What**: API response times, error rates, feature usage statistics (NOT personal data)
- **Why**: To improve performance, identify bugs, prevent abuse
- **How Long**: 90 days (aggregated), then deleted
- **Your Control**: Fully anonymized — cannot identify you
- **Encrypted**: Yes (TLS)

**Example Entry** (Aggregated):

```json
{
  "timestamp": "2025-11-10T14:00:00Z",
  "metric": "average_response_time_ms",
  "value": 1247,
  "percentile_95": 2100,
  "error_rate_percent": 0.2
}
```

#### Category 4: Security Alerts

- **What**: Failed authentication attempts, IP addresses of suspicious activity
- **Why**: To protect your account
- **How Long**: 7 days (then deleted unless escalated to incident)
- **Your Control**: We notify you of suspicious activity; you can review in your Discord security settings
- **Encrypted**: Yes (TLS + AES-256)

---

## 2. What We DO NOT Collect

We **explicitly do not** collect:

- ❌ **Full conversation transcripts** (only aggregated stats)
- ❌ **Personal information** (real name, email, phone) — unless you provide it
- ❌ **Location data** (where you are)
- ❌ **Browsing history** (what you view outside Discord)
- ❌ **Biometric data** (facial recognition, fingerprints)
- ❌ **Sensitive demographic info** (unless you opt-in)
- ❌ **Payment information** (we don't charge; Discord does)

---

## 3. How We Use Your Data

### Primary Uses (What We Actually Do With It)

| Purpose | Data Type | Retention | Your Control |
|---------|-----------|-----------|--------------|
| **Generate AI responses** | Interaction data | 30 days | Delete message = we delete from logs in 24h |
| **Improve accuracy** | Aggregated metrics | 90 days | Opt-out via `/privacy-settings` command |
| **Prevent abuse** | Rate limits, IPs | 7 days | Report abuse to us directly |
| **Fix bugs** | Error logs | 30 days | Automatic deletion |
| **Security** | Failed auth attempts | 7 days | Automatic deletion unless escalated |

### Secondary Uses (What We'll NEVER Do)

- ❌ **Sell your data** (never, full stop)
- ❌ **Train LLMs on your messages** (we use only API-approved data)
- ❌ **Share with advertisers** (we have none)
- ❌ **Use for profiling** (we don't build profiles)
- ❌ **Allow third parties access** (except our AI provider APIs, under contract)
- ❌ **Track you across services** (Discord-only)

---

## 4. Who Has Access to Your Data

### Internal Access

- **LuminAI Codex Team**: Engineering & security staff (for debugging, monitoring)
  - **Authentication**: Requires multi-factor authentication
  - **Logging**: All access logged, audited quarterly
  - **Non-Disclosure**: All staff sign NDAs

### Third-Party Access

| Service | Purpose | Data Shared | Contract |
|---------|---------|------------|----------|
| **OpenAI / Anthropic** | AI inference | Prompts only (no user IDs) | API T&Cs + Data Processing Agreement |
| **Discord API** | Bot operations | User ID, server ID, permissions | Discord Developer T&Cs |
| **Cloud Hosting** | Infrastructure | Encrypted backups | DPA + encryption verification |
| **Error Monitoring** | Bug detection | Sanitized error logs (no personal data) | Service contract + DPA |

**What we DON'T share**:

- Your Discord username or avatar
- Message history (except what you explicitly send to AI model)
- Account creation date or profile data

---

## 5. Data Security (How We Protect It)

### Encryption Standards

- **In Transit**: TLS 1.3 (256-bit)
- **At Rest**: AES-256-GCM
- **Future-Ready**: Post-quantum cryptography (Kyber key exchange — coming 2026)

### Infrastructure Security

- **Firewalls**: AWS WAF + rate limiting
- **Access Control**: Role-based access control (RBAC)
- **Multi-Factor Authentication**: Required for all staff
- **Backup Encryption**: Encrypted backups, separate encryption keys
- **Penetration Testing**: Quarterly third-party security audits
- **Bug Bounty Program**: $5K–$50K for reported vulnerabilities ([See Bug Bounty Policy](./LUMINAI_MASTER_OPERATING_FRAMEWORK.md#part-2-the-bug-bounty-program))

### Incident Response

If we suspect a breach:

1. **Detection** → Automated alerts + manual review
2. **Containment** → Isolate affected systems (< 2 hours)
3. **Assessment** → Determine scope + impact (24 hours)
4. **Notification** → Email you + Discord direct message (72 hours, per GDPR)
5. **Remediation** → Fix vulnerability + deploy patch (7 days)
6. **Transparency** → Publish public post-mortem on GitHub (14 days)

---

## 6. Your Data Rights

### Right to Access

- **What**: You can request all data we have on you
- **How**: DM the bot: `/request-data`
- **Timeline**: 7 business days
- **Format**: JSON + CSV
- **Cost**: Free

### Right to Deletion

- **What**: You can ask us to delete your data
- **How**: `/delete-my-data` (confirms in DM)
- **Timeline**: 24 hours
- **Exception**: Encrypted backups may take up to 30 days (we can't retroactively decrypt)

### Right to Data Portability

- **What**: Export everything in standard formats
- **How**: `/export-data`
- **Timeline**: Immediate
- **Formats**: JSON, CSV, or raw text

### Right to Opt-Out

- **What**: Stop sending new data, keep using the bot (with reduced personalization)
- **How**: `/privacy-settings` → Toggle "minimal tracking"
- **Impact**: No response improvement, no proactive suggestions

### Right to Correct

- **What**: Fix incorrect data
- **How**: File a support ticket or DM us
- **Timeline**: 7 days

### Right to Complain

- **What**: If you think we violated your privacy
- **How**:
  - **US**: File complaint with your state's attorney general
  - **EU**: Contact your national data protection authority ([EDPB Member List](https://edpb.ec.europa.eu/about-edpb/board/members_en))
  - **Direct**: Email us at `privacy@luminai-codex.dev`

---

## 7. Children's Privacy (COPPA)

### For Users Under 13

If you're under 13, a **parent or legal guardian must consent** before using LuminAI Codex.

**How Parental Consent Works**:

1. Parent creates a family account on Discord
2. Parent reads this Privacy Policy
3. Parent gives explicit consent: "I authorize LuminAI Codex to collect data as described"
4. We send a confirmation email
5. Parent clicks to activate the child account

**What Parents Can Do**:

- ✅ View all data we have on your child anytime
- ✅ Delete any data in one click
- ✅ Disable specific features (e.g., memory retention)
- ✅ Revoke consent anytime (all data deleted within 24 hours)

**We Commit To**:

- ✅ No ads or targeted marketing to children
- ✅ No collection of data beyond what's needed
- ✅ No sharing with third parties (except AI providers, under contract)
- ✅ Annual reviews of our practices

---

## 8. International Data Transfers

### If You're in the EU

**Your data stays in the EU** (by default):

- Cloud storage: AWS Ireland region (eu-west-1)
- Backups: Stored in EU data centers only
- Processing: EU servers for EU users

**Data Processing Agreement**: We've signed Standard Contractual Clauses (SCCs) with all vendors.

**You Can**:

- Toggle between EU/US storage in settings
- Revoke consent for data transfer at any time

### If You're in California

We comply with **CCPA** (California Consumer Privacy Act):

- All rights listed above apply automatically
- No need to "opt-in" to delete or access your data
- We sell zero data (so CCPA exemption applies)

### If You're Anywhere Else

We apply the **highest standard** from any jurisdiction where you might live:

- EU GDPR standards
- US CCPA standards
- Canadian PIPEDA standards

Pick the strongest protection — it applies to you.

---

## 9. Changes to This Policy

**We may update this policy** if:

- We change our practices (new feature, new data collection)
- Laws change (new regulations)
- We improve our security posture

**When we change it**:

1. We'll notify you 30 days in advance (via Discord direct message)
2. We'll post changes publicly on this page
3. You can review the full change log on GitHub
4. You can disable the bot anytime to opt-out of new practices

**Current Version**: 1.0 (November 10, 2025)

---

## 10. Contact Us

**Questions about this Privacy Policy?**

- **Email**: `privacy@luminai-codex.dev`
- **Discord**: DM the bot: `/contact-privacy`
- **GitHub Issues**: <https://github.com/TEC-The-Elidoras-Codex/luminai-codex/issues>
- **Mailing Address**:

  ```
  TEC Operations
  c/o LuminAI Codex Privacy Team
  [Your Physical Address If Applicable]
  ```

**Report a Data Breach**:

- Email `security@luminai-codex.dev` with:
  - What happened
  - When you noticed it
  - What data was affected
- We'll respond within 24 hours

---

## 11. Legal Compliance Summary

| Regulation | Status | Link |
|-----------|--------|------|
| **GDPR** (EU) | ✅ Compliant | Right to access, delete, portability |
| **COPPA** (US, under 13) | ✅ Compliant | Parental consent required |
| **CCPA** (California) | ✅ Compliant | Right to know, delete, opt-out |
| **PIPEDA** (Canada) | ✅ Compliant | Consent + accountability |
| **Post-Quantum Ready** | 🔄 In Development | Kyber key exchange (2026) |

---

## 12. What This Policy Actually Means (Plain English)

**TL;DR**:

- ✅ We only keep what we need to make you happy
- ✅ We encrypt everything
- ✅ We delete it when you ask
- ✅ We never sell it
- ✅ We fight for your privacy if governments ask
- ✅ We tell you if something goes wrong
- ✅ You can always opt-out

**Long Version**: Read the full policy above. It's written for humans, not lawyers.

---

**We believe privacy is a human right, not a premium feature.**

LuminAI Codex — Built for family. Built for trust.
