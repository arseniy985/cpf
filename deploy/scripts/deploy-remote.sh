#!/usr/bin/env bash
set -euo pipefail

TARGET_HOST="${1:-sshtest}"
TARGET_DIR="${2:-/opt/cpf/app}"
TARGET_BRANCH="${3:-main}"
REPO_URL="${REPO_URL:-git@github.com:arseniy985/cpf.git}"
REPO_URL_FALLBACK="${REPO_URL_FALLBACK:-https://github.com/arseniy985/cpf.git}"

ssh "${TARGET_HOST}" "mkdir -p '${TARGET_DIR}'"

echo "Updating git checkout on ${TARGET_HOST}:${TARGET_DIR} ..."
ssh "${TARGET_HOST}" "bash -lc '
  set -euo pipefail
  if [[ ! -d \"${TARGET_DIR}/.git\" ]]; then
    if ! git clone --branch \"${TARGET_BRANCH}\" \"${REPO_URL}\" \"${TARGET_DIR}\"; then
      git clone --branch \"${TARGET_BRANCH}\" \"${REPO_URL_FALLBACK}\" \"${TARGET_DIR}\"
    fi
  else
    cd \"${TARGET_DIR}\"
    git fetch origin
    git checkout \"${TARGET_BRANCH}\"
    git pull --ff-only origin \"${TARGET_BRANCH}\"
  fi
  cd \"${TARGET_DIR}\"
  if [[ ! -f .env.production ]]; then
    cp .env.production.example .env.production
    echo \"Created .env.production from template. Fill real values before production traffic.\"
  fi
  docker compose -f deploy/docker/docker-compose.yml up -d --build
'"

echo "Deployment completed."
