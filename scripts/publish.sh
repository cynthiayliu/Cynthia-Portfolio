#!/usr/bin/env bash
set -euo pipefail

message="${1:-Update portfolio site}"

npm run build

git add -A

if git diff --cached --quiet; then
  echo "Nothing to commit."
  exit 0
fi

git commit -m "$message"
git push origin main
