FROM node:20-bookworm-slim AS frontend_assets
WORKDIR /var/www/html
COPY cpf-backend/package.json ./
RUN npm install --no-package-lock
COPY cpf-backend ./
RUN npm run build

FROM php:8.3-fpm-bookworm AS app
WORKDIR /var/www/html

COPY --from=composer:2.8 /usr/bin/composer /usr/bin/composer

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    git \
    unzip \
    libfreetype6-dev \
    libicu-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    libzip-dev \
  && docker-php-ext-configure gd --with-freetype --with-jpeg \
  && docker-php-ext-install -j"$(nproc)" \
    bcmath \
    exif \
    gd \
    intl \
    pcntl \
    pdo_mysql \
    zip \
  && pecl install redis \
  && docker-php-ext-enable redis opcache \
  && rm -rf /tmp/pear /var/lib/apt/lists/*

COPY deploy/docker/php/conf.d/app.ini /usr/local/etc/php/conf.d/99-app.ini
COPY deploy/docker/backend/entrypoint.sh /usr/local/bin/cpf-entrypoint
RUN chmod +x /usr/local/bin/cpf-entrypoint

COPY cpf-backend ./
RUN mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views storage/logs bootstrap/cache \
  && chown -R www-data:www-data storage bootstrap/cache
RUN composer install \
  --no-dev \
  --no-interaction \
  --no-progress \
  --prefer-dist \
  --optimize-autoloader

COPY --from=frontend_assets /var/www/html/public/build ./public/build

ENTRYPOINT ["cpf-entrypoint"]
CMD ["php-fpm"]
