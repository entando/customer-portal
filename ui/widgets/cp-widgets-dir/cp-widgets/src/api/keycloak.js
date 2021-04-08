import { getDefaultKeycloakOptions, request, getUrl } from './helpers';

const usersResource = `admin/realms/${process.env.REACT_APP_KEYCLOAK_REALM}/users`;
const tokenResource = `realms/${process.env.REACT_APP_KEYCLOAK_REALM}/protocol/openid-connect/token`;
 
export const apiKeycloakUserGet = async (serviceUrl) => {
  const url = `${serviceUrl}/${usersResource}`;
  const options = {
    ...getDefaultKeycloakOptions(),
    method: 'GET',
  };
  return await request(url, options);
};

export const apiKeycloakToken = async (serviceUrl) => {
  const url = getUrl(
    `${serviceUrl}/${tokenResource}`
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
