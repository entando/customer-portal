import { getDefaultKeycloakOptions, request, getUrl } from './helpers';

//TODO: replace with paginated user list eventually
const maxUsersCount = 1000;

export const apiKeycloakUserGet = async (serviceUrl, realm) => {
  const usersResource = `admin/realms/${realm}/users?max=`+maxUsersCount;
  const url = `${serviceUrl}/${usersResource}`;
  const options = {
    ...getDefaultKeycloakOptions(),
    method: 'GET',
  };
  return await request(url, options);
};

export const apiKeycloakToken = async (serviceUrl, realm) => {
  const tokenResource = `realms/${realm}/protocol/openid-connect/token`;
  const url = getUrl(`${serviceUrl}/${tokenResource}`);
  const keycloakBody = {
    client_id: 'web_app',
    username: 'admin',
    password: 'admin',
    grant_type: 'password',
  };
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
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
    }
  return str.join('&');
}
