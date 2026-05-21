# Deploy guide (Ubuntu VPS, Docker, HTTPS)

This deploys backend (FastAPI), frontend (Next.js), Postgres, nginx and
certbot to a single VPS via `docker compose`.

## 0. Prerequisites

- Ubuntu 22.04/24.04 server with public IP
- Domain pointed to the server's IP (`A`-record for `example.com`, optionally `www.example.com`)
- SSH access as a user with `sudo`

## 1. Install Docker

```bash
sudo apt update && sudo apt -y upgrade
sudo apt -y install ca-certificates curl gnupg git

sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt -y install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

sudo usermod -aG docker $USER
newgrp docker
```

Verify:

```bash
docker --version
docker compose version
```

## 2. Clone the repo

```bash
cd /opt
sudo mkdir losboard && sudo chown $USER:$USER losboard
cd losboard
git clone <your-repo-url> .
```

## 3. Configure environment

```bash
cp .env.example .env
nano .env
```

Fill **everything**:

- `POSTGRES_PASSWORD` — long random string
- `JWT_SECRET_KEY` — long random string (`openssl rand -hex 32`)
- `CORS_ORIGINS` — `https://example.com` (your actual domain)
- `NEXT_PUBLIC_API_BASE_URL` — `https://example.com/api/` (browser-facing backend URL)
- `DOMAIN` — `example.com`
- `CERTBOT_EMAIL` — email for Let's Encrypt expiration notices

> `NEXT_PUBLIC_API_BASE_URL` is baked into the frontend build at image build time.
> If you change it later, you must rebuild the `frontend` image.

## 4. Bootstrap nginx (HTTP only, for the first cert)

```bash
cp nginx/conf.d/bootstrap.conf.template nginx/conf.d/app.conf
sed -i "s/example.com/$(grep ^DOMAIN .env | cut -d= -f2)/g" nginx/conf.d/app.conf
```

Bring up just postgres + backend + frontend + nginx (no SSL yet):

```bash
docker compose up -d postgres backend frontend
docker compose up -d nginx
```

Watch logs:

```bash
docker compose logs -f backend
```

Wait for `Application startup complete.`

## 5. Issue the first SSL cert

Replace `example.com` and `you@example.com` with your real values:

```bash
docker compose run --rm certbot certonly \
  --webroot --webroot-path=/var/www/certbot \
  --email you@example.com --agree-tos --no-eff-email \
  -d example.com -d www.example.com
```

If both domains succeed, you'll see `Successfully received certificate.`

## 6. Switch nginx to the SSL config

```bash
cp nginx/conf.d/app.conf.template nginx/conf.d/app.conf
sed -i "s/example.com/$(grep ^DOMAIN .env | cut -d= -f2)/g" nginx/conf.d/app.conf

docker compose restart nginx
docker compose up -d certbot
```

Visit `https://example.com` — site should work, with valid certificate.

## 7. Day-to-day operations

### Update code

```bash
cd /opt/losboard
git pull
docker compose build backend frontend
docker compose up -d
```

Backend container automatically runs `alembic upgrade head` on every start —
new migrations apply automatically.

### View logs

```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f nginx
```

### Run an Alembic command manually

```bash
docker compose exec backend alembic current
docker compose exec backend alembic history
docker compose exec backend alembic upgrade head
docker compose exec backend alembic downgrade -1
```

### Open a psql shell

```bash
docker compose exec postgres psql -U $POSTGRES_USER -d $POSTGRES_DB
```

### Backup the database

```bash
docker compose exec -T postgres \
  pg_dump -U $POSTGRES_USER -d $POSTGRES_DB \
  | gzip > backup-$(date +%F).sql.gz
```

### Restore a backup

```bash
gunzip -c backup-2026-01-01.sql.gz \
  | docker compose exec -T postgres psql -U $POSTGRES_USER -d $POSTGRES_DB
```

### Restart everything

```bash
docker compose down
docker compose up -d
```

### Stop everything (without removing volumes)

```bash
docker compose stop
```

### Wipe and rebuild from scratch

```bash
docker compose down -v   # NOTE: -v removes volumes, including DB data
docker compose up -d --build
```

## 8. Certificate renewal

The `certbot` container runs a loop that calls `certbot renew` every 12 hours.
Let's Encrypt only actually renews when the cert is within 30 days of expiry,
so this is safe to leave running.

After a renewal, nginx needs to reread the cert. The simplest way is a daily
nginx reload (cron on the host):

```bash
crontab -e
```

Add:

```
0 4 * * * cd /opt/losboard && /usr/bin/docker compose exec nginx nginx -s reload >/dev/null 2>&1
```

## 9. Common gotchas

- **`502 Bad Gateway` on the site** — the `backend` or `frontend` container isn't up. `docker compose ps` and `docker compose logs <service>`.
- **`ECONNREFUSED` on register/login** — frontend was built with the wrong `NEXT_PUBLIC_API_BASE_URL`. Edit `.env`, then `docker compose build frontend && docker compose up -d frontend`.
- **CORS errors** in the browser — make sure `CORS_ORIGINS` in `.env` matches the exact origin the browser sends, including scheme.
- **Uploads disappear after redeploy** — uploads live in the `backend_uploads` named volume. `docker compose down -v` will wipe them. Use `docker compose down` (without `-v`) for code updates.
- **Certbot fails with "Connection refused"** — DNS not pointing at the server yet, or nginx isn't serving `/.well-known/acme-challenge/`. Verify with `curl http://example.com/.well-known/acme-challenge/test` returns nginx, not a connection error.
