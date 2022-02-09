import { TICKETING_SYSTEM_CONFIG_ENUM } from './constants';
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
    let keyBuilder = typeOfData === TICKETING_SYSTEM_CONFIG_ENUM.JIRA_CUSTOM_FIELD ? 'jiraCustomFields' : 'values';
    const payloadBuilder = {
        flag: typeOfData,
        [keyBuilder]: Data
    }
    const options = {
        ...getDefaultOptions(),
        method: 'PUT',
        body: JSON.stringify(payloadBuilder)
    }
    return request(url, options)
}