import { getDefaultOptions, request, getUrl } from './helpers';

const resource = 'api/tickets';

export const apiTicketDelete = async (serviceUrl, id) => {
  const url = `${serviceUrl}/${resource}/${id}`;
  const options = {
    ...getDefaultOptions(),
    method: 'DELETE',
  };
  return request(url, options);
};

export const apiTicketsGet = async (serviceUrl ) => {

  const url = getUrl(
    `${serviceUrl}/${resource}`
  );
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


const jiraResource = 'api/tickets/ticketingsystem/JAT';
export const apiJiraTicketDelete = async (serviceUrl, id) => {
  const url = `${serviceUrl}/${jiraResource}/${id}`;
  const options = {
    ...getDefaultOptions(),
    method: 'DELETE',
  };
  return request(url, options);
};

export const apiJiraTicketsGet = async (serviceUrl ) => {

  const url = getUrl(
    `${serviceUrl}/${jiraResource}`
  );
  const options = {
    ...getDefaultOptions(),
    method: 'GET',
  };

  return request(url, options);
};

export const apiJiraTicketPost = async (serviceUrl, ticket) => {
  const url = `${serviceUrl}/${jiraResource}`;
  const options = {
    ...getDefaultOptions(),
    method: 'POST',
    body: ticket ? JSON.stringify(ticket) : null,
  };
  return request(url, options);
};