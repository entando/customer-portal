import { getDefaultOptions, getDefaultKeycloakOptions, request, getUrl } from './helpers';

const usersResourceProd = 'admin/realms/jhipster/users'
//const usersResourceDev = 'admin/realms/jhipster/users'
const tokenResourceProd = 'realms/entando/jhipster/openid-connect/token';
//const tokenResourceDev = 'realms/jhipster/protocol/openid-connect/token';

export const apiKeycloakUserGet = async (serviceUrl) => {
  const url = `${serviceUrl}/${usersResourceProd}`;
  const keycloakBody = {
    client_id: "admin_cli",
    username: "admin",
    password: "admin",
    grant_type: "password"
  }
  const options = {
    ...getDefaultKeycloakOptions(),
    method: 'GET',
  };
  return await request(url, options);
};

export const apiKeycloakToken = async (serviceUrl) => {
  const url = getUrl(
    `${serviceUrl}/${tokenResourceProd}`
  );
  const keycloakBody = {
    client_id: "web_app",
    username: "admin",
    password: "admin",
    grant_type: "password"
  }
  const options = {
    ...getDefaultKeycloakOptions(),
    method: 'POST',
    body: keycloakBody ? serialize(keycloakBody) : null,
  };
  return await request(url, options);
};

function serialize(obj) {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}