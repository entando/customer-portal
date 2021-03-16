import { getDefaultOptions, request, getUrl } from './helpers';

const resource = 'api/portal-users';

export const apiUserDelete = async (serviceUrl, id) => {
  const url = `${serviceUrl}/${resource}/${id}`;
  const options = {
    ...getDefaultOptions(),
    method: 'DELETE',
  };
  return request(url, options);
};

export const apiUsersPut = async (serviceUrl, user) => {
  const url = `${serviceUrl}/${resource}`;
  const options = {
    ...getDefaultOptions(),
    method: 'PUT',
    body: user ? JSON.stringify(user) : null,
  };
  return request(url, options);
};

export const apiUsersGet = async (serviceUrl) => {
  const url = getUrl(
    `${serviceUrl}/${resource}`
  );
  const options = {
    ...getDefaultOptions(),
    method: 'GET',
  };

  return request(url, options);
};

export const apiUserGet = async (serviceUrl, userId) => {
  const url = getUrl(
    `${serviceUrl}/${resource}/${userId}`
  );
  const options = {
    ...getDefaultOptions(),
    method: 'GET',
  };

  return request(url, options);
};

export const apiUserPost = async (serviceUrl, user) => {
  const url = `${serviceUrl}/${resource}`;
  const options = {
    ...getDefaultOptions(),
    method: 'POST',
    body: user ? JSON.stringify(user) : null,
  };
  return request(url, options);
};

export const apiUserGetByUsername = async (serviceUrl, username) => {
  const url = getUrl(
    `${serviceUrl}/${resource}/username/${username}`
  );
  const options = {
    ...getDefaultOptions(),
    method: 'GET',
  };

  return request(url, options);
};