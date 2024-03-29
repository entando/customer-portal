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

export const apiProjectsGet = async serviceUrl => {
  const url = getUrl(`${serviceUrl}/${resource}`);
  const options = {
    ...getDefaultOptions(),
    method: 'GET',
  };

  return request(url, options);
};

export const apiProjectsGetByCustomer = async (serviceUrl, id) => {
  const url = getUrl(`${serviceUrl}/${resource}/customer/${id}`);
  const options = {
    ...getDefaultOptions(),
    method: 'GET',
  };

  return request(url, options);
};

export const apiProjectGet = async (serviceUrl, id) => {
  const url = getUrl(`${serviceUrl}/${resource}/${id}`);
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

export const apiDeletePartnerFromProject = async (serviceUrl, projectId, partnerId) => {
  const url = `${serviceUrl}/${resource}/${projectId}/partners/${partnerId}`;
  const options = {
    ...getDefaultOptions(),
    method: 'DELETE',
  };
  return request(url, options);
};

export const apiDeleteSubscriptionFromProject = async (serviceUrl, projectId, subscriptionId) => {
  const url = `${serviceUrl}/${resource}/${projectId}/subscriptions/${subscriptionId}`;
  const options = {
    ...getDefaultOptions(),
    method: 'DELETE',
  };
  return request(url, options);
};

export const apiDeleteUserFromProject = async (serviceUrl, projectId, userId) => {
  const url = `${serviceUrl}/${resource}/${projectId}/users/${userId}`;
  const options = {
    ...getDefaultOptions(),
    method: 'DELETE',
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

export const apiGetProjectUsers = async (serviceUrl, projectId) => {
  const url = `${serviceUrl}/${resource}/${projectId}/users/`;
  const options = {
    ...getDefaultOptions(),
    method: 'GET',
  };
  return request(url, options);
};

export const apiGetProjectSubscriptions = async (serviceUrl, projectId) => {
  const url = `${serviceUrl}/${resource}/${projectId}/subscriptions/`;
  const options = {
    ...getDefaultOptions(),
    method: 'GET',
  };
  return request(url, options);
};
