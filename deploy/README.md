# CPF production deployment

This setup runs the full stack in Docker:

- `gateway` for internal HTTP routing
- `frontend` with Next.js standalone
- `backend` with Laravel 12 + Filament
- `queue` worker
- `scheduler`
- `mysql`
- `redis`

TLS termination and certificate renewal stay on the host machine via NGINX + Certbot.

## 1. Bootstrap clean Debian server

```bash
ssh sshtest
sudo mkdir -p /opt/cpf/app
sudo chown -R "$USER":"$USER" /opt/cpf
cd /opt/cpf
git clone git@github.com:arseniy985/cpf.git app
cd app
sudo bash deploy/scripts/bootstrap-debian.sh
```

## 2. Prepare production env files on the server

```bash
ssh sshtest
cd /opt/cpf/app
cp .env.production.example .env.production
cp cpf-backend/.env.production.example cpf-backend/.env.production
```

Fill both files with real production values before the first deploy.

## 3. Deploy the latest `main` from GitHub

```bash
bash deploy/scripts/deploy-remote.sh sshtest /opt/cpf/app
```

This script:

- connects to the server over SSH;
- backs up the current dirty worktree into `/opt/cpf/backups` if needed;
- resets `/opt/cpf/app` to `origin/main`;
- rebuilds and restarts the Docker stack;
- runs Laravel migrations and cache optimization.

If you prefer running the update directly on the server:

```bash
cd /opt/cpf/app
bash deploy/scripts/update-server.sh /opt/cpf/app main
```

## 4. Install HTTP-only NGINX config for the first certificate issue

```bash
ssh sshtest
cd /opt/cpf/app
sudo bash deploy/scripts/install-nginx-config.sh http
```

## 5. Issue certificate

```bash
ssh sshtest
cd /opt/cpf/app
sudo bash deploy/scripts/issue-cert.sh your-email@example.com
```

## 6. Enable final HTTPS config

```bash
ssh sshtest
cd /opt/cpf/app
sudo bash deploy/scripts/install-nginx-config.sh https
```

## 7. Renewal check

```bash
ssh sshtest
sudo certbot renew --dry-run
```

## Add more domains later

1. Copy `deploy/nginx/sites-available/cpf.elifsyndicate.online.conf` into a new file.
2. Change `server_name`, certificate paths and upstream port.
3. Add/renew certificate for new domain.
4. Enable config in `/etc/nginx/sites-enabled/` and reload NGINX.
