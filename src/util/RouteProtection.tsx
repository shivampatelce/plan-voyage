import { ROUTE_PATH } from '@/consts/RoutePath';
import keycloak from '@/keycloak-config';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';

const RouteProtection = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!keycloak.authenticated) {
      navigate(ROUTE_PATH.HOME);
    }
  }, [navigate]);

  return <>{children}</>;
};

export default RouteProtection;
