#!/usr/bin/env bash
set -euo pipefail

if [[ "${EUID}" -ne 0 ]]; then
  echo "Run as root: sudo bash deploy/scripts/install-nginx-config.sh [http|https]"
  exit 1
fi

MODE="${1:-https}"
SITE_NAME="cpf.elifsyndicate.online.test.conf"
HTTP_BOOTSTRAP_NAME="cpf.elifsyndicate.online.test.http.conf"

install -d /etc/nginx/snippets
cp -f deploy/nginx/snippets/acme-challenge.conf /etc/nginx/snippets/acme-challenge.conf
cp -f deploy/nginx/snippets/proxy_nextjs.conf /etc/nginx/snippets/proxy_nextjs.conf
cp -f deploy/nginx/snippets/ssl-params.conf /etc/nginx/snippets/ssl-params.conf

if [[ "${MODE}" == "http" ]]; then
  cp -f "deploy/nginx/sites-available/${HTTP_BOOTSTRAP_NAME}" "/etc/nginx/sites-available/${SITE_NAME}"
else
  cp -f "deploy/nginx/sites-available/${SITE_NAME}" "/etc/nginx/sites-available/${SITE_NAME}"
fi

ln -sfn "/etc/nginx/sites-available/${SITE_NAME}" "/etc/nginx/sites-enabled/${SITE_NAME}"
nginx -t
systemctl reload nginx

echo "Nginx config installed in '${MODE}' mode."
