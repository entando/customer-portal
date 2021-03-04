import React from 'react';
import TicketList from './TicketList';
import { Tile } from 'carbon-components-react';

const subscriptionData = {
    description: 'Entando Product Support Subscription Suplier Portal',
    commitment: 'Leonardo',
    type: 'Product Support Subscription Entando Platform',
    quantityRequest: '1(8 Crore)',
    components: '',
    level: 'Gold',
    startDate: 'May 2019',
    endDate: 'May 2020',
    license: 'Free Commercial Open Source',
};

const Subscription = () => {
    const { description, commitment, type, quantityRequest, components, level, startDate, endDate, license } = subscriptionData
    return (
        <div className="subscription-details">
            <Tile>
                <div className="bx--grid">
                    <div className="bx--row">
                        <div className="bx--col">
                             <p><strong>Description:</strong> {description}</p>
                            <p><strong>Commitment:</strong> {commitment}</p>
                            <p><strong>Type:</strong> {type}</p>
                            <p><strong>Quantity Request:</strong> {quantityRequest}</p>
                            <p><strong>Components:</strong> {components}</p>
                        </div>
                        <div className="bx--col">
                            <p><strong>Level:</strong> {level}</p>
                            <p><strong>Start Date:</strong> {startDate}</p>
                            <p><strong>End Date:</strong> {endDate}</p>
                            <p><strong>License:</strong> {license}</p>
                        </div>
                    </div>
                </div>
            </Tile>
            <br/>
            <TicketList/>
        </div>
    )
};

export default Subscription;