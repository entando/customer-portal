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
      contactEmail: '',
      notes: '',
      invalid: {},
      submitMsg: '',
      submitColour: 'black',
    };

    this.baseState = this.state;
  }

  handleValidation() {
    let invalid = {};
    let formIsValid = true;

    if (this.state.name === '') {
      formIsValid = false;
      invalid['name'] = true;
    }

    if (this.state.customerNumber === '') {
      formIsValid = false;
      invalid['customerNumber'] = true;
    }

    if (typeof this.state.contactEmail !== 'undefined') {
      let lastAtPos = this.state.contactEmail.lastIndexOf('@');
      let lastDotPos = this.state.contactEmail.lastIndexOf('.');

      if (
        !(
          lastAtPos < lastDotPos &&
          lastAtPos > 0 &&
          this.state.contactEmail.indexOf('@@') === -1 &&
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

  async customerPost(customer) {
    const { keycloak } = this.props;
    const authenticated = keycloak.initialized && keycloak.authenticated;
    if (authenticated) {
      return await apiCustomerPost(this.props.serviceUrl, customer);
    }
  }

  handleFormSubmit = () => {
    const formIsValid = this.handleValidation();

    if (formIsValid) {
      const customer = {
        name: this.state.name,
        customerNumber: this.state.customerNumber,
        contactName: this.state.contactName,
        contactPhone: this.state.contactPhone,
        contactEmail: this.state.contactEmail,
        notes: this.state.notes,
      };

      this.customerPost(customer)
        .then(() => {
          this.setState({
            submitMsg: i18n.t('submitMessages.added'),
            submitColour: '#24a148',
          });
          this.props.updateCustomerList();
        })
        .catch(() => {
          this.setState({
            submitMsg: i18n.t('submitMessages.error'),
            submitColour: '#da1e28',
          });
        });
    }
  };

  clearValues = () => {
    const customerModalElement = document.querySelector('#modal-form-customer');
    if (!customerModalElement.className.includes('is-visible')) {
      this.setState(this.baseState);
    }
  };

  componentDidMount() {
    const modalOpenButton = document.querySelector('.add-customer-button');
    modalOpenButton.addEventListener('click', this.clearValues, false);
  }

  render() {
    const modalConfirmation = (
      <div className="bx--modal-header">
        <p style={{ color: this.state.submitColour }}>{this.state.submitMsg}</p>
      </div>
    )
    const modalId = "modal-form-customer"
    return (
      <ModalWrapper
        buttonTriggerText={i18n.t('buttons.addCustomer')}
        modalHeading={i18n.t('adminDashboard.addCustomer.title')}
        buttonTriggerClassName="add-customer bx--btn bx--btn--tertiary add-customer-button"
        className="modal-form"
        id={modalId}
        handleSubmit={this.handleFormSubmit}
        primaryButtonText={i18n.t('modalText.save')}
        secondaryButtonText={i18n.t('modalText.cancel')}
      >
        {modalConfirmation}
        <div className="form-container">
          <Form onSubmit={this.handleFormSubmit}>
            <TextInput
              id={"name" + modalId}
              name="name"
              labelText={i18n.t('adminDashboard.addCustomer.customerName') + ' *'}
              value={this.state.name}
              onChange={this.handleChanges}
              invalidText={i18n.t('validation.invalid.required')}
              invalid={this.state.invalid['name']}
            />
            <TextInput
              id={"customerNumber" + modalId}
              name="customerNumber"
              labelText={i18n.t('adminDashboard.addCustomer.customerNumber') + ' *'}
              value={this.state.customerNumber}
              onChange={this.handleChanges}
              invalidText={i18n.t('validation.invalid.required')}
              invalid={this.state.invalid['customerNumber']}
            />
            <TextInput
              id={"contactName" + modalId}
              name="contactName"
              labelText={i18n.t('adminDashboard.addCustomer.contactName')}
              value={this.state.contactName}
              onChange={this.handleChanges}
            />
            <TextInput
              id={"contactPhone" + modalId}
              name="contactPhone"
              labelText={i18n.t('adminDashboard.addCustomer.contactPhone')}
              value={this.state.contactPhone}
              onChange={this.handleChanges}
            />
            <TextInput
              id={"contactEmail" + modalId}
              name="contactEmail"
              labelText={i18n.t('adminDashboard.addCustomer.contactEmail') + ' *'}
              value={this.state.contactEmail}
              onChange={this.handleChanges}
              invalidText={i18n.t('validation.invalid.email')}
              invalid={this.state.invalid['contactEmail']}
            />
            <TextArea
              id={"notes" + modalId}
              name="notes"
              labelText={i18n.t('adminDashboard.addCustomer.notes')}
              value={this.state.notes}
              onChange={this.handleChanges}
            />
          </Form>
        </div>
        {modalConfirmation}
      </ModalWrapper>
    );
  }
}

export default withKeycloak(AddCustomerModal);
