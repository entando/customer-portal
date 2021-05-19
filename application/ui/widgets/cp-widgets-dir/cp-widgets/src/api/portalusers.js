import { getDefaultOptions, request, getUrl } from './helpers';

const resource = 'api/portal-users';

export const apiUserDelete = async (serviceUrl, id) => {
  const url = `${serviceUrl}/${resource}/${id}`;
  const options = {
    ...getDefaultOptions(),
    method: 'DELETE',
  };
  return await request(url, options);
};

export const apiUsersPut = async (serviceUrl, user) => {
  const url = `${serviceUrl}/${resource}`;
  const options = {
    ...getDefaultOptions(),
    method: 'PUT',
    body: user ? JSON.stringify(user) : null,
  };
  return await request(url, options);
};

export const apiUsersGet = async serviceUrl => {
  const url = getUrl(`${serviceUrl}/${resource}`);
  const options = {
    ...getDefaultOptions(),
    method: 'GET',
  };

  return await request(url, options);
};

export const apiUserGet = async (serviceUrl, userId) => {
  const url = getUrl(`${serviceUrl}/${resource}/${userId}`);
  const options = {
    ...getDefaultOptions(),
    method: 'GET',
  };

  return await request(url, options);
};

export const apiUserPost = async (serviceUrl, user) => {
  const url = `${serviceUrl}/${resource}`;
  const options = {
    ...getDefaultOptions(),
    method: 'POST',
    body: user ? JSON.stringify(user) : null,
  };
  return await request(url, options);
};

export const apiUserGetByUsernameAndEmail = async (serviceUrl, username, email) => {
  const url = getUrl(`${serviceUrl}/${resource}/username/${username}/email/${email}`);
  const options = {
    ...getDefaultOptions(),
    method: 'GET',
  };

  return await request(url, options);
};
