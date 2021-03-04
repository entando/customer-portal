import React, { Component } from 'react';
import { ModalWrapper, Form, TextInput } from 'carbon-components-react';
import withKeycloak from '../../auth/withKeycloak';
import { apiCustomerPost, apiCustomerPut } from '../../api/customers';
import { apiProjectPost, apiProjectPut } from '../../api/projects';


class AddCustomerModal extends Component {
    constructor() {
        super();
        this.state = {
            customerName: "",
            customerNumber: "",
            customerEmail: ""
        }
    }

    async addCustomer() {
        const { t, keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;
        console.log(keycloak);
        if (authenticated) {
            var project = {
                name: "Test Project 1",
                description: "string",
                systemId: "JAT",
                contactName: "Test",
                contactPhone: "123-123-1234",
                contactEmail: "test@gmail.com",
                notes: "string",
                projectSubscriptions: null,
                tickets: null,
                partners: null,
                portalUsers: null,
                customer: null
            }
            
            const customer = {
                name: this.state.customerName,
                contactName: this.state.customerName,
                customerNumber: this.state.customerNumber,
                contactNumber: this.state.customerNumber,
                contactEmail: this.state.customerEmail
            }
            
            // create project when we create a customer
            console.log(this.props.serviceUrl)
            const projectCreated = await apiProjectPost(this.props.serviceUrl, project);
            const customerCreated = await apiCustomerPost(this.props.serviceUrl, customer);

            project.id = projectCreated.data.id;
            project.customer = {
                id: customerCreated.data.id
            }

            // update project with customer
            await apiProjectPut(this.props.serviceUrl, project);

        }
        this.render();
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit = (e) => {
        this.addCustomer();
    }

    render(){
        return(
            <ModalWrapper
                buttonTriggerText="Add a customer + "
                modalHeading="Add a new customer"
                buttonTriggerClassName="add-customer bx--btn bx--btn--tertiary"
                className="modal-form"
                handleSubmit={this.handleSubmit}
            >
            <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse cursus fermentum risus, sit amet fringilla nunc pellentesque quis. </p>
            <Form>
                    <TextInput name="customerName" labelText="Customer Name" value={this.state.customerName} onChange={this.handleChange} />
                    <TextInput name="customerNumber" labelText="Customer Number" value={this.state.customerNumber} onChange={this.handleChange} />
                    <TextInput name="customerEmail" labelText="Customer Email" value={this.state.customerEmail} onChange={this.handleChange} />
                </Form>
            </ModalWrapper>
        )
    }
}

export default withKeycloak(AddCustomerModal); 