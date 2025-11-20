---
title: Master Cleanup
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
- docs
related_docs: []
---

## Master Cleanup — how to run and why

Run the cleanup from WSL (recommended):
  cd /home/tec_tgcr/luminai-codex
  ./scripts/run_master_cleanup.sh --dry-run

From Windows PowerShell (calls wsl.exe explicitly):
  .\scripts\run_master_cleanup.ps1 -DryRun

Always inspect the dry-run report before applying changes.
