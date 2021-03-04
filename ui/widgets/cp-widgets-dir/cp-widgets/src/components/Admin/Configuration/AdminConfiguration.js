import React from 'react';
import { Accordion, AccordionItem, Tile} from 'carbon-components-react';
import TicketingSystem from './TicketingSystem';
import ProductVersion from './ProductVersion';

const adminConfig = [
    {
        label: <div><h4>Integration with Ticketing System</h4><p>This allows you to manage the ticketing system</p></div>,
        content: <TicketingSystem/>
    },
    {
        label: <div><h4>Manage Product Version</h4><p>This let’s you manage the entando product versions</p></div>,
        content: <ProductVersion/>
    }
]

const AdminConfiguration = () => (
    <div className="form-container">
        <Tile>
            <h4>Configuration Settings</h4>
            <p>Lorem ipsum dolor sit lorem a amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</p>
        </Tile>
        <Accordion>
            {adminConfig.map((item, index) => (
                <AccordionItem key={index.toString()} index={index} title={item.label} description={ item.description}>
                    <p>{item.content}</p>
                </AccordionItem>
            ))}
        </Accordion>
    </div>
)

export default AdminConfiguration;