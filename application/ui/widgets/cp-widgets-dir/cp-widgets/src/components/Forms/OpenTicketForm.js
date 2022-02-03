import React, {Component} from 'react';
import i18n from '../../i18n';
import {Form, Select, SelectItem, Button, TextArea, TextInput} from 'carbon-components-react';
import withKeycloak from '../../auth/withKeycloak';
import {apiProjectGet} from '../../api/projects';
import {apiJiraTicketPost} from '../../api/tickets';
import {authenticationChanged, getActiveSubscription, isAuthenticated, isPortalUser} from '../../api/helpers';
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import { apiTicketingSystemConfigResourceGet } from '../../api/manageFieldConfigurations';
class OpenTicketForm extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      project: {},
      role: '',
      invalid: {},
      submitMsg: '',
      submitColour: 'black',
      //form fields
      type: 'Support',
      priority: 'Medium',
      status: 'To Do',
      summary: '',
      description: '',
      types: []
    };
    // TODO: need be dynamic IMP: need to remove
    this.types = ['Support', 'New Feature', 'Bug'];
    this.priorities = ['Critical', 'High', 'Medium', 'Low'];
  }

  componentDidMount() {
    if (isAuthenticated(this.props)) {
      this.fetchData();
      this.getTicketingSystem();
    }
  }

  componentDidUpdate(prevProps) {
    if (authenticationChanged(this.props, prevProps)) {
      this.fetchData();
    }
  }

  async getTicketingSystem() {
    try {
      const { data: ticketTypes } = await apiTicketingSystemConfigResourceGet(this.props.serviceUrl);
      if (ticketTypes && ticketTypes[0].hasOwnProperty('ticketType')) {
        const ticketTypesArr = JSON.parse(ticketTypes[0].ticketType)
        this.setState({ types: ticketTypesArr })
      }
    } catch (error) {
      console.error("Error getTicketingSystem:", error)
    }
  }

  async fetchData() {
    if (!isPortalUser()) {
      return;
    }

    const projectId = this.props.match.params.id;
    let project = (await apiProjectGet(this.props.serviceUrl, projectId)).data;

    if (!project) {
      console.error('Unable to retrieve projectId ', projectId);
      project = {};
    }

    this.setState({
      project: project,
      loading: false,
    });
  }

  handleValidation() {
    let invalid = {};
    let formIsValid = true;

    if (this.state.type === '') {
      formIsValid = false;
      invalid['type'] = true;
    }

    if (this.state.summary === '') {
      formIsValid = false;
      invalid['summary'] = true;
    }

    if (this.state.description === '') {
      formIsValid = false;
      invalid['description'] = true;
    }

    if (this.state.priority === '') {
      formIsValid = false;
      invalid['priority'] = true;
    }

    this.setState({
      invalid: invalid,
    });
    return formIsValid;
  }

  handleChanges = e => {
    const input = e.target;
    const name = input.name;
    const value = input.value;
    this.setState({
      [name]: value,
    });
  };

  handleFormSubmit = event => {
    event.preventDefault();

    const formIsValid = this.handleValidation();

    if (formIsValid) {
      const subscription = getActiveSubscription(this.state.project);
      if (subscription) {
        this.createTicket()
          .then(() => {
            this.setState({
              submitMsg: i18n.t('submitMessages.created'),
              submitColour: '#24a148',
            });
          })
          .catch(() => {
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
    } else {
      this.setState({
        submitMsg: i18n.t('submitMessages.error'),
        submitColour: '#da1e28',
      });
    }
  };

  async createTicket() {
    if (isPortalUser()) {
      const ticket = {
        type: this.state.type,
        summary: this.state.summary,
        description: this.state.description,
        priority: this.state.priority,
        // these fields are just placeholders to validate the POST request (fields will be set in the backend)
        systemId: '999',
        status: 'To Do',
        createDate: '2021-02-22T14:14:09-05:00',
        updateDate: '2021-02-22T14:14:09-05:00',
      };
      return await apiJiraTicketPost(this.props.serviceUrl, this.state.project.id, ticket);
    }
  }

  render() {
    if (!this.state.loading) {
      if (isPortalUser()) {
        return (
          <div id="entando-customer-portal">
            <Breadcrumbs project={this.state.project} locale={this.props.locale}/>
            <div className="form-container">
              <p style={{color: this.state.submitColour}}>{this.state.submitMsg}</p>
              <Form onSubmit={this.handleFormSubmit}>
                <div className="bx--grid">
                  <div className="bx--row" style={{padding: '1em 0'}}>
                    <div className="bx--col">
                      <div className="form-desc">
                        <h4>{i18n.t('supportTicketForm.formTitle')}</h4>
                        <div>{i18n.t('supportTicketForm.desc')}</div>
                      </div>
                    </div>
                  </div>
                  <div className="bx--row">
                    <div className="bx--col">
                      <div>
                        <strong>{i18n.t('projectDetails.project')}:</strong> {this.state.project.name}
                      </div>
                      <Select
                        id="type"
                        name="type"
                        labelText={i18n.t('supportTicketForm.type') + ' *'}
                        value={this.state.type}
                        onChange={this.handleChanges}
                        invalidText={i18n.t('validation.invalid.required')}
                        invalid={this.state.invalid['type']}
                      >
                        {this.state.types.map((type, i) => (
                          <SelectItem key={i} text={type.name} value={type.name}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </Select>
                      <Select
                        id="priority"
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
                        id="summary"
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

export default withKeycloak(OpenTicketForm);
