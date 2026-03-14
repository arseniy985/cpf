#!/usr/bin/env bash
set -euo pipefail

TARGET_DIR="${1:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"
BRANCH="${2:-main}"
REPO_URL="${DEPLOY_REPO_URL:-$(git -C "${TARGET_DIR}" config --get remote.origin.url 2>/dev/null || true)}"
BACKUP_ROOT="${DEPLOY_BACKUP_ROOT:-$(dirname "${TARGET_DIR}")/backups}"
COMPOSE_FILE="deploy/docker/docker-compose.yml"
timestamp="$(date -u +%Y%m%dT%H%M%SZ)"

if [[ -z "${REPO_URL}" ]]; then
  echo "Unable to determine repository URL. Set DEPLOY_REPO_URL or configure origin."
  exit 1
fi

backup_existing_tree() {
  local backup_path="${BACKUP_ROOT}/cpf-${timestamp}.tar.gz"

  mkdir -p "${BACKUP_ROOT}"
  tar \
    --exclude='.git' \
    --exclude='.env.production' \
    --exclude='cpf-backend/.env.production' \
    -czf "${backup_path}" \
    -C "${TARGET_DIR}" .

  echo "Saved backup to ${backup_path}"
}

wait_for_backend() {
  local tries=0

  until docker compose -f "${COMPOSE_FILE}" exec -T backend php artisan migrate:status >/dev/null 2>&1; do
    tries=$((tries + 1))
    if (( tries > 30 )); then
      echo "Backend did not become ready in time."
      return 1
    fi
    sleep 3
  done
}

git config --global --add safe.directory "${TARGET_DIR}" >/dev/null 2>&1 || true

cd "${TARGET_DIR}"
git remote set-url origin "${REPO_URL}"

if [[ -n "$(git status --porcelain --untracked-files=all)" ]]; then
  backup_existing_tree
fi

git fetch origin "${BRANCH}" --prune
git clean -fd
git reset --hard
git checkout -B "${BRANCH}" "origin/${BRANCH}"
git reset --hard "origin/${BRANCH}"

if [[ ! -f ".env.production" ]]; then
  cp .env.production.example .env.production
  echo "Created ${TARGET_DIR}/.env.production from template. Fill real values and rerun."
  exit 1
fi

if [[ ! -f "cpf-backend/.env.production" ]]; then
  cp cpf-backend/.env.production.example cpf-backend/.env.production
  echo "Created ${TARGET_DIR}/cpf-backend/.env.production from template. Fill real values and rerun."
  exit 1
fi

set -a
. ./.env.production
. ./cpf-backend/.env.production
set +a

docker compose -f "${COMPOSE_FILE}" up -d --build --remove-orphans
wait_for_backend
docker compose -f "${COMPOSE_FILE}" exec -T backend php artisan optimize:clear || true
docker compose -f "${COMPOSE_FILE}" exec -T backend php artisan migrate --force
docker compose -f "${COMPOSE_FILE}" exec -T backend php artisan optimize
docker compose -f "${COMPOSE_FILE}" ps
