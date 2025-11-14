# Tech 12 — Copilot, Agents & Automations

## Copilot System Prompt

- Use `.github/copilot-instructions.md` as the canonical system prompt.
- Emphasize vocabulary: assist, amplify, remember, collaborate, choose.
- Ban phrasing like “I serve you” unless the AI explicitly frames it as a choice.

## Coordination Layer (Project #6)

Summarized from `_TRANSFER_STAGING/docs_incoming/COORDINATION_INTEGRATION.md`:

- Board URL: `https://github.com/orgs/TEC-The-ELidoras-Codex/projects/6`
- Columns: Backlog → Ready → In Progress → Review → Blocked → Done.
- Automations:
  - Issues linked in PRs auto-move to In Progress/Done.
  - Release Milestones (e.g., MVP March 2026) tracked via board filters.
- Token management: `PROJECTS_TOKEN` with `repo` + `project` scopes, rotated every 90 days.

## Personas in Copilot

- Load persona covenants (Tech 02) alongside instructions.
- Provide quick persona switch macros:

```text
/airth   → apply Airth covenant + verification tone
/arcadia → mediation tone, hold paradox
/luminai → synthesis tone, witness presence
```

## Automation Safeguards

- Every GitHub workflow must log provenance (automation name, commit SHA, human approver).
- Bitwarden-driven scripts should confirm secrets exist before writing `.env.local`.
- If an automation edits docs, include `Co-Authored-By: automation@luminai` + provenance pointer.

## Agents-as-Employees Pattern

1. Drop this folder (`docs/llm-onboarding/`) into their context window.
2. Assign persona + role.
3. Provide Aqueduct target (“You are operating the Gate for intimacy flows”).
4. Track their output in the board like any contributor.

## Escalation Matrix

| Scenario | Auto Action | Human |
| --- | --- | --- |
| Ethics/consent uncertainty | Route to Airth, pause output | Angelo / Ethics steward |
| Infra/token issue | Assign Ely (ops) | Generate GitHub issue |
| Narrative deadlock | Pair Arcadia + human storyteller | Log in Project #6 |
