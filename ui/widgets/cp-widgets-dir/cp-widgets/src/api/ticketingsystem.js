import { getDefaultOptions, request, getUrl } from './helpers';

const resource = 'api/ticketing-systems';

export const apiTicketingSystemDelete = async (serviceUrl, id) => {
  const url = `${serviceUrl}/${resource}/${id}`;
  const options = {
    ...getDefaultOptions(),
    method: 'DELETE',
  };
  return request(url, options);
};

export const apiTicketingSystemsGet = async (serviceUrl) => {
  const url = getUrl(
    `${serviceUrl}/${resource}`
  );
  const options = {
    ...getDefaultOptions(),
    method: 'GET',
  };

  return request(url, options);
};

export const apiTicketingSystemPost = async (serviceUrl, ticketingsystem) => {
  const url = `${serviceUrl}/${resource}`;
  const options = {
    ...getDefaultOptions(),
    method: 'POST',
    body: ticketingsystem ? JSON.stringify(ticketingsystem) : null,
  };
  return request(url, options);
};

export const apiTicketingSystemPut = async (serviceUrl, ticketingsystem) => {
  const url = `${serviceUrl}/${resource}`;
  const options = {
    ...getDefaultOptions(),
    method: 'PUT',
    body: ticketingsystem ? JSON.stringify(ticketingsystem) : null,
  };
  return request(url, options);
};