#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "${ROOT_DIR}"

BRANCH="${DEPLOY_BRANCH:-main}"
TARGET_HOST="${DEPLOY_TARGET_HOST:-sshtest}"
TARGET_DIR="${DEPLOY_TARGET_DIR:-/opt/cpf/app}"
COMMIT_MESSAGE="${1:-chore(deploy): sync $(date -u +%Y-%m-%dT%H:%M:%SZ)}"

current_branch="$(git rev-parse --abbrev-ref HEAD)"
if [[ "${current_branch}" != "${BRANCH}" ]]; then
  echo "Current branch is '${current_branch}', expected '${BRANCH}'. Switch branch or set DEPLOY_BRANCH."
  exit 1
fi

if [[ -n "$(git status --porcelain --untracked-files=all)" ]]; then
  git_add_args=(-A .)
  if [[ "${DEPLOY_INCLUDE_OUTPUT:-0}" != "1" ]]; then
    git_add_args+=(":(exclude)output")
  fi

  git add "${git_add_args[@]}"

  if git diff --cached --quiet; then
    echo "No committable changes after exclusions. Skipping commit."
  else
    git commit -m "${COMMIT_MESSAGE}"
  fi
else
  echo "Working tree is clean. Skipping commit."
fi

git push origin "${BRANCH}"
bash deploy/scripts/deploy-remote.sh "${TARGET_HOST}" "${TARGET_DIR}" "${BRANCH}"
