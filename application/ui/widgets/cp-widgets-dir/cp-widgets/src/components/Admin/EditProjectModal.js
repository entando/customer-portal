import React, { Component } from 'react';
import i18n from '../../i18n';
import {Modal, Form, TextInput, TextArea} from 'carbon-components-react';
import withKeycloak from '../../auth/withKeycloak';
import { apiCustomersGet } from '../../api/customers';
import {apiProjectGet, apiProjectPut, apiProjectsGet} from '../../api/projects';
import {authenticationChanged, isAuthenticated} from "../../api/helpers";

class EditProjectModal extends Component {
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

    //description
    if (this.state.description === '') {
      formIsValid = false;
      invalid['description'] = true;
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

  async getCustomers() {
    if (isAuthenticated(this.props)) {
      const customers = await apiCustomersGet(this.props.serviceUrl);
      this.setState({customerList: customers});
    }
  }

  async getProjectDetails() {
    if (isAuthenticated(this.props)) {
      const project = await apiProjectGet(this.props.serviceUrl, this.props.project.id);
      this.setState({
        name: project.data.name,
        description: project.data.description,
        systemId: project.data.systemId,
        contactName: project.data.contactName,
        contactPhone: project.data.contactPhone,
        contactEmail: project.data.contactEmail,
        notes: project.data.notes,
        modalId: 'modal-form-project-edit-' + project.data.id,
        buttonId: 'edit-project-button-' + project.data.id,
      });
    }
  }

  async getAllProjects() {
    const projects = await apiProjectsGet(this.props.serviceUrl);
    this.setState({
      projects: projects.data,
    });
  }

  async projectPut(project) {
    if (isAuthenticated(this.props)) {
      return await apiProjectPut(this.props.serviceUrl, project);
    }
  }

  handleFormSubmit = () => {
    const formIsValid = this.handleValidation();

    if (formIsValid) {
      const project = {
        id: this.props.project.id,
        customer: this.props.project.customer,
        name: this.state.name,
        description: this.state.description,
        systemId: this.state.systemId,
        contactName: this.state.contactName,
        contactPhone: this.state.contactPhone,
        contactEmail: this.state.contactEmail,
        notes: this.state.notes,
      };
      for (var i = 0; i < this.props.allProjects.length; i++) {
        if (
          project.systemId === this.props.allProjects[i].systemId &&
          project.id !== this.props.allProjects[i].id &&
          project.systemId.trim() !== ''
        ) {
          window.alert('That system id is already in use in another project');
          return;
        }
      }
      this.projectPut(project)
        .then(() => {
          this.setState({
            submitMsg: i18n.t('submitMessages.updated'),
            submitColour: '#24a148',
          });
          this.props.updateProjectList();
          //For now leave the modal open after saving
          // this.props.closeModal();
        })
        .catch((e) => {
          console.log(e);
          this.setState({
            submitMsg: i18n.t('submitMessages.error'),
            submitColour: '#da1e28',
          });
        });
    }
  };

  componentDidMount() {
    if (isAuthenticated(this.props)) {
      this.getCustomers();
      this.getAllProjects();
      this.getProjectDetails();
    }
  }

  componentDidUpdate(prevProps) {
    if (authenticationChanged(this.props, prevProps)) {
      this.getCustomers();
      this.getAllProjects();
      this.getProjectDetails();
    }
  }


  render() {
    const modalConfirmation = (
      <div className="bx--modal-header">
        <p style={{color: this.state.submitColour}}>{this.state.submitMsg}</p>
      </div>
    );
    const modalId = this.state.modalId;
    return (
      <Modal
        id={this.state.modalId}
        className="modal-form"
        open={this.props.open}
        onRequestClose={this.props.closeModal}
        onRequestSubmit={this.handleFormSubmit}
        modalHeading={i18n.t('adminDashboard.addProject.editTitle')}
        primaryButtonText={i18n.t('modalText.save')}
        secondaryButtonText={i18n.t('modalText.cancel')}
      >
        {modalConfirmation}
        <div className="form-container">
          <Form onSubmit={this.handleFormSubmit}>
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
              labelText={i18n.t('adminDashboard.addProject.contactEmail')}
              value={this.state.contactEmail}
              onChange={this.handleChanges}
              invalidText={i18n.t('validation.invalid.email')}
              invalid={this.state.invalid['contactEmail']}
            />
            <TextArea
              name="notes"
              labelText={i18n.t('adminDashboard.addProject.notes')}
              value={this.state.notes}
              onChange={this.handleChanges}
            />
          </Form>
        </div>
        {modalConfirmation}
      </Modal>
    );
  }
}

export default withKeycloak(EditProjectModal);
