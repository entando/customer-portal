import { getDefaultOptions, request } from 'api/helpers';

const resource = 'api/customers';

export const apiCustomerGet = async (serviceUrl, id) => {
  const url = `${serviceUrl}/${resource}/${id}`;
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

export const apiCustomerDelete = async (serviceUrl, id) => {
  const url = `${serviceUrl}/${resource}/${id}`;
  const options = {
    ...getDefaultOptions(),
    method: 'DELETE',
  };
  return request(url, options);
};
