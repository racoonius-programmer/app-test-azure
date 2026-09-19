import { createRoot } from 'react-dom/client';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { BrowserRouter } from 'react-router-dom';
import { msalConfig } from './authConfig';
import './index.css';
import App from './App';
const msal = new PublicClientApplication(msalConfig);
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <MsalProvider instance={msal}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </MsalProvider>,
);