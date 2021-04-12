import { getDefaultOptions, request, getUrl } from './helpers';

const resource = 'api/customers';

export const apiCustomerDelete = async (serviceUrl, id) => {
  const url = `${serviceUrl}/${resource}/${id}`;
  const options = {
    ...getDefaultOptions(),
    method: 'DELETE',
  };
  return request(url, options);
};

export const apiCustomersGet = async serviceUrl => {
  const url = getUrl(`${serviceUrl}/${resource}`);
  const options = {
    ...getDefaultOptions(),
    method: 'GET',
  };

  return request(url, options);
};

export const apiCustomerGet = async (serviceUrl, id) => {
  const url = getUrl(`${serviceUrl}/${resource}/${id}`);
  const options = {
    ...getDefaultOptions(),
    method: 'GET',
  };

  return request(url, options);
};

export const apiCustomersGetForAdminDashboard = async serviceUrl => {
  const url = `${serviceUrl}/${resource}/all`;
  const options = {
    ...getDefaultOptions(),
    method: 'GET',
  };

  return request(url, options);
};

export const apiCustomerPost = async (serviceUrl, customer) => {
  const url = `${serviceUrl}/${resource}`;
  const options = {
    ...getDefaultOptions(),
    method: 'POST',
    body: customer ? JSON.stringify(customer) : null,
  };
  return request(url, options);
};

export const apiCustomerPut = async (serviceUrl, customer) => {
  const url = `${serviceUrl}/${resource}`;
  const options = {
    ...getDefaultOptions(),
    method: 'PUT',
    body: customer ? JSON.stringify(customer) : null,
  };
  return request(url, options);
};

export const apiGetCustomersProjects = async (serviceUrl, customerId) => {
  const url = `${serviceUrl}/${resource}/${customerId}/projects`;
  const options = {
    ...getDefaultOptions(),
    method: 'GET',
  };

  return request(url, options);
};

export const apiAddProjectToCustomer = async (serviceUrl, customerId, projectId) => {
  const url = `${serviceUrl}/${resource}/${customerId}/projects/${projectId}`;
  const options = {
    ...getDefaultOptions(),
    method: 'POST',
  };
  return request(url, options);
};

export const apiDeleteProjectFromCustomer = async (serviceUrl, customerId, projectId) => {
  const url = `${serviceUrl}/${resource}/${customerId}/projects/${projectId}`;
  const options = {
    ...getDefaultOptions(),
    method: 'DELETE',
  };
  return request(url, options);
};

// Endpoints for backend security
const adminResource = 'api/customers/admin';
export const apiAdminCustomersGet = async serviceUrl => {
  const url = getUrl(`${serviceUrl}/${adminResource}`);
  const options = {
    ...getDefaultOptions(),
    method: 'GET',
  };

  return request(url, options);
};

export const apiAdminCustomerGet = async (serviceUrl, customerId) => {
  const url = getUrl(`${serviceUrl}/${adminResource}/${customerId}`);
  const options = {
    ...getDefaultOptions(),
    method: 'GET',
  };

  return request(url, options);
};

const myResource = 'api/customers/mycustomers';
export const apiMyCustomersGet = async serviceUrl => {
  const url = getUrl(`${serviceUrl}/${myResource}`);
  const options = {
    ...getDefaultOptions(),
    method: 'GET',
  };

  return request(url, options);
};

export const apiGetMyCustomersProjects = async (serviceUrl, customerId) => {
  const url = `${serviceUrl}/${myResource}/${customerId}/projects`;
  const options = {
    ...getDefaultOptions(),
    method: 'GET',
  };

  return request(url, options);
};
