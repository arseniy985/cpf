#!/usr/bin/env bash
set -euo pipefail

if [[ "${EUID}" -ne 0 ]]; then
  echo "Run as root: sudo bash deploy/scripts/issue-cert.sh <email>"
  exit 1
fi

EMAIL="${1:-}"
if [[ -z "${EMAIL}" ]]; then
  echo "Email is required."
  exit 1
fi

mkdir -p /var/www/_letsencrypt

certbot certonly \
  --webroot \
  -w /var/www/_letsencrypt \
  -d cpf.elifsyndicate.online \
  -d www.cpf.elifsyndicate.online \
  --email "${EMAIL}" \
  --agree-tos \
  --non-interactive

echo "Certificate issued."
