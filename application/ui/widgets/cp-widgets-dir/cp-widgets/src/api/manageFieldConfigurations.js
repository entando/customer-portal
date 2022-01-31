import { getDefaultOptions, request, getUrl } from './helpers';

const resource = 'api/ticketing-system-config/';

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
export const apiTicketingSystemConfigResourcePost = async (serviceUrl, typeOfData, Data) => {
    const url = `${serviceUrl}/${resource}`
    const payloadBuilder = {
        flag: typeOfData,
        values: Data
    }
    const options = {
        ...getDefaultOptions(),
        method: 'PUT',
        body: JSON.stringify(payloadBuilder)
    }
    return request(url, options)
}