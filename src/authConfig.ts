import type { Configuration } from '@azure/msal-browser';

const runtimeConfig = window.RUNTIME_CONFIG;

export const msalConfig: Configuration = {
  auth: {
    clientId: runtimeConfig.VITE_SPA_CLIENT_ID,
    authority:
      'https://login.microsoftonline.com/' +
      runtimeConfig.VITE_ENTRA_TENANT_ID,
    redirectUri: window.location.origin + '/redirect.html',
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage',
  },
};

export const tokenRequest = {
  scopes: [
    `api://${runtimeConfig.VITE_API_CLIENT_ID}/access_as_user`,
  ],
};