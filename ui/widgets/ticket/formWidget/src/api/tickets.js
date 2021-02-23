import { getDefaultOptions, request } from 'api/helpers';

const resource = 'api/tickets';

export const apiTicketGet = async (serviceUrl, id) => {
  const url = `${serviceUrl}/${resource}/${id}`;
  const options = {
    ...getDefaultOptions(),
    method: 'GET',
  };
  return request(url, options);
};

export const apiTicketPost = async (serviceUrl, ticket) => {
  const url = `${serviceUrl}/${resource}`;
  const options = {
    ...getDefaultOptions(),
    method: 'POST',
    body: ticket ? JSON.stringify(ticket) : null,
  };
  return request(url, options);
};

export const apiTicketPut = async (serviceUrl, ticket) => {
  const url = `${serviceUrl}/${resource}`;
  const options = {
    ...getDefaultOptions(),
    method: 'PUT',
    body: ticket ? JSON.stringify(ticket) : null,
  };
  return request(url, options);
};

export const apiTicketDelete = async (serviceUrl, id) => {
  const url = `${serviceUrl}/${resource}/${id}`;
  const options = {
    ...getDefaultOptions(),
    method: 'DELETE',
  };
  return request(url, options);
};
