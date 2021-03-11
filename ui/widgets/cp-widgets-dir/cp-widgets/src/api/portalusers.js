import { getDefaultOptions, request, getUrl } from './helpers';

const resource = 'api/portal-users';

export const apiPortalUsersGet = async (serviceUrl) => {
  const url = getUrl(
    `${serviceUrl}/${resource}`
  );
  const options = {
    ...getDefaultOptions(),
    method: 'GET',
  };

  return request(url, options);
};

export const apiPortalUsersDelete = async (serviceUrl, id) => {
  const url = `${serviceUrl}/${resource}/${id}`;
  const options = {
    ...getDefaultOptions(),
    method: 'DELETE',
  };
  return request(url, options);
};

export const apiPortalUsersPost = async (serviceUrl, portalUser) => {
  const url = `${serviceUrl}/${resource}`;
  const options = {
    ...getDefaultOptions(),
    method: 'POST',
    body: portalUser ? JSON.stringify(portalUser) : null,
  };
  return request(url, options);
};

export const apiPortalUsersPut = async (serviceUrl, portalUser) => {
  const url = `${serviceUrl}/${resource}`;
  const options = {
    ...getDefaultOptions(),
    method: 'PUT',
    body: portalUser ? JSON.stringify(portalUser) : null,
  };
  return request(url, options);
};