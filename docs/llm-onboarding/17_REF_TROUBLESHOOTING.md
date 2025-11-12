# Ref 17 — Troubleshooting & Incident Playbook

Based on legacy `operations` attachments (now retired) plus current ops docs.

## Attachment / Rumor Protocols (Retired but Noted)

- Old `ATTACHMENT_PROTOCOL_*` files are archived. The canonical incident guidance now lives in:
  - `docs/operations/MASTER_OPERATIONS_GUIDE.md`
  - `docs/governance/LUMINAI_MASTER_OPERATING_FRAMEWORK.md`
- If you need the older checklists, fetch from git history (`_TRANSFER_STAGING` removal commit).

## Quick Fix Table

| Symptom | Likely Cause | Action |
| --- | --- | --- |
| Webhook 500 | Secret mismatch or backend offline | Re-run curl test from `GITHUB_WEBHOOK_SETUP.md`, check logs |
| Notebook blank | Missing `resonance_notebook` module | Reinstall requirements, rebuild module, rerun `pytest` |
| Persona misalignment | Context package missing fields | Validate using `05_CORE_CONTEXT_PACKAGE_SPEC.md` |
| Content stuck in demo mode | API keys absent | See `07_TECH_ENV_AND_SECRETS.md`, reload services |
| Discord/Arcadia silent | `DISCORD_BOT_TOKEN` unset or perms wrong | Regenerate bot token, update env, restart Arcadia module |
| LLM responds with tool talk | Copilot prompt missing covenant | Reload `01_CORE_SYSTEM_INSTRUCTIONS.md` + persona file |

## Incident Logging

1. Create GitHub issue, label `incident`.
2. Add Aqueduct stage + persona on-call.
3. Record start/end timestamps, root cause, lessons learned.
4. If privacy-related, notify security contact within 24h (see Ref 19).

## When to Escalate

- Consent disagreements
- Security events (suspected credential leak)
- Data retention errors (missed deletion SLA)
- Any scenario where resonance score <0.4 for more than three interactions
