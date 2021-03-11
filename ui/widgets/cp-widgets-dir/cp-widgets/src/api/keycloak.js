import { getDefaultOptions, request, getUrl } from './helpers';

const resource = 'auth/admin/realms/jhipster';

export const apiKeycloakUserDelete = async (serviceUrl, id) => {
  const url = `${serviceUrl}/${resource}/${id}`;
  const options = {
    ...getDefaultOptions(),
    method: 'DELETE',
  };
  return request(url, options);
};

export const apiKeycloakUsersGet = async (serviceUrl ) => {
  const url = getUrl(
    `${serviceUrl}/${resource}/users`
  );
  const options = {
    ...getDefaultOptions(),
    method: 'GET',
  };

  return request(url, options);
};

export const apiKeycloakUserPost = async (serviceUrl, user) => {
  const url = `${serviceUrl}/${resource}/users`;
  const options = {
    ...getDefaultOptions(),
    method: 'POST',
    body: user ? JSON.stringify(user) : null,
  };
  return request(url, options);
};
