import { getDefaultOptions, request } from 'api/helpers';

const resource = 'api/ticketing-systems';

export const apiTicketingSystemGet = async (serviceUrl, id) => {
  const url = `${serviceUrl}/${resource}/${id}`;
  const options = {
    ...getDefaultOptions(),
    method: 'GET',
  };
  return request(url, options);
};

export const apiTicketingSystemPost = async (serviceUrl, ticketingSystem) => {
  const url = `${serviceUrl}/${resource}`;
  const options = {
    ...getDefaultOptions(),
    method: 'POST',
    body: ticketingSystem ? JSON.stringify(ticketingSystem) : null,
  };
  return request(url, options);
};

export const apiTicketingSystemPut = async (serviceUrl, ticketingSystem) => {
  const url = `${serviceUrl}/${resource}`;
  const options = {
    ...getDefaultOptions(),
    method: 'PUT',
    body: ticketingSystem ? JSON.stringify(ticketingSystem) : null,
  };
  return request(url, options);
};

export const apiTicketingSystemDelete = async (serviceUrl, id) => {
  const url = `${serviceUrl}/${resource}/${id}`;
  const options = {
    ...getDefaultOptions(),
    method: 'DELETE',
  };
  return request(url, options);
};
