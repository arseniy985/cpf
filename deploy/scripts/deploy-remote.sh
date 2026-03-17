#!/usr/bin/env bash
set -euo pipefail

TARGET_HOST="${1:-sshtest}"
TARGET_DIR="${2:-/opt/cpf/app}"
BRANCH="${3:-main}"
REPO_URL="${DEPLOY_REPO_URL:-https://github.com/arseniy985/cpf.git}"
SSH_COMMAND="${DEPLOY_SSH_COMMAND:-ssh}"
BACKUP_ROOT="${DEPLOY_BACKUP_ROOT:-$(dirname "${TARGET_DIR}")/backups}"

run_remote() {
  local remote_command="$1"

  if bash -ic "source ~/.bashrc >/dev/null 2>&1; alias ${TARGET_HOST}" >/dev/null 2>&1; then
    if bash -ic "source ~/.bashrc >/dev/null 2>&1; ${TARGET_HOST} ${remote_command@Q}"; then
      return
    fi
    echo "Alias '${TARGET_HOST}' failed, trying DEPLOY_SSH_COMMAND fallback..."
  fi

  ${SSH_COMMAND} "${TARGET_HOST}" "${remote_command}"
}

echo "Deploying ${REPO_URL}@${BRANCH} to ${TARGET_HOST}:${TARGET_DIR} ..."
run_remote "TARGET_DIR='${TARGET_DIR}' BRANCH='${BRANCH}' REPO_URL='${REPO_URL}' BACKUP_ROOT='${BACKUP_ROOT}' bash -s" <<'EOF'
set -euo pipefail

timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
compose_file="deploy/docker/docker-compose.yml"

backup_existing_tree() {
  local source_dir="$1"
  local backup_path="${BACKUP_ROOT}/cpf-${timestamp}.tar.gz"

  mkdir -p "${BACKUP_ROOT}"
  tar \
    --exclude='.git' \
    --exclude='.env.production' \
    --exclude='cpf-backend/.env.production' \
    -czf "${backup_path}" \
    -C "${source_dir}" .

  echo "Saved backup to ${backup_path}"
}

ensure_checkout() {
  mkdir -p "$(dirname "${TARGET_DIR}")"

  if [[ -d "${TARGET_DIR}/.git" ]]; then
    return
  fi

  if [[ -d "${TARGET_DIR}" ]] && [[ -n "$(find "${TARGET_DIR}" -mindepth 1 -maxdepth 1 -print -quit 2>/dev/null)" ]]; then
    local moved_dir="${BACKUP_ROOT}/cpf-raw-${timestamp}"
    mkdir -p "${BACKUP_ROOT}"
    mv "${TARGET_DIR}" "${moved_dir}"
    echo "Moved existing non-git directory to ${moved_dir}"
  fi

  rm -rf "${TARGET_DIR}"
  git clone --branch "${BRANCH}" "${REPO_URL}" "${TARGET_DIR}"
}

wait_for_backend() {
  local tries=0

  until docker compose -f "${compose_file}" exec -T backend php artisan migrate:status >/dev/null 2>&1; do
    tries=$((tries + 1))
    if (( tries > 30 )); then
      echo "Backend did not become ready in time."
      return 1
    fi
    sleep 3
  done
}

ensure_checkout

git config --global --add safe.directory "${TARGET_DIR}" >/dev/null 2>&1 || true

cd "${TARGET_DIR}"
git remote set-url origin "${REPO_URL}"

if [[ -n "$(git status --porcelain --untracked-files=all)" ]]; then
  backup_existing_tree "${TARGET_DIR}"
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

docker compose -f "${compose_file}" up -d --build --remove-orphans
wait_for_backend
docker compose -f "${compose_file}" exec -T backend php artisan optimize:clear || true
docker compose -f "${compose_file}" exec -T backend php artisan migrate --force
docker compose -f "${compose_file}" exec -T backend php artisan optimize
docker compose -f "${compose_file}" ps
EOF

echo "Deployment completed."
