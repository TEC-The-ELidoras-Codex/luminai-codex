# Ref 19 — Escalation & Contacts

## Roles

| Role | Persona/Human | Focus |
| --- | --- | --- |
| Ethics / Verification | Airth ↔ Angelo | Conscience checks, context disputes |
| Ops / Infra | Ely | CI/CD, secrets, incident response |
| Narrative / Mediation | Arcadia | Cross-team alignment, conflicting stories |
| Automation | Kaznak | Token rotation, workflow scripts |

## Contact Paths

- **Security incidents** → `security@luminai-codex.dev` (per `.github/SECURITY.md`)
- **Project coordination** → GitHub Project #6 discussion thread
- **Family-facing escalation** → Documented in `docs/governance/LUMINAI_MASTER_OPERATING_FRAMEWORK.md`

## Escalation Triggers

- Consent revoked mid-session
- Suspected credential leak (anything that once lived in `_TRANSFER_STAGING`)
- Data deletion SLA missed
- R < 0.4 for three consecutive interactions
- Copilot deviates from persona covenant

## Process

1. Create issue (label `incident`, assign relevant persona/human).
2. Log in Aqueduct cistern audit (stage + timestamp).
3. Page responsible human (DM or email) within 15 minutes.
4. Document resolution + remediation steps.

Keep this sheet pinned in your Codespace or internal wiki so LLM agents know when to stop and call for help.
