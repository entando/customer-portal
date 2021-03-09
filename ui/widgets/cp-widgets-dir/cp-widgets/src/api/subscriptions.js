import { getDefaultOptions, request, getUrl } from './helpers';

const resource = 'api/project-subscriptions';

export const apiSubscriptionGet = async (serviceUrl, id) => {
    const url = `${serviceUrl}/${resource}/${id}`;
    const options = {
      ...getDefaultOptions(),
      method: 'GET',
    };
    return request(url, options);
  };