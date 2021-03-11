import React from 'react';
import { Accordion, AccordionItem } from 'carbon-components-react';
import AssignUSer from './AssignUser';
import DeleteUser from './DeleteUser';

const user = [
    {
        label: <div><h4>Assign a new User</h4><p>Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs.</p></div>,
        content: <AssignUSer />
    },
    {
        label: <div><h4>Manage all users</h4><p>Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs.</p></div>,
        content: <DeleteUser/>
    }
]

const ManageUser = () => (
    <div>
        <h3 className="pageTitle">Entando Admin View</h3>
        <div className="form-container">
            <Accordion>
                {user.map((item, index) => (
                    <AccordionItem key={index.toString()} index={index} title={item.label} description={ item.description}>
                        <p>{item.content}</p>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    </div>    
)

export default ManageUser;