import React, { Component } from 'react';
import i18n from '../../i18n';
import { ModalWrapper, Form, TextInput, DatePicker, DatePickerInput } from 'carbon-components-react';
import withKeycloak from '../../auth/withKeycloak';
import { apiProductVersionPost } from '../../api/productVersion';

class AddProductVersionModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      startDate: '',
      endDate: '',
      invalid: {}
    };

    this.baseState = this.state
  }

  handleValidation() {
    let invalid = {};
    let formIsValid = true;

    //name
    if (this.state.name === '') {
      formIsValid = false;
      invalid['name'] = true;
    }

    if (typeof this.state.startDate !== 'undefined') {
      if (!this.state.startDate.match(/^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/)) {
        formIsValid = false;
        invalid['startDate'] = true;
      }
    }

    if (typeof this.state.endDate !== 'undefined') {
      if (!this.state.endDate.match(/^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/)) {
        formIsValid = false;
        invalid['endDate'] = true;
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

  handleFormSubmit = e => {
    const formIsValid = this.handleValidation();

    if (formIsValid) {
      const productVersion = apiProductVersionPost(this.props.serviceUrl, this.state);
      this.render();
      window.location.reload(false);
    }
  };

  clearValues = () => {
    const customerModalElement = document.querySelector('#modal-form-product-version');
    if(!customerModalElement.className.includes("is-visible")) {
      this.setState(this.baseState);
    }
  }

  componentDidMount() {
    const modalOpenButton = document.querySelector('.add-product-version-button');
    modalOpenButton.addEventListener("click", this.clearValues, false);
  }

  render() {
    return (
      <ModalWrapper
        buttonTriggerText={i18n.t('buttons.addProductVersion')}
        modalHeading={i18n.t('adminDashboard.addProductVersion.title')}
        buttonTriggerClassName="add-product-version bx--btn bx--btn--tertiary add-product-version-button"
        className="modal-form"
        id="modal-form-product-version"
        handleSubmit={this.handleFormSubmit}
      >
        <div className="form-container">
          <p> {i18n.t('adminDashboard.addProductVersion.desc')} </p>
          <Form onSubmit={this.handleFormSubmit}>
            <TextInput
              name="name"
              labelText={i18n.t('adminDashboard.addProductVersion.productVersion')}
              value={this.state.name}
              onChange={this.handleChanges}
              invalidText={i18n.t('validation.invalid.required')}
              invalid={this.state.invalid['name']}
            />
            <DatePicker dateFormat="m/d/Y" datePickerType="simple">
              <DatePickerInput
                name="startDate"
                placeholder="mm/dd/yyyy"
                labelText={i18n.t('adminDashboard.addProductVersion.productVersionStartDate')}
                value={this.state.startDate}
                onChange={this.handleChanges}
                type="text"
                invalidText={i18n.t('validation.invalid.date')}
                invalid={this.state.invalid['startDate']}
              />
            </DatePicker>
            <DatePicker dateFormat="m/d/Y" datePickerType="simple">
              <DatePickerInput
                name="endDate"
                placeholder="mm/dd/yyyy"
                labelText={i18n.t('adminDashboard.addProductVersion.productVersionEndDate')}
                value={this.state.endDate}
                onChange={this.handleChanges}
                type="text"
                invalidText={i18n.t('validation.invalid.date')}
                invalid={this.state.invalid['endDate']}
              />
            </DatePicker>
          </Form>
        </div>
      </ModalWrapper>
    );
  }
}

export default withKeycloak(AddProductVersionModal);
