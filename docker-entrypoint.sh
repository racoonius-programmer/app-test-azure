#!/bin/sh

cat <<EOF > /usr/share/nginx/html/config.js
window.RUNTIME_CONFIG = {
  VITE_SPA_CLIENT_ID: "${VITE_SPA_CLIENT_ID}",
  VITE_ENTRA_TENANT_ID: "${VITE_ENTRA_TENANT_ID}",
  VITE_API_CLIENT_ID: "${VITE_API_CLIENT_ID}",
  VITE_BFF_BASE_URL: "${VITE_BFF_BASE_URL}"
};
EOF

exec nginx -g "daemon off;"