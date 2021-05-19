import { getDefaultOptions, request } from './helpers';

const resource = 'api/entando-versions';

export const apiProductVersionsGet = async serviceUrl => {
  const url = `${serviceUrl}/${resource}`;
  const options = {
    ...getDefaultOptions(),
    method: 'GET',
  };

  return request(url, options);
};

export const apiProductVersionGet = async (serviceUrl, versionId) => {
  const url = `${serviceUrl}/${resource}/${versionId}`;
  const options = {
    ...getDefaultOptions(),
    method: 'GET',
  };

  return request(url, options);
};

export const apiUpdateProductVersionsStatus = async (serviceUrl, id) => {
  const url = `${serviceUrl}/${resource}/${id}`;
  const options = {
    ...getDefaultOptions(),
    method: 'PUT',
  };
  return request(url, options);
};

export const apiProductVersionPost = async (serviceUrl, productVersion) => {
  const url = `${serviceUrl}/${resource}`;
  const options = {
    ...getDefaultOptions(),
    method: 'POST',
    body: productVersion ? JSON.stringify(productVersion) : null,
  };
  return request(url, options);
};

export const apiProductVersionPut = async (serviceUrl, productVersion) => {
  const url = `${serviceUrl}/${resource}`;
  const options = {
    ...getDefaultOptions(),
    method: 'PUT',
    body: productVersion ? JSON.stringify(productVersion) : null,
  };
  return request(url, options);
};

export const apiProductVersionDelete = async (serviceUrl, id) => {
  const url = `${serviceUrl}/${resource}/${id}`;
  const options = {
    ...getDefaultOptions(),
    method: 'DELETE',
  };
  return request(url, options);
};
