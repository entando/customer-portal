import React from 'react';
import { Accordion, AccordionItem } from 'carbon-components-react';
import AssignUser from './AssignUser';
import DeleteUser from './DeleteUser';

const user = [
    {
        label: <div><h4>Assign a new User</h4></div>,
        content: <AssignUser />,
        open: true
    },
    {
        label: <div><h4>Manage all users</h4></div>,
        content: <DeleteUser/>,
        open: false
    }
]

const ManageUser = () => (
    <div className="form-container">
        <Accordion>
            {user.map((item, index) => (
                <AccordionItem key={index.toString()} index={index} title={item.label} description={item.description} open={item.open}>
                    <p>{item.content}</p>
                </AccordionItem>
            ))}
        </Accordion>
    </div>
)

export default ManageUser;