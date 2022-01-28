import { getDefaultOptions, request, getUrl } from './helpers';

const resource = 'api/config/ticketing-system-config';

/**
 *
 * @param {*} serviceUrl
 * @returns
 */
export const apiTicketingSystemConfigResourceGet = async serviceUrl => {
    const url = getUrl(`${serviceUrl}/${resource}`);
    const options = {
        ...getDefaultOptions(),
        method: 'GET',
    };

    return request(url, options)
};

/**
 *
 * @param {*} serviceUrl
 * @param {*} active
 * @param {*} productName
 * @param {*} subscriptionLevel
 * @param {*} ticketType
 * @returns
 */
// TODO: IMP: PARAMETER REQUIRED TO CHANGE
export const apiTicketingSystemConfigResourcePost = async (serviceUrl, active = false, productName, ticketType = "", subscriptionLevel = "") => {
    const url = `${serviceUrl}/${resource}`
    const payloadBuilder = {
        active, productName,
        subscriptionLevel: subscriptionLevel,
        ticketType: ticketType
    }

    const options = {
        ...getDefaultOptions(),
        method: 'POST',
        body: JSON.stringify(payloadBuilder)
    }

    return request(url, options)
}