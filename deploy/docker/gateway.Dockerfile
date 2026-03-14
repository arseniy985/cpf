FROM node:20-bookworm-slim AS frontend_assets
WORKDIR /var/www/html
COPY cpf-backend/package.json ./
RUN npm install --no-package-lock
COPY cpf-backend ./
RUN npm run build

FROM nginx:1.27-alpine
WORKDIR /var/www/backend

COPY cpf-backend/public ./public
COPY --from=frontend_assets /var/www/html/public/build ./public/build
COPY deploy/docker/nginx/app.conf /etc/nginx/conf.d/default.conf
COPY deploy/nginx/snippets/proxy_nextjs.conf /etc/nginx/snippets/proxy_nextjs.conf

RUN mkdir -p /var/www/backend/storage/app/public \
  && ln -s /var/www/backend/storage/app/public /var/www/backend/public/storage
