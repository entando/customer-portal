import React, { Component } from 'react';
import i18n from '../../i18n';
import { ModalWrapper, Form, TextInput, TextArea } from 'carbon-components-react';
import withKeycloak from '../../auth/withKeycloak';
import { apiCustomerPut } from '../../api/customers';

class EditCustomerModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            customerNumber: '',
            contactName: '',
            contactPhone: '',
            contactEmail: '',
            notes: '',
            invalid: {}
        };
    }

    handleValidation() {
        let invalid = {};
        let formIsValid = true;

        //name
        if (this.state.name === '') {
            formIsValid = false;
            invalid['name'] = true;
        }

        //customerNumber
        if (this.state.customerNumber === '') {
            formIsValid = false;
            invalid['customerNumber'] = true;
        }

        //contactEmail
        if (typeof this.state.contactEmail !== 'undefined') {
            let lastAtPos = this.state.contactEmail.lastIndexOf('@');
            let lastDotPos = this.state.contactEmail.lastIndexOf('.');

            if (
                !(
                    lastAtPos < lastDotPos &&
                    lastAtPos > 0 &&
                    this.state.contactEmail.indexOf('@@') == -1 &&
                    lastDotPos > 2 &&
                    this.state.contactEmail.length - lastDotPos > 2
                )
            ) {
                formIsValid = false;
                invalid['contactEmail'] = true;
            }
        }

        this.setState({ invalid: invalid });
        return formIsValid;
    }

    handleChanges = e => {
        const input = e.target;
        const name = input.name;
        const value = input.value;
        this.setState({ [name]: value });
    };

    async updateCustomer(customer) {
        const { t, keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;
        if (authenticated) {
            const result = await apiCustomerPut(this.props.serviceUrl, customer);
        }
    }

    handleFormSubmit = e => {
        const formIsValid = this.handleValidation();

        if (formIsValid) {
            const customer = {
                id: this.props.customer.id,
                name: this.state.name,
                customerNumber: this.state.customerNumber,
                contactName: this.state.contactName,
                contactPhone: this.state.contactPhone,
                contactEmail:this.state.contactEmail,
                notes:this.state.notes
            }
            this.updateCustomer(customer);
            window.location.reload(false);
        }
    };

    componentDidMount() {
        const { keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;
    
        if (authenticated) {
          this.setState({
            name: this.props.customer.name,
            customerNumber: this.props.customer.customerNumber,
            contactName: this.props.customer.contactName,
            contactPhone: this.props.customer.contactPhone,
            contactEmail:this.props.customer.contactEmail,
            notes:this.props.customer.notes
          })
        }
    }

    componentDidUpdate(prevProps) {
        const { keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;
    
        const changedAuth = prevProps.keycloak.authenticated !== authenticated;
    
        if (authenticated && changedAuth) {
            this.setState({
                name: this.props.customer.name,
                customerNumber: this.props.customer.customerNumber,
                contactName: this.props.customer.contactName,
                contactPhone: this.props.customer.contactPhone,
                contactEmail: this.props.customer.contactEmail,
                notes: this.props.customer.notes
              })
        }
    }

    render() {
        return (
            <ModalWrapper
                buttonTriggerText={i18n.t('buttons.edit')}
                modalHeading={i18n.t('adminDashboard.editCustomer.title')}
                buttonTriggerClassName="bx--btn bx--btn--ghost"
                className="modal-form"
                id="modal-form-customer"
                handleSubmit={this.handleFormSubmit}
            >
                <div className="form-container">
                    <p> {i18n.t('adminDashboard.editCustomer.desc')} </p>
                    <Form onSubmit={this.handleFormSubmit}>
                        <TextInput
                            name="name"
                            labelText={i18n.t('adminDashboard.addCustomer.customerName')}
                            value={this.state.name}
                            onChange={this.handleChanges}
                            invalidText={i18n.t('validation.invalid.required')}
                            invalid={this.state.invalid['name']}
                        />
                        <TextInput
                            name="customerNumber"
                            labelText={i18n.t('adminDashboard.addCustomer.customerNumber')}
                            value={this.state.customerNumber}
                            onChange={this.handleChanges}
                            invalidText={i18n.t('validation.invalid.required')}
                            invalid={this.state.invalid['customerNumber']}
                        />
                        <TextInput
                            name="contactName"
                            labelText={i18n.t('adminDashboard.addCustomer.contactName')}
                            value={this.state.contactName}
                            onChange={this.handleChanges}
                        />
                        <TextInput
                            name="contactPhone"
                            labelText={i18n.t('adminDashboard.addCustomer.contactPhone')}
                            value={this.state.contactPhone}
                            onChange={this.handleChanges}
                        />
                        <TextInput
                            name="contactEmail"
                            labelText={i18n.t('adminDashboard.addCustomer.contactEmail')}
                            value={this.state.contactEmail}
                            onChange={this.handleChanges}
                            invalidText={i18n.t('validation.invalid.email')}
                            invalid={this.state.invalid['contactEmail']}
                        />
                        <TextArea
                            name="notes"
                            labelText={i18n.t('adminDashboard.addCustomer.notes')}
                            value={this.state.notes}
                            onChange={this.handleChanges}
                        />
                        {/*<button disabled={!this.isValid()} type="submit">Submit</button>*/}
                    </Form>
                </div>
            </ModalWrapper>
        );
    }
}

export default withKeycloak(EditCustomerModal);
