import { getDefaultOptions, request } from 'api/helpers';

const resource = 'api/entando-versions';

export const apiEntandoVersionGet = async (serviceUrl, id) => {
  const url = `${serviceUrl}/${resource}/${id}`;
  const options = {
    ...getDefaultOptions(),
    method: 'GET',
  };
  return request(url, options);
};

export const apiEntandoVersionPost = async (serviceUrl, entandoVersion) => {
  const url = `${serviceUrl}/${resource}`;
  const options = {
    ...getDefaultOptions(),
    method: 'POST',
    body: entandoVersion ? JSON.stringify(entandoVersion) : null,
  };
  return request(url, options);
};

export const apiEntandoVersionPut = async (serviceUrl, entandoVersion) => {
  const url = `${serviceUrl}/${resource}`;
  const options = {
    ...getDefaultOptions(),
    method: 'PUT',
    body: entandoVersion ? JSON.stringify(entandoVersion) : null,
  };
  return request(url, options);
};

export const apiEntandoVersionDelete = async (serviceUrl, id) => {
  const url = `${serviceUrl}/${resource}/${id}`;
  const options = {
    ...getDefaultOptions(),
    method: 'DELETE',
  };
  return request(url, options);
};
