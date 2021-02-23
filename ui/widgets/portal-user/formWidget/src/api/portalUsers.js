import { getDefaultOptions, request } from 'api/helpers';

const resource = 'api/portal-users';

export const apiPortalUserGet = async (serviceUrl, id) => {
  const url = `${serviceUrl}/${resource}/${id}`;
  const options = {
    ...getDefaultOptions(),
    method: 'GET',
  };
  return request(url, options);
};

export const apiPortalUserPost = async (serviceUrl, portalUser) => {
  const url = `${serviceUrl}/${resource}`;
  const options = {
    ...getDefaultOptions(),
    method: 'POST',
    body: portalUser ? JSON.stringify(portalUser) : null,
  };
  return request(url, options);
};

export const apiPortalUserPut = async (serviceUrl, portalUser) => {
  const url = `${serviceUrl}/${resource}`;
  const options = {
    ...getDefaultOptions(),
    method: 'PUT',
    body: portalUser ? JSON.stringify(portalUser) : null,
  };
  return request(url, options);
};

export const apiPortalUserDelete = async (serviceUrl, id) => {
  const url = `${serviceUrl}/${resource}/${id}`;
  const options = {
    ...getDefaultOptions(),
    method: 'DELETE',
  };
  return request(url, options);
};
