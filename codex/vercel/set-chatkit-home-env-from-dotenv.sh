#!/usr/bin/env bash
set -euo pipefail

# 🎭 ChatKit Home Env Ritual — “Set secrets, spill none.” 🤫✨
#
# This script sets env vars for the **codex/chatkit-home** Vercel project
# by reading the repo-root `.env`, without printing secret values.
#
# Usage:
#   ./codex/vercel/set-chatkit-home-env-from-dotenv.sh production
#   ./codex/vercel/set-chatkit-home-env-from-dotenv.sh preview
#
# Required keys in `.env`:
# - OPENAI_API_KEY
# - CHATKIT_WORKFLOW_ID
#
# (Whimsy) 🧙‍♂️: The secrets go *in*, but they do not come *out*.

TARGET="${1:-production}"
if [[ "$TARGET" != "production" && "$TARGET" != "preview" && "$TARGET" != "development" ]]; then
  echo "Expected target: production | preview | development"
  exit 2
fi

PROJECT_DIR="codex/chatkit-home"
PROJECT_JSON="$PROJECT_DIR/.vercel/project.json"
DOTENV_FILE=".env"

if [[ ! -f "$PROJECT_JSON" ]]; then
  echo "Missing $PROJECT_JSON (project not linked). Run: (cd $PROJECT_DIR && vercel link --yes)"
  exit 1
fi

if [[ ! -f "$DOTENV_FILE" ]]; then
  echo "Missing .env at repo root."
  exit 1
fi

TEAM_ID="$(python3 - <<'PY'
import json
with open("codex/chatkit-home/.vercel/project.json","r",encoding="utf-8") as f:
  print(json.load(f)["orgId"])
PY
)"

read_dotenv_var() {
  local key="$1"
  python3 - <<PY
key = ${key!r}
value = None
with open(${DOTENV_FILE!r},"r",encoding="utf-8") as f:
  for line in f:
    line=line.strip()
    if not line or line.startswith("#") or "=" not in line:
      continue
    k, v = line.split("=", 1)
    if k.strip() != key:
      continue
    v=v.strip().strip('"').strip("'").strip()
    value=v or None
    break
if not value:
  raise SystemExit(3)
print(value, end="")
PY
}

set_vercel_env() {
  local key="$1"
  local sensitive_flag="${2:-}"

  if ! read_dotenv_var "$key" >/dev/null 2>&1; then
    echo "Skipping $key: not found in $DOTENV_FILE"
    return 0
  fi

  echo "Setting $key ($TARGET)…"
  read_dotenv_var "$key" | vercel env add "$key" "$TARGET" --yes --force ${sensitive_flag} --scope "$TEAM_ID" --cwd "$PROJECT_DIR"
}

set_vercel_env "OPENAI_API_KEY" "--sensitive"
set_vercel_env "CHATKIT_WORKFLOW_ID"

echo "🎉 Done. Re-deploy to apply env changes: (cd $PROJECT_DIR && vercel --prod)"

