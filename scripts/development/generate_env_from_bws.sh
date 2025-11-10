#!/usr/bin/env bash
set -euo pipefail
# Generate a local .env.local from Bitwarden Secrets Manager using mapping of env var -> secret id.
# Prereqs: bws (Bitwarden Secrets Manager CLI), jq. You must have a machine account access token saved
# in the environment variable BWS_ACCESS_TOKEN (recommended) or pass it via --access-token.

MAP_FILE=""
# Prefer secrets-local/bw (local, ignored) if present, otherwise fall back to tracked secrets/mapping.json
if [ -f "secrets-local/bw/mapping.json" ]; then
  MAP_FILE="secrets-local/bw/mapping.json"
elif [ -f "secrets/mapping.json" ]; then
  MAP_FILE="secrets/mapping.json"
else
  echo "ERROR: mapping file 'secrets-local/bw/mapping.json' or 'secrets/mapping.json' not found. Edit the mapping in one of those locations." >&2
  exit 1
fi
OUT_FILE=".env.local"

if ! command -v bws >/dev/null 2>&1; then
  echo "ERROR: Bitwarden Secrets Manager CLI 'bws' not found. Install from https://github.com/bitwarden/sdk" >&2
  exit 1
fi
if ! command -v jq >/dev/null 2>&1; then
  echo "ERROR: 'jq' not found. Install jq (e.g., apt install jq)" >&2
  exit 1
fi

if [ ! -f "$MAP_FILE" ]; then
  echo "ERROR: mapping file '$MAP_FILE' not found. Edit secrets/mapping.json to map env var -> Bitwarden secret id." >&2
  exit 1
fi

if [ -z "${BWS_ACCESS_TOKEN-}" ]; then
  echo "ERROR: BWS_ACCESS_TOKEN is not set. Create a machine account access token in Bitwarden Secrets Manager and export it as BWS_ACCESS_TOKEN." >&2
  exit 1
fi

echo "Generating $OUT_FILE from Bitwarden Secrets Manager using mapping $MAP_FILE"

# Backup existing out file
if [ -f "$OUT_FILE" ]; then
  cp "$OUT_FILE" "${OUT_FILE}.bak.$(date +%s)"
  echo "Backed up existing $OUT_FILE to ${OUT_FILE}.bak.$(date +%s)"
fi

> "$OUT_FILE"

jq -r 'to_entries[] | "\(.key)\u0000\(.value)"' "$MAP_FILE" | \
while IFS= read -r -d $'\0' entry; do
  VAR=${entry%%$'\u0000'*}
  SECRET_ID=${entry#*$'\u0000'}
  echo "Processing $VAR -> Bitwarden secret id '$SECRET_ID'"

  # Use bws to fetch secret JSON
  SECRET_JSON=$(bws secret get "$SECRET_ID" --output json)
  if [ -z "$SECRET_JSON" ] || [ "$SECRET_JSON" = "null" ]; then
    echo "WARNING: secret id '$SECRET_ID' not found or inaccessible. Skipping $VAR." >&2
    continue
  fi

  # Extract value (secrets have a 'value' field). If object, stringify
  VAL=$(printf "%s" "$SECRET_JSON" | jq -r '.value // empty')
  if [ -z "$VAL" ]; then
    # If no value field, try fields map
    VAL=$(printf "%s" "$SECRET_JSON" | jq -r 'if .entries then .entries[0].value else empty end')
  fi

  if [ -z "$VAL" ]; then
    echo "WARNING: no retrievable value for secret id '$SECRET_ID'. Skipping." >&2
    continue
  fi

  # Escape single quotes for safe single-quoted .env assignment
  ESC=$(printf "%s" "$VAL" | sed "s/'/'"'"'/g")
  printf "%s='%s'\n" "$VAR" "$ESC" >> "$OUT_FILE"
done

echo "Finished. $OUT_FILE created. Do NOT commit this file. Add necessary secrets to your secrets manager instead."
