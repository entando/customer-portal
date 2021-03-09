import { getDefaultOptions, request, getUrl } from './helpers';

const resource = 'api/project-subscriptions'

export const apiProjectSubscriptionsGet = async (serviceUrl, id) => {
    const url = getUrl(
        `${serviceUrl}/${resource}/${id}`
    );
    const options = {
        ...getDefaultOptions(),
        method: 'GET',
    };
    return request(url, options);
};

// TODO: Project Subscription creation consists of an object containing a projectSubscription, an entandoVersionId, and a
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