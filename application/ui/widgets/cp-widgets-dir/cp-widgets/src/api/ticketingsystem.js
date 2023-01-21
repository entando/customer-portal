import {getDefaultOptions, request, isPortalAdminOrSupport} from './helpers';

const resource = 'api/ticketing-systems';

export const apiTicketingSystemDelete = async (serviceUrl, id) => {
  const url = `${serviceUrl}/${resource}/${id}`;
  const options = {
    ...getDefaultOptions(),
    method: 'DELETE',
  };
  return request(url, options);
};

//Simplifying assumptions
// 1) Take the latest ticketing system as the current config. There should be only 1.
// 2) Only load it once in the current context
export const apiCurrentTicketingSystemGet = async serviceUrl => {
  if (window.entando.currentTicketingSystem == null) {
    const ticketingSystems = (await apiTicketingSystemsGet(serviceUrl)).data;
    window.entando.currentTicketingSystem = ticketingSystems && ticketingSystems.length ? ticketingSystems[ticketingSystems.length - 1] : null;
  }
  return window.entando.currentTicketingSystem;
};

export const apiTicketingSystemsGet = async serviceUrl => {
  const url = `${serviceUrl}/${resource}`;
  const options = {
    ...getDefaultOptions(),
    method: 'GET',
  };

  return request(url, options);
};

//Note: post and put both use a ticketingsystemrequest
export const apiTicketingSystemPost = async (serviceUrl, ticketingSystem, secret) => {
  const url = `${serviceUrl}/${resource}`;
  const tsRequest = {
    "ticketingSystem": ticketingSystem,
    "secret": secret
  }
  const options = {
    ...getDefaultOptions(),
    method: 'POST',
    body: JSON.stringify(tsRequest),
  };
  return request(url, options);
};

export const apiTicketingSystemPut = async (serviceUrl, ticketingSystem, secret) => {
  const url = `${serviceUrl}/${resource}`;
  const tsRequest = {
    "ticketingSystem": ticketingSystem,
    "secret": secret
  }
  const options = {
    ...getDefaultOptions(),
    method: 'PUT',
    body: JSON.stringify(tsRequest),
  };
  return request(url, options);
};

const getTicketSystemBaseUrl = (ticketingSystem) => {
  const url = ticketingSystem.url;
  return (url != null) ? url.substr(0, url.indexOf('/rest')) : '';
}

export const getAllTicketsUrl = (ticketingSystem, organizationId) => {
  let result = getTicketSystemBaseUrl(ticketingSystem);
  if (isPortalAdminOrSupport()) {
      result += '/issues/?jql=Organizations=' + organizationId;
  } else {
      result += '/servicedesk/customer/user/requests?page=1&reporter=org-' + organizationId;
  }
  return result;
}

export const getTicketUrl = (ticketingSystem, ticketId) => {
  let result = getTicketSystemBaseUrl(ticketingSystem);
  if (isPortalAdminOrSupport()) {
    result += '/browse/' + ticketId;
  } else {
    result += '/servicedesk/customer/portal/1/' + ticketId;
  }
  return result;
}

