#!/usr/bin/env bash
set -euo pipefail

# Script de synchronisation sécurisé vers GitHub pour ELLYSIUM
cd "$(git rev-parse --show-toplevel)"

if git diff --quiet --ignore-submodules --cached && git diff --quiet --ignore-submodules; then
  echo "Aucune modification à commiter."
  if [ -n "${GITHUB_TOKEN:-}" ]; then
    AUTH_HEADER="AUTHORIZATION: basic $(printf "x-access-token:%s" "$GITHUB_TOKEN" | base64 -w 0)"
    git -c "http.extraHeader=$AUTH_HEADER" push origin HEAD
  else
    git push origin HEAD
  fi
  exit 0
fi

MESSAGE=${1:-"Auto-sync changes"}

git add -A

if git diff --quiet --ignore-submodules --cached; then
  echo "Aucune modification à commiter après staging."
else
  git commit -m "$MESSAGE"
fi

if [ -n "${GITHUB_TOKEN:-}" ]; then
  AUTH_HEADER="AUTHORIZATION: basic $(printf "x-access-token:%s" "$GITHUB_TOKEN" | base64 -w 0)"
  git -c "http.extraHeader=$AUTH_HEADER" push origin HEAD
else
  git push origin HEAD
fi
