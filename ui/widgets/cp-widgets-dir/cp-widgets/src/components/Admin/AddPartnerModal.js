import React, {Component} from 'react';
import i18n from '../../i18n';
import {ModalWrapper, Form, TextInput, Select, SelectItem, TextArea} from 'carbon-components-react';
import withKeycloak from '../../auth/withKeycloak';
import {apiPartnerPost} from '../../api/partners';
import {apiProjectsGet, apiAddPartnerToProject} from '../../api/projects';
import {authenticationChanged, isAuthenticated} from '../../api/helpers';
import {AuthenticatedView} from '../../auth/KeycloakViews';

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

  componentDidMount() {
    if (isAuthenticated(this.props)) {
      this.fetchData();

      const modalOpenButton = document.querySelector('.add-partner-button');
      modalOpenButton.addEventListener('click', this.clearValues, false);
    }
  }

  componentDidUpdate(prevProps) {
    if (authenticationChanged(this.props, prevProps)) {
      this.fetchData();
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

  async fetchData() {
    if (isAuthenticated(this.props)) {
      let projects = {};
      try {
        projects = (await apiProjectsGet(this.props.serviceUrl)).data;
      } catch (err) {
        console.log(err);
      }
      this.setState({
        projectList: projects ? projects : {},
      });
    }
  }

  async partnerPost(partner) {
    if (isAuthenticated(this.props)) {
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

  render() {
    const modalConfirmation = (
      <div className="bx--modal-header">
        <p style={{color: this.state.submitColour}}>{this.state.submitMsg}</p>
      </div>
    );
    const {keycloak} = this.props;
    const modalId = 'modal-form-partner';
    return (
      <AuthenticatedView keycloak={keycloak}>
        <ModalWrapper
          buttonTriggerText={i18n.t('buttons.addPartner')}
          modalHeading={i18n.t('adminDashboard.addPartner.title')}
          buttonTriggerClassName="add-partner bx--btn bx--btn--tertiary add-partner-button"
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
                id={'projectId' + modalId}
                name="projectId"
                labelText={i18n.t('adminDashboard.addPartner.projectList') + ' *'}
                value={this.state.projectId}
                onChange={this.handleChanges}
                invalidText={i18n.t('validation.invalid.required')}
                invalid={this.state.invalid['projectId']}
              >
                <SelectItem text={i18n.t('adminDashboard.addPartner.selectProject')} value="project-list"/>
                {Object.keys(this.state.projectList).length !== 0
                  ? this.state.projectList.map((project, i) => (
                    <SelectItem key={i} text={project.name} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))
                  : null}
              </Select>

              <TextInput
                id={'name' + modalId}
                name="name"
                labelText={i18n.t('adminDashboard.addPartner.partnerName') + ' *'}
                value={this.state.name}
                onChange={this.handleChanges}
                invalidText={i18n.t('validation.invalid.required')}
                invalid={this.state.invalid['name']}
              />
              <TextInput
                id={'partnerNumber' + modalId}
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
      </AuthenticatedView>
    );
  }
}

export default withKeycloak(AddPartnerModal);
