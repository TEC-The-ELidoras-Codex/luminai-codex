#!/usr/bin/env bash
set -euo pipefail
# Generate a local .env.local from Bitwarden entries using a mapping file.
# Prereqs: bw (Bitwarden CLI), jq. You must be logged in to bw and have BW_SESSION set,
# or run `bw login --raw` when prompted.

MAP_FILE="secrets/mapping.json"
OUT_FILE=".env.local"

if [ -f "secrets-local/bw/mapping.json" ]; then
  MAP_FILE="secrets-local/bw/mapping.json"
elif [ -f "secrets/mapping.json" ]; then
  MAP_FILE="secrets/mapping.json"
else
  echo "ERROR: mapping file 'secrets-local/bw/mapping.json' or 'secrets/mapping.json' not found. Edit the mapping in one of those locations." >&2
  exit 1
fi

if ! command -v bw >/dev/null 2>&1; then
  echo "ERROR: Bitwarden CLI 'bw' not found. Install from https://bitwarden.com/help/cli/" >&2
  exit 1
fi
if ! command -v jq >/dev/null 2>&1; then
  echo "ERROR: 'jq' not found. Install jq (e.g., apt install jq)" >&2
  exit 1
fi

if [ ! -f "$MAP_FILE" ]; then
  echo "ERROR: mapping file '$MAP_FILE' not found. Edit secrets/mapping.json to map env var -> Bitwarden item name." >&2
  exit 1
fi

echo "Generating $OUT_FILE from Bitwarden using mapping $MAP_FILE"

# Backup existing out file
if [ -f "$OUT_FILE" ]; then
  cp "$OUT_FILE" "${OUT_FILE}.bak.$(date +%s)"
  echo "Backed up existing $OUT_FILE to ${OUT_FILE}.bak.$(date +%s)"
fi

> "$OUT_FILE"

# Ensure user is logged in (BW_SESSION present) or prompt for interactive login
if [ -z "${BW_SESSION-}" ]; then
  echo "BW_SESSION not set. Attempting interactive login..."
  export BW_SESSION=$(bw login --raw)
fi

jq -r 'to_entries[] | "\(.key)\u0000\(.value)"' "$MAP_FILE" | \
while IFS= read -r -d $'\0' entry; do
  VAR=${entry%%$'\u0000'*}
  ITEM_NAME=${entry#*$'\u0000'}
  echo "Processing $VAR -> Bitwarden item '$ITEM_NAME'"
  ITEM_JSON=$(bw list items --search "$ITEM_NAME" 2>/dev/null | jq -r '.[0] // {}')
  ITEM_ID=$(printf "%s" "$ITEM_JSON" | jq -r '.id // empty')
  if [ -z "$ITEM_ID" ]; then
    echo "WARNING: Bitwarden item named '$ITEM_NAME' not found. Skipping $VAR." >&2
    continue
  fi

  # Prefer password field (common), otherwise try first custom field value
  VAL=""
  VAL=$(bw get password "$ITEM_ID" 2>/dev/null || true)
  if [ -z "$VAL" ]; then
    VAL=$(bw get item "$ITEM_ID" | jq -r '.fields[]?.value // empty' | head -n1 || true)
  fi

  if [ -z "$VAL" ]; then
    echo "WARNING: no retrievable value for item '$ITEM_NAME' (id=$ITEM_ID). Skipping." >&2
    continue
  fi

  # Escape single quotes for safe single-quoted .env assignment
  ESC=$(printf "%s" "$VAL" | sed "s/'/'"'"'/g")
  printf "%s='%s'\n" "$VAR" "$ESC" >> "$OUT_FILE"
done

echo "Finished. $OUT_FILE created. Do NOT commit this file. Add necessary secrets to your secrets manager instead."
