import type { AccountInfo, IPublicClientApplication } from '@azure/msal-browser';

import { obtenerToken } from './token';

export async function fetchConToken(
  instance: IPublicClientApplication,
  account: AccountInfo,
  endpoint: string,
  options: RequestInit = {},
): Promise<Response> {

  const baseUrl =
    window.RUNTIME_CONFIG.VITE_BFF_BASE_URL?.replace(/\/$/, '');

  if (!baseUrl) {
    throw new Error('VITE_BFF_BASE_URL no está configurada');
  }

  const token = await obtenerToken(instance, account);

  if (!token.accessToken) {
    throw new Error('No se obtuvo access token');
  }

  const headers = new Headers(options.headers);

  headers.set('Authorization', `Bearer ${token.accessToken}`);

  const normalizedEndpoint =
    endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  return fetch(`${baseUrl}${normalizedEndpoint}`, {
    ...options,
    headers,
  });
}