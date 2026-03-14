#!/bin/sh
set -eu

cd /var/www/html

if [ -z "${APP_KEY:-}" ]; then
  echo "APP_KEY is required for production startup." >&2
  exit 1
fi

mkdir -p \
  storage/app/private \
  storage/app/public \
  storage/framework/cache \
  storage/framework/sessions \
  storage/framework/views \
  storage/logs \
  bootstrap/cache

chown -R www-data:www-data storage bootstrap/cache

if [ ! -L public/storage ]; then
  php artisan storage:link || true
fi

if [ "${1:-}" = "php-fpm" ]; then
  php artisan migrate --force
  php artisan optimize
fi

exec "$@"
