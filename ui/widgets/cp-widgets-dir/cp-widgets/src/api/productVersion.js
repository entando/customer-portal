import { getDefaultOptions, request, getUrl } from './helpers';

const resource = 'api/entando-versions';

export const apiProductVersionsGet = async (serviceUrl) => {
    const url = `${serviceUrl}/${resource}`;
    const options = {
        ...getDefaultOptions(),
        method: 'GET',
    };

    return request(url, options);
};

export const apiUpdateProductVersionsStatus = async (serviceUrl, id) => {
    const url = `${serviceUrl}/${resource}/${id}`;
    const options = {
      ...getDefaultOptions(),
      method: 'PUT',
    };
    return request(url, options);
};

export const apiProductVersionPost = async (serviceUrl, productVersion) => {
    const url = `${serviceUrl}/${resource}`;
    const options = {
      ...getDefaultOptions(),
      method: 'POST',
      body: productVersion ? JSON.stringify(productVersion) : null,
    };
    return request(url, options);
};