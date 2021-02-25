import React from 'react';
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
                <p><strong>Customer Name:</strong> {name}</p>
                <p><strong>Customer Id:</strong> {id}</p>
                <p><strong>Start Date:</strong> {startDate}</p>
            </Tile>
          </div>
    );
}

export default CustomerDetails;
