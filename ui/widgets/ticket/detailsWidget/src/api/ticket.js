import { getDefaultOptions, request } from 'api/helpers';

const resource = 'api/tickets';

/* eslint-disable-next-line import/prefer-default-export */
export const apiTicketGet = async (serviceUrl, id) => {
  const url = `${serviceUrl}/${resource}/${id}`;
  const options = {
    ...getDefaultOptions(),
    method: 'GET',
  };
  return request(url, options);
};
