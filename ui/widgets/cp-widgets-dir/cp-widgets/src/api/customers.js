import { getDefaultOptions, request, getUrl } from './helpers';

const resource = 'api/customers';

export const apiCustomersDelete = async (serviceUrl, id) => {
  const url = `${serviceUrl}/${resource}/${id}`;
  const options = {
    ...getDefaultOptions(),
    method: 'DELETE',
  };
  return request(url, options);
};

export const apiCustomersGet = async (serviceUrl) => {
  const url = getUrl(
    `${serviceUrl}/${resource}`
  );
  const options = {
    ...getDefaultOptions(),
    method: 'GET',
  };

  return request(url, options);
};

export const apiCustomersGetForAdminDashboard = async (serviceUrl) => {
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

export const apiGetCustomersProjects = async (serviceUrl, customerId) => {
  const url = `${serviceUrl}/${resource}/${customerId}/projects`
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