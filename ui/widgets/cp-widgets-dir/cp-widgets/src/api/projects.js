import { getDefaultOptions, request, getUrl } from './helpers';

const resource = 'api/projects';

export const apiProjectsDelete = async (serviceUrl, id) => {
  const url = `${serviceUrl}/${resource}/${id}`;
  const options = {
    ...getDefaultOptions(),
    method: 'DELETE',
  };
  return request(url, options);
};

export const apiProjectsGet = async (serviceUrl) => {
  const url = getUrl(
    `${serviceUrl}/${resource}`
  );
  const options = {
    ...getDefaultOptions(),
    method: 'GET',
  };

  return request(url, options);
};

export const apiProjectGet = async (serviceUrl, id) => {
  const url = getUrl(
    `${serviceUrl}/${resource}/${id}`
  );
  const options = {
    ...getDefaultOptions(),
    method: 'GET',
  };

  return request(url, options);
};

export const apiProjectsGetForCustomer = async (serviceUrl, customerNumber) => {
  const url = `${serviceUrl}/${resource}/subscriptions/customer/${customerNumber}`;
  const options = {
    ...getDefaultOptions(),
    method: 'GET',
  };

  return request(url, options);
};

export const apiProjectPost = async (serviceUrl, project) => {
  const url = `${serviceUrl}/${resource}`;
  const options = {
    ...getDefaultOptions(),
    method: 'POST',
    body: project ? JSON.stringify(project) : null,
  };
  return request(url, options);
};

export const apiProjectPut = async (serviceUrl, project) => {
  const url = `${serviceUrl}/${resource}`;
  const options = {
    ...getDefaultOptions(),
    method: 'PUT',
    body: project ? JSON.stringify(project) : null,
  };
  return request(url, options);
};

export const apiAddTicketToProject = async (serviceUrl, projectId, ticketId) => {
  const url = `${serviceUrl}/${resource}/${projectId}/tickets/${ticketId}`;
  const options = {
    ...getDefaultOptions(),
    method: 'POST',
  };
  return request(url, options);
};

export const apiAddSubscriptionToProject = async (serviceUrl, projectId, subscriptionId) => {
  const url = `${serviceUrl}/${resource}/${projectId}/subscriptions/${subscriptionId}`;
  const options = {
    ...getDefaultOptions(),
    method: 'POST',
  };
  return request(url, options);
};

export const apiAddUserToProject = async (serviceUrl, projectId, userId) => {
  const url = `${serviceUrl}/${resource}/${projectId}/users/${userId}`;
  const options = {
    ...getDefaultOptions(),
    method: 'POST',
  };
  return request(url, options);
};

export const apiAddPartnerToProject = async (serviceUrl, projectId, partnerId) => {
  const url = `${serviceUrl}/${resource}/${projectId}/partners/${partnerId}`;
  const options = {
    ...getDefaultOptions(),
    method: 'POST',
  };
  return request(url, options);
};

export const apiGetProjectsUsers = async (serviceUrl, projectId) => {
  const url = `${serviceUrl}/${resource}/${projectId}/users/`;
  const options = {
    ...getDefaultOptions(),
    method: 'GET',
  };
  return request(url, options);
};

export const apiGetProjectsTickets = async (serviceUrl, projectId) => {
  const url = `${serviceUrl}/${resource}/${projectId}/users/`;
  const options = {
    ...getDefaultOptions(),
    method: 'GET',
  };
  return request(url, options);
};

export const apiGetProjectIdNames = async (serviceUrl) => {
  const url = `${serviceUrl}/${resource}/nameId/`;
  const options = {
    ...getDefaultOptions(),
    method: 'GET',
  };
  return request(url, options);
};

export const apiGetMyProjectIdNames = async (serviceUrl) => {
  const url = `${serviceUrl}/${resource}/myprojects/nameId/`;
  const options = {
    ...getDefaultOptions(),
    method: 'GET',
  };
  return request(url, options);
};

// Endpoints for backend security
const adminResource = 'api/projects/admin';
export const apiAdminProjectsGet = async (serviceUrl) => {
  const url = getUrl(`${serviceUrl}/${adminResource}`);
  const options = {
    ...getDefaultOptions(),
    method: 'GET'
  };

  return request(url, options);
};

const myResource = 'api/projects/myprojects';
export const apiMyProjectsGet = async (serviceUrl) => {
  const url = getUrl(`${serviceUrl}/${myResource}`);
  const options = {
    ...getDefaultOptions(),
    method: 'GET'
  };

  return request(url, options);
};