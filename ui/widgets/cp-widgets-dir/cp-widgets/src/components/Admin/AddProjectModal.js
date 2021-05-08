import React, { Component } from 'react';
import i18n from '../../i18n';
import { ModalWrapper, Form, TextInput, Select, SelectItem, TextArea } from 'carbon-components-react';
import withKeycloak from '../../auth/withKeycloak';
import { apiCustomersGet, apiAddProjectToCustomer } from '../../api/customers';
import { apiProjectPost, apiProjectsGet } from '../../api/projects';

class AddProjectModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projects: {},
      customerList: {},
      customerId: '',
      name: '',
      description: '',
      systemId: '',
      contactName: '',
      contactPhone: '',
      contactEmail: '',
      notes: '',
      invalid: {},
      submitMsg: '',
      submitColour: 'black',
    };
  }

  handleValidation() {
    let invalid = {};
    let formIsValid = true;

    //customer
    if (this.state.customerId === '' || this.state.customerId === 'customer-list') {
      formIsValid = false;
      invalid['customerId'] = true;
    }

    //name
    if (this.state.name === '') {
      formIsValid = false;
      invalid['name'] = true;
    }

    //description
    if (this.state.description === '') {
      formIsValid = false;
      invalid['description'] = true;
    }

    //contactEmail
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

  async getAllProjects() {
    const projects = await apiProjectsGet(this.props.serviceUrl);
    this.setState({
      projects: projects.data,
    });
  }

  componentDidUpdate(prevProps) {
    const { keycloak } = this.props;
    const authenticated = keycloak.initialized && keycloak.authenticated;

    const changedAuth = prevProps.keycloak.authenticated !== authenticated;

    if (authenticated && changedAuth) {
      this.getCustomers();
      this.getAllProjects();
    }
  }

  handleChanges = e => {
    const input = e.target;
    const name = input.name;
    const value = input.value;
    this.setState({ [name]: value });
  };

  async getCustomers() {
    const { keycloak } = this.props;
    const authenticated = keycloak.initialized && keycloak.authenticated;
    if (authenticated) {
      const customers = await apiCustomersGet(this.props.serviceUrl);
      this.setState({ customerList: customers });
    }
  }

  async projectPost(project) {
    const { keycloak } = this.props;
    const authenticated = keycloak.initialized && keycloak.authenticated;
    if (authenticated) {
      const result = await apiProjectPost(this.props.serviceUrl, project);
      return await apiAddProjectToCustomer(this.props.serviceUrl, this.state.customerId, result.data.id);
    }
  }

  handleFormSubmit = () => {
    const formIsValid = this.handleValidation();

    if (formIsValid) {
      const project = {
        name: this.state.name,
        description: this.state.description,
        systemId: this.state.systemId,
        contactName: this.state.contactName,
        contactPhone: this.state.contactPhone,
        contactEmail: this.state.contactEmail,
        notes: this.state.notes,
      };
      for (var i = 0; i < this.state.projects.length; i++) {
        if (project.systemId === this.state.projects[i].systemId && project.systemId.trim() !== '') {
          window.alert('That system id is already in use in another project');
          return;
        }
      }
      this.projectPost(project)
        .then(() => {
          this.setState({
            submitMsg: i18n.t('submitMessages.added'),
            submitColour: '#24a148',
          });
          this.props.updateCustomerList();
          this.getAllProjects();
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
    const projectModalElement = document.querySelector('#modal-form-project');
    if (!projectModalElement.className.includes('is-visible')) {
      this.setState({
        customerId: '',
        name: '',
        description: '',
        systemId: '',
        contactName: '',
        contactPhone: '',
        contactEmail: '',
        notes: '',
        invalid: {},
      });
    }
  };

  componentDidMount() {
    this.getCustomers();
    this.getAllProjects();

    const modalOpenButton = document.querySelector('.add-project-button');
    modalOpenButton.addEventListener('click', this.clearValues, false);
  }

  render() {
    const modalConfirmation = (
      <div className="bx--modal-header">
        <p style={{color: this.state.submitColour}}>{this.state.submitMsg}</p>
      </div>
    );
    const modalId = 'modal-form-project';
    return (
      <ModalWrapper
        buttonTriggerText={i18n.t('buttons.addProject')}
        modalHeading={i18n.t('adminDashboard.addProject.title')}
        buttonTriggerClassName="add-project bx--btn bx--btn--tertiary add-project-button"
        className="modal-form"
        id={modalId}
        handleSubmit={this.handleFormSubmit}
        primaryButtonText={i18n.t('modalText.save')}
        secondaryButtonText={i18n.t('modalText.cancel')}
      >
        {modalConfirmation}
        <div className="form-container">
          <Form onSubmit={this.handleFormSubmit}>
            <Select
              id={'customerId' + modalId}
              name="customerId"
              labelText={i18n.t('adminDashboard.addProject.customerList') + ' *'}
              value={this.state.customerId}
              onChange={this.handleChanges}
              invalidText={i18n.t('validation.invalid.required')}
              invalid={this.state.invalid['customerId']}
            >
              <SelectItem text={i18n.t('adminDashboard.addProject.selectCustomer')} value="customer-list" />
              {Object.keys(this.props.allCustomers).length !== 0
                ? this.props.allCustomers.map((customerList, i) => (
                    <SelectItem key={i} text={customerList.name} value={customerList.id}>
                      {customerList.name}
                    </SelectItem>
                  ))
                : null}
            </Select>

            <TextInput
              id={'name' + modalId}
              name="name"
              labelText={i18n.t('adminDashboard.addProject.projectName') + ' *'}
              value={this.state.name}
              onChange={this.handleChanges}
              invalidText={i18n.t('validation.invalid.required')}
              invalid={this.state.invalid['name']}
            />
            <TextInput
              id={'description' + modalId}
              name="description"
              labelText={i18n.t('adminDashboard.addProject.projectDesc') + ' *'}
              value={this.state.description}
              onChange={this.handleChanges}
              invalidText={i18n.t('validation.invalid.required')}
              invalid={this.state.invalid['description']}
            />
            <TextInput
              id={'systemId' + modalId}
              name="systemId"
              labelText={i18n.t('adminDashboard.addProject.systemId')}
              value={this.state.systemId}
              onChange={this.handleChanges}
            />
            <TextInput
              id={'contactName' + modalId}
              name="contactName"
              labelText={i18n.t('adminDashboard.addProject.contactName')}
              value={this.state.contactName}
              onChange={this.handleChanges}
            />
            <TextInput
              id={'contactPhone' + modalId}
              name="contactPhone"
              labelText={i18n.t('adminDashboard.addProject.contactPhone')}
              value={this.state.contactPhone}
              onChange={this.handleChanges}
            />
            <TextInput
              id={'contactEmail' + modalId}
              name="contactEmail"
              labelText={i18n.t('adminDashboard.addProject.contactEmail') + ' *'}
              value={this.state.contactEmail}
              onChange={this.handleChanges}
              invalidText={i18n.t('validation.invalid.email')}
              invalid={this.state.invalid['contactEmail']}
            />
            <TextArea
              id={'notes' + modalId}
              name="notes"
              labelText={i18n.t('adminDashboard.addProject.notes')}
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

export default withKeycloak(AddProjectModal);
