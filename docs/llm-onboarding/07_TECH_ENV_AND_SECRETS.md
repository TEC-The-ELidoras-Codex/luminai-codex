# Tech 07 — Environment & Secrets Map

Primary reference: `docs/deployment/guides/ENV_LOCAL_SETUP.md`  
Example mapping extracted from `_TRANSFER_STAGING/docs_incoming/SECRETS_MAPPING_EXAMPLE.md`

---

## Mandatory Variables

| Category | Variables | Notes |
| --- | --- | --- |
| AI Providers | `OPENAI_API_KEY`, `CLAUDE_API_KEY`, `XAI_API_KEY` | Without these the agent drops into demo mode |
| Bitwarden / Secrets | `BW_CLIENTID`, `BW_CLIENTSECRET`, `BWS_ACCESS_TOKEN` | Needed for automation scripts + CI |
| Projects / GitHub | `PROJECTS_TOKEN`, `PROJECT_NUMBER`, GitHub App creds | Powers board automation + manifests |
| Integrations | `WORLDANVIL_API_KEY`, `SPOTIFY_CLIENT_ID/SECRET`, `TEC_ARCADIA_API_KEY`, `TEC_WPCOM_API_PASS` | Set only if using those services |
| Runtime Flags | `ENVIRONMENT`, `NODE_ENV`, `LOG_LEVEL`, `DEBUG` | dev=default; production flips logging |

Store them in `.env.local` (ignored) or Codespaces secrets UI.

---

## Bitwarden Mapping Template

Copy to `secrets-local/bw/mapping.json` and replace values with Bitwarden item names or IDs:

```json
{
  "OPENAI_API_KEY": "BW_ITEM_OPENAI",
  "PROJECTS_TOKEN": "BW_ITEM_PROJECTS",
  "TEC_WPCOM_API_PASS": "BW_ITEM_WP_PASS",
  "WORLDANVIL_API_KEY": "BW_ITEM_WORLDANVIL",
  "SPOTIFY_CLIENT_SECRET": "BW_ITEM_SPOTIFY",
  "NOTION_TOKEN": "BW_ITEM_NOTION"
}
```

Use `bw login --apikey`, `bw unlock --raw`, and set `BW_SESSION` before running the sync script.

---

## Secret Hygiene

- Rotate GitHub tokens every 90 days (`PROJECTS_TOKEN` expiry is tracked in Project Metadata doc).
- Treat anything that touched `_TRANSFER_STAGING` as compromised—rotate after this migration.
- Never paste secrets into chats or logs; keep them in `.env.local`, Codespace secrets, or Bitwarden.
- Use `git update-index --skip-worktree .env.local` if you’re paranoid about accidental commits.

---

## Validation

Run:

```bash
python scripts/development/check_env.py --file .env.local
```

The script fails if placeholders like `your-key` remain. CI replicates this check for PRs touching automation.
