interface RuntimeConfig {
  VITE_SPA_CLIENT_ID: string;
  VITE_ENTRA_TENANT_ID: string;
  VITE_API_CLIENT_ID: string;
  VITE_BFF_BASE_URL: string;
}

interface Window {
  RUNTIME_CONFIG: RuntimeConfig;
}