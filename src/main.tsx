import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import keycloakConfig from './keycloak-config.ts';

// Initialized keycloak
keycloakConfig
  .init({ onLoad: 'login-required' })
  .then((authenticated: boolean) => {
    if (authenticated) {
      createRoot(document.getElementById('root')!).render(
        <StrictMode>
          <App />
        </StrictMode>
      );
    } else {
      keycloakConfig.login();
    }
  })
  .catch((error: unknown) => {
    console.error(error);
  });
