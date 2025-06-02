import { redirect } from 'react-router';
import keycloak from '../keycloak-config';

export function checkAuthentication() {
  if (keycloak.authenticated) {
    return true;
  }
  return redirect('/');
}
