import Keycloak from 'keycloak-js';

const keycloakConfig = new Keycloak({
  url: 'http://localhost:8081/',
  realm: 'plan-voyage',
  clientId: 'plan-voyage-client',
});

export default keycloakConfig;
