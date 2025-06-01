import { redirect } from 'react-router';
import keycloakConfig from '../keycloak-config';

export function checkAuthentication() {
  if (keycloakConfig.authenticated) {
    return true;
  }
  return redirect('/');
}
