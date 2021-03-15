import React from 'react';
import i18n from '../../i18n';
import { Tile } from 'carbon-components-react';

const customerData = {
    name: 'Ford',
    id: '5564 4563 3345',
    startDate: '01/01/2020'
}

const CustomerDetails = () => {
    const { name, id, startDate } = customerData //destructuring
    return (
        <div className="customer-details">
            <Tile>
                <p><strong>{i18n.t('customerDashboard.customerName')}</strong> {name}</p>
                <p><strong>{i18n.t('customerDashboard.customerId')}</strong> {id}</p>
                <p><strong>{i18n.t('customerDashboard.startDate')}</strong> {startDate}</p>
            </Tile>
        </div>
    );
}

export default CustomerDetails;
