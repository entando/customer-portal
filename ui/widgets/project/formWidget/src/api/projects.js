import { getDefaultOptions, request } from 'api/helpers';

const resource = 'api/projects';

export const apiProjectGet = async (serviceUrl, id) => {
  const url = `${serviceUrl}/${resource}/${id}`;
  const options = {
    ...getDefaultOptions(),
    method: 'GET',
  };
  return request(url, options);
};

export const apiProjectPost = async (serviceUrl, project) => {
  const url = `${serviceUrl}/${resource}`;
  const options = {
    ...getDefaultOptions(),
    method: 'POST',
    body: project ? JSON.stringify(project) : null,
  };
  return request(url, options);
};

export const apiProjectPut = async (serviceUrl, project) => {
  const url = `${serviceUrl}/${resource}`;
  const options = {
    ...getDefaultOptions(),
    method: 'PUT',
    body: project ? JSON.stringify(project) : null,
  };
  return request(url, options);
};

export const apiProjectDelete = async (serviceUrl, id) => {
  const url = `${serviceUrl}/${resource}/${id}`;
  const options = {
    ...getDefaultOptions(),
    method: 'DELETE',
  };
  return request(url, options);
};
