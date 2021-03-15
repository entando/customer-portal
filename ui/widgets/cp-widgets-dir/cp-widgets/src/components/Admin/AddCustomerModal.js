import React, {Component} from 'react';
import { ModalWrapper, Form, TextInput, TextArea } from 'carbon-components-react';
import withKeycloak from '../../auth/withKeycloak';
import { apiCustomerPost } from '../../api/customers';

class AddCustomerModal extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            name: '',
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
        const customer = apiCustomerPost(this.props.serviceUrl, this.state);
        this.render();
        window.location.reload(false);
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
                handleSubmit={this.handleFormSubmit}
            >
                <div className="form-container">
                    <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse cursus fermentum risus, sit amet fringilla nunc pellentesque quis. </p>
                    <Form onSubmit={this.handleFormSubmit}>
                        <TextInput name="name" labelText="Customer Name" value={this.state.name} onChange={this.handleChanges}  errorMessage={this.isValid() ? '' : 'This field is required'}/>
                        <TextInput name="customerNumber" labelText="Customer Number" value={this.state.customerNumber} onChange={this.handleChanges} />
                        <TextInput name="contactName" labelText="Contact Name" value='' onChange=''value={this.state.contactName} onChange={this.handleChanges} />
                        <TextInput name="contactPhone" labelText="Contact Phone" value={this.state.contactPhone} onChange={this.handleChanges} />
                        <TextInput name="contactEmail" labelText="Contact Email" value={this.state.contactEmail} onChange={this.handleChanges} />
                        <TextArea name="notes" labelText="Notes" value={this.state.notes} onChange={this.handleChanges} />
                        {/*<button disabled={!this.isValid()} type="submit">Submit</button>*/}
                    </Form>
                </div> 
            </ModalWrapper>
        )
    }
}


export default withKeycloak(AddCustomerModal);


