import React, { Component } from 'react';
import { Accordion, AccordionItem } from 'carbon-components-react';
import AssignUser from './AssignUser';
import DeleteUser from './DeleteUser';

const roles = [
    {
        name: 'Admin',
        value: 'ROLE_ADMIN'
    },
    {
        name: 'Support',
        value: 'ROLE_SUPPORT'
    },
    {
        name: 'Partner',
        value: 'ROLE_PARTNER'
    },
    {
        name: 'Customer',
        value: 'ROLE_CUSTOMER'
    }
]

const user = [
    {
        label: <div><h4>Assign a new User</h4></div>,
        content: <AssignUser roles={roles} />,
        open: true
    },
    {
        label: <div><h4>Manage all users</h4></div>,
        content: <DeleteUser roles={roles} />,
        open: false
    }
];

class ManageUser extends Component {

    userFunctionality;
    constructor(props) {
        super(props);
        this.userFunctionality = [
            {
                label: <div><h4>Assign a new User</h4></div>,
                content: <AssignUser roles={roles} serviceUrl={this.props.serviceUrl} />,
                open: true
            },
            {
                label: <div><h4>Manage all users</h4></div>,
                content: <DeleteUser roles={roles} serviceUrl={this.props.serviceUrl} />,
                open: false
            }
        ]

    }

    render() {
        return (<div>
            <h3 className="pageTitle">Entando Admin View</h3>
            <div className="form-container">
                <Accordion>
                    {this.userFunctionality.map((item, index) => (
                        <AccordionItem key={index.toString()} index={index} title={item.label} description={item.description} open={item.open}>
                            <p>{item.content}</p>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>);
    }
}

export default ManageUser;