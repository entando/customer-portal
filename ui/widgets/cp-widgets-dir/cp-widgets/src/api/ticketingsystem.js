import {getDefaultOptions, request} from './helpers';

const resource = 'api/ticketing-systems';

export const apiTicketingSystemDelete = async (serviceUrl, id) => {
  const url = `${serviceUrl}/${resource}/${id}`;
  const options = {
    ...getDefaultOptions(),
    method: 'DELETE',
  };
  return request(url, options);
};

export const apiCurrentTicketingSystemGet = async serviceUrl => {
  const ticketingSystems = (await apiTicketingSystemsGet(serviceUrl)).data;
  //Simplifying assumption to take the latest ticketing system as the current config. There should be only 1.
  return ticketingSystems && ticketingSystems.length ? ticketingSystems[ticketingSystems.length - 1] : null;
};

export const apiTicketingSystemsGet = async serviceUrl => {
  const url = `${serviceUrl}/${resource}`;
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
