import React, { Component } from 'react';
import i18n from '../../i18n';
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
                buttonTriggerText={i18n.t('buttons.addCustomer')}
                modalHeading={i18n.t('adminDashboard.addCustomer.title')}
                buttonTriggerClassName="add-customer bx--btn bx--btn--tertiary"
                className="modal-form"
                handleSubmit={this.handleFormSubmit}
            >
                <div className="form-container">
                    <p> {i18n.t('adminDashboard.addCustomer.desc')} </p>
                    <Form onSubmit={this.handleFormSubmit}>
                        <TextInput name="name" labelText={i18n.t('adminDashboard.addCustomer.customerName')} value={this.state.name} onChange={this.handleChanges}  errorMessage={this.isValid() ? '' : 'This field is required'}/>
                        <TextInput name="customerNumber" labelText={i18n.t('adminDashboard.addCustomer.customerNumber')} value={this.state.customerNumber} onChange={this.handleChanges} />
                        <TextInput name="contactName" labelText={i18n.t('adminDashboard.addCustomer.contactName')} value='' onChange=''value={this.state.contactName} onChange={this.handleChanges} />
                        <TextInput name="contactPhone" labelText={i18n.t('adminDashboard.addCustomer.contactPhone')} value={this.state.contactPhone} onChange={this.handleChanges} />
                        <TextInput name="contactEmail" labelText={i18n.t('adminDashboard.addCustomer.contactEmail')} value={this.state.contactEmail} onChange={this.handleChanges} />
                        <TextArea name="notes" labelText={i18n.t('adminDashboard.addCustomer.notes')} value={this.state.notes} onChange={this.handleChanges} />
                        {/*<button disabled={!this.isValid()} type="submit">Submit</button>*/}
                    </Form>
                </div> 
            </ModalWrapper>
        )
    }
}


export default withKeycloak(AddCustomerModal);