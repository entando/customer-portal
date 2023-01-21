import React, {Component} from 'react';
import i18n from '../../i18n';
import {Form, Select, SelectItem, Button, TextArea, TextInput} from 'carbon-components-react';
import withKeycloak from '../../auth/withKeycloak';
import {apiProjectGet} from '../../api/projects';
import {apiJiraTicketPost} from '../../api/tickets';
import {authenticationChanged, getActiveSubscription, isAuthenticated, isPortalUser} from '../../api/helpers';
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import { apiTicketingSystemConfigResourceGet } from '../../api/manageFieldConfigurations';
import {apiCurrentTicketingSystemGet, getTicketUrl} from '../../api/ticketingsystem';
class OpenTicketForm extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      disabled: false,
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
      types: [],
      ticketId: null,
      ticketingSystem: null
    };
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
      const ticketingSystem = await apiCurrentTicketingSystemGet(this.props.serviceUrl);
      this.setState({ ticketingSystem: ticketingSystem})

      const { data: ticketTypes } = await apiTicketingSystemConfigResourceGet(this.props.serviceUrl);
      if (ticketTypes && ticketTypes[0].hasOwnProperty('ticketType')) {
        const ticketTypesArr = JSON.parse(ticketTypes[0].ticketType)
        ticketTypesArr.sort((a,b) => String(a.name).localeCompare(b.name))
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
      //Disable the form after submission
      this.setState({
        disabled: true
      });

      const subscription = getActiveSubscription(this.state.project);
      if (subscription) {
        this.createTicket()
          .then((response) => {
            this.setSubmitMessage('submitMessages.created', true);
            this.setState ({
              ticketId: response.data.systemId
            });
          })
          .catch(() => {
            this.setSubmitMessage('submitMessages.ticketError', false);
          });
      }
      // if no subscriptions, don't create ticket
      else {
        this.setSubmitMessage('submitMessages.subscriptionRequired', false);
      }
    } else {
      this.setSubmitMessage('submitMessages.error', false);
    }
  };

  setSubmitMessage = (message, success) => {
    this.setState({
      submitMsg: i18n.t(message),
      submitColour: success ? '#24a148' : '#da1e28',
      disabled: success
    });
  }

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
        const viewTicket = this.state.ticketId && (
          <div>
            <strong>{i18n.t('ticketDetails.viewTicket')}: </strong>
            <a href={getTicketUrl(this.state.ticketingSystem, this.state.ticketId)} target="_blank" rel="noreferrer">
              {this.state.ticketId}
            </a>
          </div>
        );

        return (
          <div id="entando-customer-portal">
            <Breadcrumbs project={this.state.project} locale={this.props.locale}/>
            <div className="form-container">
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
                      <Button kind="primary" tabIndex={0} type="submit" disabled={this.state.disabled}>
                        {' '}
                        {i18n.t('buttons.submit')}{' '}
                      </Button>
                      <p style={{color: this.state.submitColour}}>{this.state.submitMsg}</p>
                      {viewTicket}
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
