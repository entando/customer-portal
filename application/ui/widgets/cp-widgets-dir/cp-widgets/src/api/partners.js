import { getDefaultOptions, request, getUrl } from './helpers';

const resource = 'api/partners';

export const apiPartnerDelete = async (serviceUrl, id) => {
  const url = `${serviceUrl}/${resource}/${id}`;
  const options = {
    ...getDefaultOptions(),
    method: 'DELETE',
  };
  return request(url, options);
};

export const apiPartnersGet = async serviceUrl => {
  const url = getUrl(`${serviceUrl}/${resource}`);
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
