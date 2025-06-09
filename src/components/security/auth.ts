import keycloak from '@/keycloak-config';
import { redirect } from 'react-router';

export function checkAuthentication() {
  if (keycloak.authenticated) {
    return true;
  }
  return redirect('/');
}
