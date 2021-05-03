export const AuthenticatedView = ({ children, keycloak }) => {
  const authenticated = keycloak && keycloak.initialized && keycloak.authenticated;
  return authenticated ? children : null;
};

export const UnauthenticatedView = ({ children, keycloak }) => {
  const authenticated = keycloak && keycloak.initialized && keycloak.authenticated;
  return !authenticated ? children : null;
};
