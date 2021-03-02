import { getDefaultOptions, request, getUrl } from './helpers';

const resource = 'api/tickets';

export const apiCustomersDelete = async (serviceUrl, id) => {
  const url = `${serviceUrl}/${resource}/${id}`;
  const options = {
    ...getDefaultOptions(),
    method: 'DELETE',
  };
  return request(url, options);
};

export const apiCustomersGet = async (serviceUrl ) => {

  const url = getUrl(
    `${serviceUrl}/${resource}`
  );
  const options = {
    ...getDefaultOptions(),
    method: 'GET',
  };

  return request(url, options);
};
