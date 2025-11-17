# Security Note: Secret Transcript Archival & History Remediation Guidance

**Date:** 2025-11-16  
**Context:** A transient session log file (`DELETE)MEAFTER`) containing full API credentials was committed. Secrets have been rotated and the file replaced with a sanitized archive: `docs/archive/SESSION_LOG_SECRET_ROTATION.md`.

## What Happened

A conversational debugging file captured real environment secrets (OpenAI, Anthropic, xAI, GitHub PAT, Bitwarden). Though the application code never referenced these directly, the plain text tokens entered git history.

## Current Status

| Item | Status |
|------|--------|
| Incriminated file removed | ✅ Deleted from working tree |
| Sanitized replacement added | ✅ `docs/archive/SESSION_LOG_SECRET_ROTATION.md` |
| Tokens rotated/revoked | ✅ All listed providers rotated |
| .gitignore hardened | ✅ Added `*.pdf:Zone.Identifier`, transient log pattern |
| Pre-commit secret scanning | ✅ Configured (`.pre-commit-config.yaml`) |
| CI secret scanning | ✅ GitHub Actions workflow added |
| History purge | ⏳ Optional (strongly advised) |

## Recommended Actions (Priority Order)

1. ✅ (Done) Rotate all keys appearing in committed log.  
2. ✅ (Done) Implement secret scanning pre-commit (configured via `.pre-commit-config.yaml`).  
3. ✅ (Done) Run CI secret scanning via GitHub Actions (`.github/workflows/secret-scan.yml`).  
4. Purge historical secret exposure (see below).  
5. Add automated nightly drift scan (optional).

## Pre-Commit Secret Scanning (Configured)

The repository now uses `pre-commit` with:

- **detect-secrets**: Scans for secrets with baseline tracking (`.secrets.baseline`)
- **gitleaks**: Entropy-based credential detection
- **detect-private-key**: Catches PEM/SSH keys

### Usage

Install and activate hooks:

```bash
# Install pre-commit (already in requirements.txt)
pip install pre-commit

# Install git hooks
pre-commit install

# Run manually on all files
pre-commit run --all-files

# Update baseline (after auditing new findings)
detect-secrets scan --exclude-files '\.env\.example$|package-lock\.json$|docs/.*|tests/.*\.json$' > .secrets.baseline
```

The hooks run automatically on `git commit`. To bypass in emergencies (not recommended):

```bash
git commit --no-verify
```

### CI Integration

GitHub Actions workflow (`.github/workflows/secret-scan.yml`) runs on:

- Every PR to `main`/`develop`
- Direct pushes to protected branches
- Manual workflow dispatch

Checks include:

- Gitleaks full scan
- detect-secrets validation
- Custom regex patterns for OpenAI/Anthropic/xAI/GitHub tokens  

## Purging Secrets From History (git filter-repo)

The removed file still exists in previous commits. To fully excise:

```bash
# Install
pip install git-filter-repo  # or brew install git-filter-repo

# Backup remote
git clone --mirror <repo-url> luminai-codex-mirror-backup

# From repo root
git filter-repo --path DELETE)MEAFTER --invert-paths

# Verify removal
git log --stat | grep -i DELETE)MEAFTER || echo "Path purged"

# Force push (after team approval)
git push --force-with-lease origin main
```

Notify collaborators to re-clone (safer) or hard reset:

```bash
git fetch --all --prune
git reset --hard origin/main
```

## Minimal Regex Set for Pre-Commit

Embed in `.git/hooks/pre-commit` (executable):

```bash
#!/usr/bin/env bash
set -euo pipefail
PATTERNS=("sk-proj-" "sk-ant-" "xai-" "github_pat_" "-----BEGIN PRIVATE KEY-----")
FILES=$(git diff --cached --name-only)
for f in $FILES; do
  [ -f "$f" ] || continue
  for p in "${PATTERNS[@]}"; do
    if grep -q "$p" "$f"; then
      echo "[SECURITY] Potential secret pattern '$p' in $f" >&2
      echo "Commit aborted." >&2
      exit 1
    fi
  done
done
exit 0
```

(Enhance later with entropy checks or adopt `gitleaks`.)

## Future Hardening

| Measure | Benefit |
|---------|---------|
| Central Secret Inventory (JSON manifest) | Drift detection / audit trail |
| CI Diff Secret Scan | Catches missed local checks |
| TruffleHog / Gitleaks | Broad pattern + entropy detection |
| Automatic Key Vault Rotation Script | Reduces human delay |
| Sensitive Doc Labeling (`SEC:` prefix) | Easier review filtering |

## Verification After Purge

Run:

```bash
gitleaks detect --redact
```

Also manually search:

```bash
grep -R "sk-proj-" -n . || echo "No OpenAI project keys"
grep -R "github_pat_" -n . || echo "No GitHub PATs"
```

## Incident Classification

| Dimension | Assessment |
|-----------|------------|
| Exposure Vector | Accidental commit of local transcript |
| Data Sensitivity | High (live API credentials) |
| Exploitability | Moderate (public repo until rotation) |
| Mitigation Speed | Fast (rotation immediate) |
| Residual Risk | History retention until purge |

## Decision Log

- Rotation prioritized over immediate history rewrite to eliminate active risk.
- Sanitization chosen to preserve operational context for future prevention.
- Deferred pre-commit hook & CI secret scanning for follow-up PR.

---
**Owner:** Security steward (Airth / Ely composite)  
**Contact:** <security@luminai-codex.dev>  
**Next Review:** In 7 days or post history purge.
