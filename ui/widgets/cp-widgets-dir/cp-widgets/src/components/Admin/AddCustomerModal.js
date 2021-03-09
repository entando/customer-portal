import React, {Component} from 'react';
import { ModalWrapper, Form, TextInput } from 'carbon-components-react';

export default class AddCustomerModal extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            customerName: '',
            customerNumber: '',
            contactName: '',
            contactPhone: '',
            contactEmail:'',
            notes:''
        };
    }

    handleChanges = e => {
        const input = e.target;
        const name = input.name;
        const value = input.value;
        this.setState({ [name]: value });
    };

    handleFormSubmit = e => {
        e.preventDefault();
        console.log('Customer Name:', this.state.customerName);
        console.log('Customer Number:', this.state.customerNumber);
        console.log('Contact Name:', this.state.contactName);
        console.log('Contact Phone:', this.state.contactPhone);
        console.log('Contact email:', this.state.contactEmail);
        console.log('Notes:', this.state.notes);
    };

    isValid() {
        if (this.state.customerName === '') {
          return false;
        }
        return true;
    }
    
    render() {
        return (
            <ModalWrapper
                buttonTriggerText="Add a customer + "
                modalHeading="Add a new customer"
                buttonTriggerClassName="add-customer bx--btn bx--btn--tertiary"
                className="modal-form"
            >
                <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse cursus fermentum risus, sit amet fringilla nunc pellentesque quis. </p>
                <div className="form-container">
                    <Form onSubmit={this.handleFormSubmit}>
                        <TextInput name="customerName" labelText="Customer Name" value={this.state.customerName} onChange={this.handleChanges}  errorMessage={this.isValid() ? '' : 'This field is required'}/>
                        <TextInput name="customerNumber" labelText="Customer Number" value={this.state.customerNumber} onChange={this.handleChanges} />
                        <TextInput name="contactName" labelText="Contact Name" value='' onChange=''value={this.state.contactName} onChange={this.handleChanges} />
                        <TextInput name="contactPhone" labelText="Contact Phone" value={this.state.contactPhone} onChange={this.handleChanges} />
                        <TextInput name="contactEmail" labelText="Contact Email" value={this.state.contactEmail} onChange={this.handleChanges} />
                        <TextInput name="notes" labelText="Notes" value={this.state.notes} onChange={this.handleChanges} />
                        <button disabled={!this.isValid()} type="submit">Submit</button>
                    </Form>
                </div> 
            </ModalWrapper>
        )
    }
}


