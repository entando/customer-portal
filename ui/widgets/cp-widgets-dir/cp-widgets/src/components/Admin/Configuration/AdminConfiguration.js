import React from 'react';
import { Accordion, AccordionItem, Tile} from 'carbon-components-react';
import TicketingSystem from './TicketingSystem';
import ProductVersion from './ProductVersion';

const adminConfig = [
    {
        label: <div><p className="title">Integration with Ticketing System</p><p className="desc">This allows you to manage the ticketing system</p></div>,
        content: <TicketingSystem />
    },
    {
        label: <div><p className="title">Manage Product Version</p><p className="desc">This let’s you manage the entando product versions</p></div>,
        content: <ProductVersion/>
    }
]

const AdminConfiguration = () => (
    <div>
        <h3 className="pageTitle">Entando Admin View</h3>
        <div className="form-container">
            <Tile>
                <p className="title">All Customers</p>
                <p class="desc">Lorem ipsum dolor sit lorem a amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</p>
            </Tile>
            <Accordion>
                {adminConfig.map((item, index) => (
                    <AccordionItem key={index.toString()} index={index} title={item.label} description={ item.description}>
                        <p>{item.content}</p>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    </div>  
)

export default AdminConfiguration;