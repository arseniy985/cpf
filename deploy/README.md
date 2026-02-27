# CPF test deployment

This setup runs the app in Docker and keeps NGINX on the host machine.

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

## 2. Start app container from git checkout

```bash
bash deploy/scripts/deploy-remote.sh sshtest /opt/cpf/app main
```

`deploy-remote.sh` will clone/pull from `git@github.com:arseniy985/cpf.git` on the server.

## 3. Install HTTP-only NGINX config (for first cert issue)

```bash
ssh sshtest
cd /opt/cpf/app
sudo bash deploy/scripts/install-nginx-config.sh http
```

## 4. Issue certificate

```bash
ssh sshtest
cd /opt/cpf/app
sudo bash deploy/scripts/issue-cert.sh your-email@example.com
```

## 5. Enable final HTTPS config

```bash
ssh sshtest
cd /opt/cpf/app
sudo bash deploy/scripts/install-nginx-config.sh https
```

## 6. Renewal check

```bash
ssh sshtest
sudo certbot renew --dry-run
```

## Add more domains later

1. Copy `deploy/nginx/sites-available/cpf.elifsyndicate.online.test.conf` into a new file.
2. Change `server_name`, certificate paths and upstream port.
3. Add/renew certificate for new domain.
4. Enable config in `/etc/nginx/sites-enabled/` and reload NGINX.
