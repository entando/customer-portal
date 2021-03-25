import { getDefaultOptions, request } from './helpers';

const resource = 'api/project-subscriptions'

export const apiSubscriptionGet = async (serviceUrl, id) => {
    const url = `${serviceUrl}/${resource}/${id}`;
    const options = {
        ...getDefaultOptions(),
        method: 'GET',
    };
    return request(url, options);
};

export const apiSubscriptionGetAll = async (serviceUrl) => {
    const url = `${serviceUrl}/${resource}`;
    const options = {
        ...getDefaultOptions(),
        method: 'GET',
    };
    return request(url, options);
};

// Project Subscription creation consists of an object containing a projectSubscription, an entandoVersionId, and a
// project id, see SubscriptionCreationRequest.
/**
 * Called to create a new project subscription
 * 
 * @param {string} serviceUrl 
 * @param {ProjectSubscriptionCreation} projectSubscriptionCreation 
 * @returns 
 */
export const apiProjectSubscriptionPost = async (serviceUrl, projectSubscriptionCreation) => {
    const url = `${serviceUrl}/${resource}`;
    const options = {
        ...getDefaultOptions(),
        method: 'POST',
        body: projectSubscriptionCreation ? JSON.stringify(projectSubscriptionCreation) : null,
    };
    return request(url, options);
};

export const apiProjectSubscriptionPut = async (serviceUrl, projectSubscriptionCreation) => {
    const url = `${serviceUrl}/${resource}`;
    const options = {
        ...getDefaultOptions(),
        method: 'PUT',
        body: projectSubscriptionCreation ? JSON.stringify(projectSubscriptionCreation) : null,
    };
    return request(url, options);
};

const myResource = 'api/project-subscriptions/mysubscription'
export const apiGetMySubscription = async (serviceUrl, customerId) => {
    const url = `${serviceUrl}/${myResource}/${customerId}`;
    const options = {
      ...getDefaultOptions(),
      method: 'GET'
    };
  
    return request(url, options);
  };

  // Same format as {projectSubscriptionCreation}
export const apiRenewSubscription = async (serviceUrl, projectSubscriptionRenew) => {
    const url = `${serviceUrl}/${resource}/renew`;

    const options = {
        ...getDefaultOptions(),
        method: 'PUT',
        body: projectSubscriptionRenew ? JSON.stringify(projectSubscriptionRenew) : null
    };

    return request(url, options);
};