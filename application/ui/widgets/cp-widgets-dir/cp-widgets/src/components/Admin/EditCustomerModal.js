import React, {Component} from 'react';
import i18n from '../../i18n';
import {ModalWrapper, Form, TextInput, TextArea} from 'carbon-components-react';
import withKeycloak from '../../auth/withKeycloak';
import {apiCustomerGet, apiCustomerPut} from '../../api/customers';
import {authenticationChanged, isAuthenticated} from '../../api/helpers';
import ButtonBody from '../Buttons/ButtonBody';
import {IconEdit} from '../../helpers/icons'

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
      submitColour: 'black',
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
    if (isAuthenticated(this.props)) {
      return await apiCustomerPut(this.props.serviceUrl, customer);
    }
  }

  getCustomerDetails = customerId => {
    this.getCustomer(customerId);
  };

  async getCustomer(customerId) {
    if (isAuthenticated(this.props)) {
      const customer = (await apiCustomerGet(this.props.serviceUrl, customerId)).data;
      this.setState({
        name: customer.name,
        customerNumber: customer.customerNumber,
        contactName: customer.contactName,
        contactPhone: customer.contactPhone,
        contactEmail: customer.contactEmail,
        notes: customer.notes,
        modalId: 'modal-form-customer-edit-' + customer.id,
        buttonId: 'edit-customer-button-' + customer.id,
      });
    }
  }

  handleFormSubmit = () => {
    const formIsValid = this.handleValidation();

    if (formIsValid) {
      const customer = {
        id: this.props.customer.id,
        name: this.state.name,
        customerNumber: this.state.customerNumber,
        contactName: this.state.contactName,
        contactPhone: this.state.contactPhone,
        contactEmail: this.state.contactEmail,
        notes: this.state.notes,
      };
      this.updateCustomer(customer)
        .then(() => {
          this.setState({
            submitMsg: i18n.t('submitMessages.updated'),
            submitColour: '#24a148',
          });
          this.props.updateCustomerList();
          this.getCustomerDetails(this.props.customer.id);
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
    const customerModalElement = document.querySelector('#' + this.state.modalId);
    if (!customerModalElement.className.includes('is-visible')) {
      this.setState({
        name: this.props.customer.name,
        customerNumber: this.props.customer.customerNumber,
        contactName: this.props.customer.contactName,
        contactPhone: this.props.customer.contactPhone,
        contactEmail: this.props.customer.contactEmail,
        notes: this.props.customer.notes,
        invalid: {},
      });
    }
  };

  componentDidMount() {
    if (isAuthenticated(this.props)) {
      if (this.props.customerId) {
        this.getCustomerDetails(this.props.customerId);
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (authenticationChanged(this.props, prevProps)) {
      this.getCustomerDetails(this.props.customerId);
    }
  }

  render() {
    const modalConfirmation = (
      <div className="bx--modal-header">
        <p style={{color: this.state.submitColour}}>{this.state.submitMsg}</p>
      </div>
    );
    const modalId = this.state.modalId;
    const buttonClassName = 'bx--btn bx--btn--ghost edit-customer-button-' + this.props.customerId;
    return (
      modalId && (
        <ModalWrapper
          buttonTriggerText={<ButtonBody label='buttons.edit' icon={IconEdit}/>}
          modalHeading={i18n.t('adminDashboard.editCustomer.title')}
          buttonTriggerClassName={buttonClassName}
          className="modal-form"
          id={modalId}
          handleSubmit={this.handleFormSubmit}
          primaryButtonText={i18n.t('modalText.save')}
          secondaryButtonText={i18n.t('modalText.cancel')}
        >
          {modalConfirmation}
          <div className="form-container">
            <Form onSubmit={this.handleFormSubmit} id={'form-' + modalId}>
              <TextInput
                id={'name' + modalId}
                name="name"
                labelText={i18n.t('adminDashboard.addCustomer.customerName') + ' *'}
                value={this.state.name}
                onChange={this.handleChanges}
                invalidText={i18n.t('validation.invalid.required')}
                invalid={this.state.invalid['name']}
              />
              <TextInput
                id={'customerNumber' + modalId}
                name="customerNumber"
                labelText={i18n.t('adminDashboard.addCustomer.customerNumber') + ' *'}
                value={this.state.customerNumber}
                onChange={this.handleChanges}
                invalidText={i18n.t('validation.invalid.required')}
                invalid={this.state.invalid['customerNumber']}
              />
              <TextInput
                id={'contactName' + modalId}
                name="contactName"
                labelText={i18n.t('adminDashboard.addCustomer.contactName')}
                value={this.state.contactName}
                onChange={this.handleChanges}
              />
              <TextInput
                id={'contactPhone' + modalId}
                name="contactPhone"
                labelText={i18n.t('adminDashboard.addCustomer.contactPhone')}
                value={this.state.contactPhone}
                onChange={this.handleChanges}
              />
              <TextInput
                id={'contactEmail' + modalId}
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
            </Form>
          </div>
          {modalConfirmation}
        </ModalWrapper>
      )
    );
  }
}

export default withKeycloak(EditCustomerModal);
