export const DOMAIN = process.env.REACT_APP_PATH || ''; // eslint-disable-line import/prefer-default-export

//Customer Portal roles
export const ADMIN = 'cp-admin';
export const SUPPORT = 'cp-support';
export const PARTNER = 'cp-partner';
export const CUSTOMER = 'cp-customer';

//Page codes
export const PAGE_CUSTOMER_PORTAL = 'customer_portal.page'
export const PAGE_ADMIN_CONFIG = 'cp_admin_config.page'

// TICKETING_SYSTEM_CONFIG ENUM
export const TICKETING_SYSTEM_CONFIG_ENUM = {
    TICKET_TYPE: "TICKET_TYPE",
    SUBSCRIPTION_LEVEL: "SUBSCRIPTION_LEVEL",
    PRODUCT_NAME: "PRODUCT_NAME",
    JIRA_CUSTOM_FIELD: "JIRA_CUSTOM_FIELD"
};
Object.freeze(TICKETING_SYSTEM_CONFIG_ENUM);

export const VALIDATION_VARS = {
    CHAR_LIMIT_MSG_APPEAR_TIME: 2000,
    CHAR_MIN_LIMIT: 3,
    CHAR_MAX_LIMIT: 100
}