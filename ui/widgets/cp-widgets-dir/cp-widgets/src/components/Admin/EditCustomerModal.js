import React, { Component } from 'react';
import i18n from '../../i18n';
import { ModalWrapper, Form, TextInput, TextArea } from 'carbon-components-react';
import withKeycloak from '../../auth/withKeycloak';
import { apiCustomerGet, apiCustomerPut } from '../../api/customers';

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
            invalid: {},
            modalId: '',
            buttonId: '',
            submitMsg: '',
            submitColour: 'black'
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
            return await apiCustomerPut(this.props.serviceUrl, customer);
        }
    }

    getCustomerDetails = (customerId) => {
        this.getCustomer(customerId)
    }

    async getCustomer(customerId) {
        const { t, keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;
        if (authenticated) {
            const customer = await apiCustomerGet(this.props.serviceUrl, customerId);
            this.setState({
                name: customer.data.name,
                customerNumber: customer.data.customerNumber,
                contactName: customer.data.contactName,
                contactPhone: customer.data.contactPhone,
                contactEmail:customer.data.contactEmail,
                notes:customer.data.notes,
                modalId: "modal-form-customer-edit-" + customer.data.id,
                buttonId: "edit-customer-button-" + customer.data.id
              })
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
            this.updateCustomer(customer).then(result => {
                this.setState({
                    submitMsg: i18n.t('submitMessages.updated'),
                    submitColour: '#24a148'
                })
                this.props.updateCustomerList();
                this.getCustomerDetails(this.props.customer.id);

            }).catch(err => {
                this.setState({
                    submitMsg: i18n.t('submitMessages.error'),
                    submitColour: '#da1e28'
                })
            });
        }
    };

    clearValues = () => {
        const { keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;

        const customerModalElement = document.querySelector('#' + this.state.modalId);
        if(!customerModalElement.className.includes("is-visible") && authenticated) {
            this.setState({
                name: this.props.customer.name,
                customerNumber: this.props.customer.customerNumber,
                contactName: this.props.customer.contactName,
                contactPhone: this.props.customer.contactPhone,
                contactEmail:this.props.customer.contactEmail,
                notes:this.props.customer.notes,
                invalid: {}
            })
        }
    }

    componentDidMount() {
        const { t, keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;
    
        if (authenticated) {
            if (this.props.customerId) {
                this.getCustomerDetails(this.props.customerId);
            }
        }
    }

    componentDidUpdate(prevProps) {
        const { t, keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;
    
        const changedAuth = prevProps.keycloak.authenticated !== authenticated;
    
        if (authenticated && changedAuth) {
              this.getCustomerDetails(this.props.customerId);
        }
    }

    render() {
        const buttonClassName = "bx--btn bx--btn--ghost edit-customer-button-" + this.props.customer.id;
        return (
            <ModalWrapper
                buttonTriggerText={i18n.t('buttons.edit')}
                modalHeading={i18n.t('adminDashboard.editCustomer.title')}
                buttonTriggerClassName={buttonClassName}
                className="modal-form"
                id={this.state.modalId}
                handleSubmit={this.handleFormSubmit}
                primaryButtonText={i18n.t('modalText.save')}
                secondaryButtonText={i18n.t('modalText.cancel')}
                modalLabel={<p style={{color: this.state.submitColour}}>{this.state.submitMsg}</p>}
            >
                <div className="form-container">
                    <Form onSubmit={this.handleFormSubmit}>
                        <TextInput
                            name="name"
                            labelText={i18n.t('adminDashboard.addCustomer.customerName') + " *"}
                            value={this.state.name}
                            onChange={this.handleChanges}
                            invalidText={i18n.t('validation.invalid.required')}
                            invalid={this.state.invalid['name']}
                        />
                        <TextInput
                            name="customerNumber"
                            labelText={i18n.t('adminDashboard.addCustomer.customerNumber') + " *"}
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
                            labelText={i18n.t('adminDashboard.addCustomer.contactEmail') + " *"}
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
                    </Form>
                </div>
            </ModalWrapper>
        );
    }
}

export default withKeycloak(EditCustomerModal);
