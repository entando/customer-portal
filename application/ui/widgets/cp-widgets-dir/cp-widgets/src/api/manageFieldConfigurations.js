import { getDefaultOptions, request, getUrl } from './helpers';

const resource = 'api/config/ticketing-system-config';

export const apiTicketingSystemConfigResourceGet = async serviceUrl => {
    const url = getUrl(`${serviceUrl}/${resource}`);
    const options = {
        ...getDefaultOptions(),
        method: 'GET',
    };

    return request(url, options)
};

// TODO: impl Post API
// export const apiTicketingSystemConfigResourcePost = async (serviceUrl) => {
//     const url = `${serviceUrl}/${resource}`

//     const options = {
//         ...getDefaultOptions(),
//         method: 'POST',
//         body: 
//     }

//     return request(url, options)
// }