import React, { Component } from 'react';
import i18n from '../../i18n';
import { ModalWrapper, Form, TextInput, DatePicker, DatePickerInput } from 'carbon-components-react';
import withKeycloak from '../../auth/withKeycloak';
import { apiProductVersionGet, apiProductVersionPut } from '../../api/productVersion';
import moment from 'moment';
import {authenticationChanged, isAuthenticated} from '../../api/helpers';

class EditVersionModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      startDate: '',
      endDate: '',
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

  componentDidUpdate(prevProps) {
    if (authenticationChanged(this.props, prevProps)) {
      this.getVersionDetails();
    }
  }

  handleChanges = e => {
    const input = e.target;
    const name = input.name;
    const value = input.value;
    this.setState({ [name]: value });
  };

  handleStartDateChange = date => {
    this.setState({
      startDate: moment(date[0].toISOString()).format('MM/DD/YYYY'),
    });
  };

  handleEndDateChange = date => {
    this.setState({
      endDate: moment(date[0].toISOString()).format('MM/DD/YYYY'),
    });
  };

  async getVersionDetails() {
    const version = await apiProductVersionGet(this.props.serviceUrl, this.props.version.id);
    this.setState({
      name: version.data.name,
      startDate: moment(version.data.startDate).format('MM/DD/YYYY'),
      endDate: moment(version.data.endDate).format('MM/DD/YYYY'),
      modalId: 'modal-form-version-edit-' + version.data.id,
      buttonId: 'edit-version-button-' + version.data.id,
    });
  }

  async versionPut(version) {
    return await apiProductVersionPut(this.props.serviceUrl, version);
  }

  handleFormSubmit = () => {
    const formIsValid = this.handleValidation();

    if (formIsValid) {
      const version = {
        id: this.props.version.id,
        name: this.state.name,
        startDate: moment(this.state.startDate).format(),
        endDate: moment(this.state.endDate).format(),
      };
      this.versionPut(version)
        .then(() => {
          this.setState({
            submitMsg: i18n.t('submitMessages.updated'),
            submitColour: '#24a148',
          });
          this.props.updateProductVersions();
        })
        .catch(() => {
          this.setState({
            submitMsg: i18n.t('submitMessages.error'),
            submitColour: '#da1e28',
          });
        });
    }
  };

  componentDidMount() {
    if (isAuthenticated(this.props)) {
      this.getVersionDetails();
      const modalOpenButton = document.querySelector('.edit-version-button-' + this.props.version.id);
      modalOpenButton.addEventListener('click', this.clearValues, false);
    }
  }

  render() {
    const modalConfirmation = (
      <div className="bx--modal-header">
        <p style={{color: this.state.submitColour}}>{this.state.submitMsg}</p>
      </div>
    );
    const buttonClassName = 'bx--btn bx--btn--ghost edit-version-button-' + this.props.version.id;
    const modalId = this.state.modalId;
    return (
      <ModalWrapper
        buttonTriggerText={i18n.t('buttons.edit')}
        modalHeading={i18n.t('adminDashboard.addProject.editTitle')}
        buttonTriggerClassName={buttonClassName}
        className="modal-form"
        id={this.state.modalId}
        handleSubmit={this.handleFormSubmit}
        primaryButtonText={i18n.t('modalText.save')}
        secondaryButtonText={i18n.t('modalText.cancel')}
      >
        {modalConfirmation}
        <div className="form-container">
          <Form onSubmit={this.handleFormSubmit} id={'form' + modalId}>
            <TextInput
              id={'name' + modalId}
              name="name"
              labelText={i18n.t('adminDashboard.addProject.projectName') + ' *'}
              value={this.state.name}
              onChange={this.handleChanges}
              invalidText={i18n.t('validation.invalid.required')}
              invalid={this.state.invalid['name']}
            />
            <DatePicker dateFormat="m/d/Y" datePickerType="single" onChange={this.handleStartDateChange}
                        value={this.state.startDate}>
              <DatePickerInput
                id={'startDate' + modalId}
                name="startDate"
                placeholder="mm/dd/yyyy"
                labelText={i18n.t('subscriptionDetails.startDate') + ' *'}
                onChange={this.handleChanges}
                type="text"
                invalidText={i18n.t('validation.invalid.date')}
                invalid={this.state.invalid['startDate']}
              />
            </DatePicker>
            <DatePicker
              dateFormat="m/d/Y"
              datePickerType="single"
              onChange={this.handleEndDateChange}
              id={'endDate' + modalId}
              name="endDate"
              value={this.state.endDate}
            >
              <DatePickerInput
                id={'endDate' + modalId}
                name="endDate"
                placeholder="mm/dd/yyyy"
                labelText={i18n.t('subscriptionDetails.endDate') + ' *'}
                onChange={this.handleChanges}
                type="text"
                invalidText={i18n.t('validation.invalid.date')}
                invalid={this.state.invalid['endDate']}
              />
            </DatePicker>
          </Form>
        </div>
        {modalConfirmation}
      </ModalWrapper>
    );
  }
}

export default withKeycloak(EditVersionModal);
