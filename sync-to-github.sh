#!/usr/bin/env bash
set -euo pipefail

# Simple helper to commit all local changes and push to GitHub.
# Usage:
#   ./sync-to-github.sh "My commit message"
# If no message is provided, a default message is used.

cd "$(git rev-parse --show-toplevel)"

if git diff --quiet --ignore-submodules --cached && git diff --quiet --ignore-submodules; then
  echo "Nothing to commit."
  git push origin HEAD
  exit 0
fi

MESSAGE=${1:-"Auto-sync changes"}

git add -A

if git diff --quiet --ignore-submodules --cached; then
  echo "No changes to commit after staging."
else
  git commit -m "$MESSAGE"
fi

git push origin HEAD
