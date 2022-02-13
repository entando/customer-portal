import {ADMIN, SUPPORT, CUSTOMER, PARTNER} from './constants';

export const getKeycloakToken = () => {
  if (window && window.entando && window.entando.keycloak && window.entando.keycloak.authenticated) {
    return window.entando.keycloak.token;
  }
  return '';
};

export const isAuthenticated = props => {
  const {keycloak} = props;
  return keycloak.initialized && keycloak.authenticated;
};

export const authenticationChanged = (props, prevProps) => {
  const authenticated = isAuthenticated(props);
  const changedAuth = prevProps.keycloak.authenticated !== authenticated;
  return authenticated && changedAuth;
};

export const isPortalAdmin = () => {
  return hasKeycloakClientRole(ADMIN);
};

export const isPortalSupport = () => {
  return hasKeycloakClientRole(SUPPORT);
};

export const isPortalPartner = () => {
  return hasKeycloakClientRole(PARTNER);
};

export const isPortalCustomer = () => {
  return hasKeycloakClientRole(CUSTOMER);
};

export const isPortalAdminOrSupport = () => {
  return isPortalAdmin() || isPortalSupport();
};

export const isPortalCustomerOrPartner = () => {
  return isPortalCustomer() || isPortalPartner();
};

export const isPortalUser = () => {
  return isPortalAdminOrSupport() || isPortalCustomerOrPartner();
};

export const hasKeycloakClientRole = clientRole => {
  if (getKeycloakToken()) {
    const { resourceAccess } = window.entando.keycloak;
    if (resourceAccess) {
      for (const client in resourceAccess) {
        const item = resourceAccess[client];
        if (item.roles && item.roles.includes(clientRole)) {
          // console.debug("Found role {} with client {} ", clientRole, client);
          return true;
        }
      }
    }
  }
  return false;
};

export const getDefaultOptions = () => ({
  headers: new Headers({
    Authorization: `Bearer ${getKeycloakToken()}`,
    'Content-Type': 'application/json',
  }),
});

export const getDefaultKeycloakOptions = () => ({
  headers: new Headers({
    Authorization: `Bearer ${getKeycloakToken()}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  }),
});

export const getActiveSubscription = project => {
  return (
    project &&
    project.projectSubscriptions &&
    project.projectSubscriptions.find(item => {
      return item.status === 'ACTIVE' ? item : null;
    })
  );
};

//Expected resourceUrl - <@wp.resourceURL /> = /entando-de-app/cmsresources/ or /cmsresources/
export const setAppContext = resourceUrl => {
  const index = resourceUrl.indexOf('cmsresources');
  const cp = {
    appContext: '/'
  }
  if (index > 0) {
    cp.appContext = resourceUrl.substring(0, index)
  }
  window.entando = {
    ...(window.entando || {}),
    cp,
  };
}

export const getPageUrl = (pageCode, locale) => {
  var appContext = window.entando.cp.appContext;
  const url = `${appContext}${locale}/${pageCode}`;
  return getUrl(url);
}

export const getUrl = url => {
  return `${url}`;
};

export const request = async (url, options) => {
  const response = await fetch(url, options);

  const headers = {
    ...(response.headers.has('X-Total-Count') ? {'X-Total-Count': parseInt(response.headers.get('X-Total-Count'), 10)} : {}),
  };

  if (response.status === 204) {
    return { data: '', status: response.status };
  }

  return response.status >= 200 && response.status < 300
    ? { data: await response.json(), headers, status: response.status }
    : Promise.reject(new Error(response.statusText || response.status));
};
