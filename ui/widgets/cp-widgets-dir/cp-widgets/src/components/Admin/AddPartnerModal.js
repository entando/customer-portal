import React, { Component } from 'react';
import i18n from '../../i18n';
import { ModalWrapper, Form, TextInput, Select, SelectItem, TextArea } from 'carbon-components-react';
import withKeycloak from '../../auth/withKeycloak';
import { apiPartnerPost } from '../../api/partners';
import { apiProjectsGet, apiAddPartnerToProject } from '../../api/projects';

class AddPartnerModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projectList: {},
      projectId: '',
      name: '',
      partnerNumber: '',
      notes: '',
      invalid: {},
      submitMsg: '',
      submitColour: 'black',
    };
  }

  componentDidUpdate(prevProps) {
    const { keycloak } = this.props;
    const authenticated = keycloak.initialized && keycloak.authenticated;

    const changedAuth = prevProps.keycloak.authenticated !== authenticated;

    if (authenticated && changedAuth) {
      this.getProjects();
    }
  }

  handleValidation() {
    let invalid = {};
    let formIsValid = true;

    //project
    if (this.state.projectId === '' || this.state.projectId === 'project-list') {
      formIsValid = false;
      invalid['projectId'] = true;
    }

    if (this.state.name === '') {
      formIsValid = false;
      invalid['name'] = true;
    }

    if (this.state.partnerNumber === '') {
      formIsValid = false;
      invalid['partnerNumber'] = true;
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

  async getProjects() {
    const { keycloak } = this.props;
    const authenticated = keycloak.initialized && keycloak.authenticated;
    if (authenticated) {
      const projects = await apiProjectsGet(this.props.serviceUrl);
      this.setState({ projectList: projects });
    }
  }

  async partnerPost(partner) {
    const { keycloak } = this.props;
    const authenticated = keycloak.initialized && keycloak.authenticated;
    if (authenticated) {
      const result = await apiPartnerPost(this.props.serviceUrl, partner);
      return await apiAddPartnerToProject(this.props.serviceUrl, this.state.projectId, result.data.id);
    }
  }

  handleFormSubmit = () => {
    const formIsValid = this.handleValidation();

    if (formIsValid) {
      const partner = {
        name: this.state.name,
        partnerNumber: this.state.partnerNumber,
        notes: this.state.notes,
      };
      this.partnerPost(partner)
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
    const partnerModalElement = document.querySelector('#modal-form-partner');
    if (!partnerModalElement.className.includes('is-visible')) {
      this.setState({
        projectId: '',
        name: '',
        partnerNumber: '',
        notes: '',
        invalid: {},
        submitMsg: '',
        submitColour: 'black',
      });
    }
  };

  componentDidMount() {
    this.getProjects();

    const modalOpenButton = document.querySelector('.add-partner-button');
    modalOpenButton.addEventListener('click', this.clearValues, false);
  }

  render() {
    const modalConfirmation = (
      <div className="bx--modal-header">
        <p style={{ color: this.state.submitColour }}>{this.state.submitMsg}</p>
      </div>
    )
    return (
      <ModalWrapper
        buttonTriggerText={i18n.t('buttons.addPartner')}
        modalHeading={i18n.t('adminDashboard.addPartner.title')}
        buttonTriggerClassName="add-partner bx--btn bx--btn--tertiary add-partner-button"
        className="modal-form"
        id="modal-form-partner"
        handleSubmit={this.handleFormSubmit}
        primaryButtonText={i18n.t('modalText.save')}
        secondaryButtonText={i18n.t('modalText.cancel')}
      >
        {modalConfirmation}
        <div className="form-container">
          <Form onSubmit={this.handleFormSubmit}>
            <Select
              id="projectId"
              name="projectId"
              labelText={i18n.t('adminDashboard.addPartner.projectList') + ' *'}
              value={this.state.projectId}
              onChange={this.handleChanges}
              invalidText={i18n.t('validation.invalid.required')}
              invalid={this.state.invalid['projectId']}
            >
              <SelectItem text={i18n.t('adminDashboard.addPartner.selectProject')} value="project-list" />
              {Object.keys(this.props.allProjects).length !== 0
                ? this.props.allProjects.map((projectList, i) => (
                    <SelectItem key={i} text={projectList.name} value={projectList.id}>
                      {projectList.name}
                    </SelectItem>
                  ))
                : null}
            </Select>

            <TextInput
              id="name"
              name="name"
              labelText={i18n.t('adminDashboard.addPartner.partnerName') + ' *'}
              value={this.state.name}
              onChange={this.handleChanges}
              invalidText={i18n.t('validation.invalid.required')}
              invalid={this.state.invalid['name']}
            />
            <TextInput
              id="partnerNumber"
              name="partnerNumber"
              labelText={i18n.t('adminDashboard.addPartner.partnerNumber') + ' *'}
              value={this.state.partnerNumber}
              onChange={this.handleChanges}
              invalidText={i18n.t('validation.invalid.required')}
              invalid={this.state.invalid['partnerNumber']}
            />
            <TextArea
              name="notes"
              labelText={i18n.t('adminDashboard.addPartner.notes')}
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

export default withKeycloak(AddPartnerModal);
