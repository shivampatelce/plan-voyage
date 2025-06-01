import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import keycloakConfig from './keycloak-config.ts';
import { RouterProvider } from 'react-router';
import router from './routes.tsx';

// Initialized keycloak
keycloakConfig
  .init({ onLoad: 'login-required' })
  .then((authenticated: boolean) => {
    if (authenticated) {
      createRoot(document.getElementById('root')!).render(
        <StrictMode>
          <RouterProvider router={router} />
        </StrictMode>
      );
    } else {
      keycloakConfig.login();
    }
  })
  .catch((error: unknown) => {
    console.error(error);
  });
