#!/usr/bin/env bash
set -euo pipefail

# ============================================================
# OpenSolarCheck – Deploy Script
# Builds locally and syncs static files to Hetzner server
# ============================================================

# --- CONFIGURE THESE ---
SSH_TARGET="USER@SERVER_IP"        # e.g. root@123.45.67.89
REMOTE_DIR="/var/www/opensolarcheck"
# -----------------------

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}[1/4]${NC} Building..."
pnpm build

echo -e "${YELLOW}[2/4]${NC} Syncing to ${SSH_TARGET}:${REMOTE_DIR}..."
ssh "${SSH_TARGET}" "mkdir -p ${REMOTE_DIR}"
rsync -avz --delete out/ "${SSH_TARGET}:${REMOTE_DIR}/"

echo -e "${YELLOW}[3/4]${NC} Setting permissions..."
ssh "${SSH_TARGET}" "chown -R www-data:www-data ${REMOTE_DIR}"

echo -e "${YELLOW}[4/4]${NC} Reloading Nginx..."
ssh "${SSH_TARGET}" "nginx -t && systemctl reload nginx"

echo -e "${GREEN}Deployed!${NC} https://opensolarcheck.de"
