import { getDefaultOptions, request } from 'api/helpers';

const resource = 'api/project-subscriptions';

export const apiProjectSubscriptionGet = async (serviceUrl, id) => {
  const url = `${serviceUrl}/${resource}/${id}`;
  const options = {
    ...getDefaultOptions(),
    method: 'GET',
  };
  return request(url, options);
};

export const apiProjectSubscriptionPost = async (serviceUrl, projectSubscription) => {
  const url = `${serviceUrl}/${resource}`;
  const options = {
    ...getDefaultOptions(),
    method: 'POST',
    body: projectSubscription ? JSON.stringify(projectSubscription) : null,
  };
  return request(url, options);
};

export const apiProjectSubscriptionPut = async (serviceUrl, projectSubscription) => {
  const url = `${serviceUrl}/${resource}`;
  const options = {
    ...getDefaultOptions(),
    method: 'PUT',
    body: projectSubscription ? JSON.stringify(projectSubscription) : null,
  };
  return request(url, options);
};

export const apiProjectSubscriptionDelete = async (serviceUrl, id) => {
  const url = `${serviceUrl}/${resource}/${id}`;
  const options = {
    ...getDefaultOptions(),
    method: 'DELETE',
  };
  return request(url, options);
};
