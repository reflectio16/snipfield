#!/usr/bin/env bash
# Set up snipfield on a fresh machine (school or home).
# Usage: ./setup.sh

set -euo pipefail

cd "$(dirname "$0")"

echo "==> Starting Podman socket (if available)"
systemctl --user start podman.socket 2>/dev/null || true

echo "==> Creating backend/.env (if missing)"
if [ ! -f backend/.env ]; then
  cp backend/.env.example backend/.env
fi

echo "==> Installing backend dependencies"
(cd backend && npm ci)

echo "==> Starting Postgres"
docker compose up -d

echo "==> Waiting for Postgres"
tries=0
until docker exec snipfield-db pg_isready -U snipfield >/dev/null 2>&1; do
  tries=$((tries + 1))
  if [ "$tries" -ge 30 ]; then
    echo "Postgres did not start after 30 seconds" >&2
    exit 1
  fi
  sleep 1
done

echo "==> Applying migrations"
(cd backend && npx prisma migrate deploy && npx prisma generate)

echo "==> Done. Start the backend with: cd backend && npm run start:dev"