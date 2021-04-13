import React, { Component } from 'react';
import i18n from '../../i18n';
import { Form, Select, SelectItem, Button, TextArea, TextInput } from 'carbon-components-react';
import withKeycloak from '../../auth/withKeycloak';
import { apiAdminProjectsGet, apiMyProjectsGet, apiGetProjectSubscriptions } from '../../api/projects';
import { apiJiraTicketPost } from '../../api/tickets';
import { apiTicketingSystemsGet } from '../../api/ticketingsystem';
import {
  isPortalAdmin,
  isPortalAdminOrSupport,
  isPortalCustomer,
  isPortalCustomerOrPartner,
  isPortalPartner,
  isPortalSupport,
  isPortalUser,
} from '../../api/helpers';

class OpenTicket extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      project: {},
      projects: [],
      systemId: '',
      type: 'Bug',
      description: '',
      priority: 'Medium',
      status: 'To Do',
      createDate: '',
      updateDate: '',
      role: '',
      invalid: {},
      submitMsg: '',
      submitColour: 'black',
    };
    this.types = ['Bug', 'Task'];
    this.priorities = ['Highest', 'High', 'Medium', 'Low', 'Lowest'];
  }

  handleValidation() {
    let invalid = {};
    let formIsValid = true;

    if (this.state.project.systemId === undefined || this.state.project.systemId === 'project-list') {
      formIsValid = false;
      invalid['project'] = true;
    }

    if (this.state.type === '' || this.state.type === 'Select') {
      formIsValid = false;
      invalid['type'] = true;
    }

    if (this.state.description === '' || this.state.description === 'Select') {
      formIsValid = false;
      invalid['description'] = true;
    }

    if (this.state.priority === '' || this.state.priority === 'Select') {
      formIsValid = false;
      invalid['priority'] = true;
    }

    this.setState({ invalid: invalid });
    return formIsValid;
  }

  handleChanges = e => {
    const input = e.target;
    const name = input.name;
    const value = input.value;

    if (name === 'project' && value != '' && value != 'project-list') {
      this.setState({
        project: JSON.parse(value),
      });
    } else {
      this.setState({ [name]: value });
    }
  };

  handleFormSubmit = event => {
    event.preventDefault();

    const formIsValid = this.handleValidation();

    if (formIsValid) {
      // check if project has subscription
      this.fetchProjectSubscription(this.state.project.id)
        .then(result => {
          // if project has subscription, create ticket
          if (result.data.length > 0) {
            this.createTicket()
              .then(res => {
                this.setState({
                  submitMsg: i18n.t('submitMessages.created'),
                  submitColour: '#24a148',
                });
              })
              .catch(err => {
                this.setState({
                  submitMsg: i18n.t('submitMessages.ticketError'),
                  submitColour: '#da1e28',
                });
              });
          }
          // if no subscriptions, don't create ticket
          else {
            this.setState({
              submitMsg: i18n.t('submitMessages.subscriptionRequired'),
              submitColour: '#da1e28',
            });
          }
        })
        .catch(error => {
          this.setState({
            submitMsg: i18n.t('submitMessages.error'),
            submitColour: '#da1e28',
          });
        });
    }
  };

  async fetchProjectSubscription(projectId) {
    return await apiGetProjectSubscriptions(this.props.serviceUrl, projectId);
  }

  async fetchProjects() {
    const { t, keycloak } = this.props;
    var authenticated = keycloak.initialized && keycloak.authenticated;

    if (authenticated) {
      if (isPortalAdminOrSupport()) {
        var projects = await apiAdminProjectsGet(this.props.serviceUrl);
        let search = window.location.search;
        let params = new URLSearchParams(search);
        let projectParam = params.get('project');
        if (projectParam) {
          projects.data.forEach(project => {
            if (String(project.id) === projectParam) {
              projects = project;
              this.setState({
                projects: [projects],
                project: projects,
              });
            }
          });
        } else {
          this.setState({
            projects: projects.data,
          });
        }
      } else if (isPortalCustomerOrPartner()) {
        var projects = await apiMyProjectsGet(this.props.serviceUrl);
        let search = window.location.search;
        let params = new URLSearchParams(search);
        let projectParam = params.get('project');
        if (projectParam) {
          projects.data.forEach(project => {
            if (String(project.id) === projectParam) {
              var foundProject = project;
              this.setState({
                projects: [foundProject],
                project: foundProject,
              });
            }
          });
        } else {
          this.setState({
            projects: projects.data,
          });
        }
      }
    }

    this.render();
  }

  async createTicket() {
    const { t, keycloak } = this.props;
    var authenticated = keycloak.initialized && keycloak.authenticated;

    if (authenticated) {
      const ticket = {
        systemId: this.state.project.systemId,
        type: this.state.type,
        summary: this.state.summary,
        description: this.state.description,
        priority: this.state.priority,
        status: 'To Do',
        // these dates are just placeholder to validate the POST request (date will be updated in the backend)
        createDate: '2021-02-22T14:14:09-05:00',
        updateDate: '2021-02-22T14:14:09-05:00',
      };
      return await apiJiraTicketPost(this.props.serviceUrl, this.state.ticketingSystem.systemId, this.state.project.systemId, ticket);
      //const addedTicket = await apiAddTicketToProject(this.props.serviceUrl, this.state.project.id, result.data.id);
    }
  }

  async getTicketingSystem() {
    if (isPortalUser()) {
      const ticketingSystems = await apiTicketingSystemsGet(this.props.serviceUrl);
      const currentTicketingSystem = ticketingSystems.data[ticketingSystems.data.length - 1];
      this.setState({
        ticketingSystem: currentTicketingSystem,
      });
    }
  }

  componentDidMount() {
    const { t, keycloak } = this.props;
    const authenticated = keycloak.initialized && keycloak.authenticated;

    if (authenticated) {
      this.fetchProjects();
      this.getTicketingSystem();
      this.setState({
        loading: false,
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { t, keycloak } = this.props;
    const authenticated = keycloak.initialized && keycloak.authenticated;

    const changedAuth = prevProps.keycloak.authenticated !== authenticated;

    if (authenticated && changedAuth) {
      this.fetchProjects();
      this.getTicketingSystem();
      this.setState({
        loading: false,
      });
    }
  }

  render() {
    if (!this.state.loading && this.state.projects.length !== 0) {
      if (isPortalUser()) {
        return (
          <div>
            {isPortalAdmin() ? (
              <h3 className="pageTitle">{i18n.t('adminDashboard.adminTitle')}</h3>
            ) : isPortalSupport() ? (
              <h3 className="pageTitle">{i18n.t('adminDashboard.supportTitle')}</h3>
            ) : isPortalCustomer() ? (
              <h3 className="pageTitle">{i18n.t('adminDashboard.customerTitle')}</h3>
            ) : isPortalPartner() ? (
              <h3 className="pageTitle">{i18n.t('adminDashboard.partnerTitle')}</h3>
            ) : null}
            <div className="form-container">
              <p style={{ color: this.state.submitColour }}>{this.state.submitMsg}</p>
              <Form onSubmit={this.handleFormSubmit}>
                <div className="form-desc">
                  <h4>{i18n.t('supportTicketForm.formTitle')}</h4>
                  <p>{i18n.t('supportTicketForm.desc')}</p>
                </div>
                <div className="bx--grid">
                  <div className="bx--row">
                    <div className="bx--col">
                      <Select
                        name="project"
                        labelText={i18n.t('supportTicketForm.selectProject') + ' *'}
                        value={JSON.stringify(this.state.project)}
                        onChange={this.handleChanges}
                        invalidText={i18n.t('validation.invalid.required')}
                        invalid={this.state.invalid['project']}
                      >
                        {this.state.projects.length > 1 ? (
                          <SelectItem text={i18n.t('adminDashboard.addPartner.selectProject')} value="project-list" />
                        ) : null}
                        {Object.keys(this.state.projects).length !== 0
                          ? this.state.projects.map((project, i) => {
                              return (
                                <SelectItem key={i} text={project.name} value={JSON.stringify(project)}>
                                  {project.name}
                                </SelectItem>
                              );
                            })
                          : null}
                      </Select>
                      <Select
                        name="type"
                        labelText={i18n.t('supportTicketForm.type') + ' *'}
                        value={this.state.type}
                        onChange={this.handleChanges}
                        invalidText={i18n.t('validation.invalid.required')}
                        invalid={this.state.invalid['type']}
                      >
                        {this.types.map((type, i) => (
                          <SelectItem key={i} text={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </Select>
                      <Select
                        name="priority"
                        labelText={i18n.t('supportTicketForm.priority') + ' *'}
                        value={this.state.priority}
                        onChange={this.handleChanges}
                        invalidText={i18n.t('validation.invalid.required')}
                        invalid={this.state.invalid['priority']}
                      >
                        {this.priorities.map((priority, i) => (
                          <SelectItem key={i} text={priority} value={priority}>
                            {priority}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                  </div>
                  <div className="bx--row">
                    <div className="bx--col">
                      <TextInput
                        labelText={i18n.t('supportTicketForm.ticketSummary') + ' *'}
                        placeholder={i18n.t('supportTicketForm.addticketSummary')}
                        name="summary"
                        value={this.state.summary}
                        onChange={this.handleChanges}
                        invalidText={i18n.t('validation.invalid.required')}
                        invalid={this.state.invalid['summary']}
                      />
                    </div>
                  </div>
                  <div className="bx--row">
                    <div className="bx--col">
                      <TextArea
                        labelText={i18n.t('supportTicketForm.ticketDescription') + ' *'}
                        placeholder={i18n.t('supportTicketForm.addticketDescription')}
                        name="description"
                        value={this.state.description}
                        onChange={this.handleChanges}
                        invalidText={i18n.t('validation.invalid.required')}
                        invalid={this.state.invalid['description']}
                      />
                      <Button kind="primary" tabIndex={0} type="submit">
                        {' '}
                        {i18n.t('buttons.submit')}{' '}
                      </Button>
                    </div>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        );
      } else {
        return <p>{i18n.t('userMessages.unauthorized')}</p>;
      }
    } else {
      return null;
    }
  }
}

export default withKeycloak(OpenTicket);
