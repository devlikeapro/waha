#!/bin/bash
set -e
echo "Starting WAHA..."

docker run -d \
    --restart=always \
    --name waha \
    -p 3000:3000/tcp \
    -v ./.sessions:/app/.sessions \
    -v ./.media:/app/.media \
    --env WHATSAPP_API_KEY=321 \
    --env WAHA_DASHBOARD_USERNAME=waha \
    --env WAHA_DASHBOARD_PASSWORD=waha \
    --env WAHA_LOG_FORMAT=JSON \
    --env WAHA_LOG_LEVEL=info \
    --env WHATSAPP_DEFAULT_ENGINE=WEBJS \
    --env WAHA_PRINT_QR=False \
    --env WHATSAPP_FILES_LIFETIME=0 \
    --env WHATSAPP_FILES_FOLDER=/app/.media \
    devlikeapro/waha-plus:latest

echo "WAHA started."
