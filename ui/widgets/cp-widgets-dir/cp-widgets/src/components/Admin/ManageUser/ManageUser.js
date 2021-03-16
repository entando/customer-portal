import React, { Component } from 'react';
import { Accordion, AccordionItem } from 'carbon-components-react';
import AssignUser from './AssignUser';
import DeleteUser from './DeleteUser';

class ManageUser extends Component {

    userFunctionality;
    constructor(props) {
        super(props);
        this.userFunctionality = [
            {
                label: <div><h4>Assign a new User</h4></div>,
                content: <AssignUser serviceUrl={this.props.serviceUrl} keycloakUrl={this.props.keycloakUrl} />,
                open: true
            },
            {
                label: <div><h4>Manage all users</h4></div>,
                content: <DeleteUser serviceUrl={this.props.serviceUrl} keycloakUrl={this.props.keycloakUrl} />,
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