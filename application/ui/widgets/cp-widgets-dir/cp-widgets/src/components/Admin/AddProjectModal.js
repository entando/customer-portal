import React, {Component} from 'react';
import i18n from '../../i18n';
import {ModalWrapper, Form, TextInput, TextArea} from 'carbon-components-react';
import withKeycloak from '../../auth/withKeycloak';
import {apiAddProjectToCustomer} from '../../api/customers';
import {apiProjectPost, apiProjectsGet} from '../../api/projects';
import {authenticationChanged, isAuthenticated} from "../../api/helpers";
import IconPlus from '../../assets/IconPlus.svg';
import ButtonBody from '../Buttons/ButtonBody';

class AddProjectModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalId: 'modal-form-project-' + props.customerId,
      projects: {},
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

  //TODO: refactor to make this a validation call instead of loading all projects ahead of time
  async getAllProjects() {
    let projects = {}
    try {
      projects = await apiProjectsGet(this.props.serviceUrl);
    } catch (err) {
      console.log(err);
    }
    this.setState({
      projects: projects.data ? projects.data : {},
    });
  }

  componentDidUpdate(prevProps) {
    if (authenticationChanged(this.props, prevProps)) {
      this.getAllProjects();
    }
  }

  handleChanges = e => {
    const input = e.target;
    const name = input.name;
    const value = input.value;
    this.setState({ [name]: value });
  };

  async projectPost(project) {
    if (isAuthenticated(this.props)) {
      const result = await apiProjectPost(this.props.serviceUrl, project);
      return await apiAddProjectToCustomer(this.props.serviceUrl, this.props.customer.id, result.data.id);
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
    const projectModalElement = document.querySelector('#' + this.state.modalId);
    if (!projectModalElement.className.includes('is-visible')) {
      this.setState({
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
    const modalId = this.state.modalId;
    return (
      <ModalWrapper
        buttonTriggerText={<ButtonBody label='buttons.addProject' icon={IconPlus}/>}
        modalHeading={i18n.t('adminDashboard.addProject.title')}
        buttonTriggerClassName="bx--btn bx--btn--ghost add-project-button"
        className="modal-form"
        id={modalId}
        handleSubmit={this.handleFormSubmit}
        primaryButtonText={i18n.t('modalText.save')}
        secondaryButtonText={i18n.t('modalText.cancel')}
      >
        {modalConfirmation}
        <div className="form-container">
          <Form onSubmit={this.handleFormSubmit}>
            <div>
              <span>{i18n.t('adminDashboard.addCustomer.customerName')}:</span> {this.props.customer.name}
            </div>
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
