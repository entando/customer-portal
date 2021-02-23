import { getDefaultOptions, request } from 'api/helpers';

const resource = 'api/partners';

export const apiPartnerGet = async (serviceUrl, id) => {
  const url = `${serviceUrl}/${resource}/${id}`;
  const options = {
    ...getDefaultOptions(),
    method: 'GET',
  };
  return request(url, options);
};

export const apiPartnerPost = async (serviceUrl, partner) => {
  const url = `${serviceUrl}/${resource}`;
  const options = {
    ...getDefaultOptions(),
    method: 'POST',
    body: partner ? JSON.stringify(partner) : null,
  };
  return request(url, options);
};

export const apiPartnerPut = async (serviceUrl, partner) => {
  const url = `${serviceUrl}/${resource}`;
  const options = {
    ...getDefaultOptions(),
    method: 'PUT',
    body: partner ? JSON.stringify(partner) : null,
  };
  return request(url, options);
};

export const apiPartnerDelete = async (serviceUrl, id) => {
  const url = `${serviceUrl}/${resource}/${id}`;
  const options = {
    ...getDefaultOptions(),
    method: 'DELETE',
  };
  return request(url, options);
};
