import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import keycloak from './keycloak-config.ts';
import { RouterProvider } from 'react-router';
import router from './routes.tsx';

// Initialized keycloak
keycloak
  .init({ onLoad: 'check-sso' })
  .then(() => {
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <RouterProvider router={router} />
      </StrictMode>
    );
  })
  .catch((error: unknown) => {
    console.error(error);
  });
