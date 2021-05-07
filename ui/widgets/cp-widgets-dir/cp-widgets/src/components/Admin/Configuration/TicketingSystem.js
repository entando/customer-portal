import React, { Component } from 'react';
import i18n from '../../../i18n';
import { Form, TextInput, Select, SelectItem, Button } from 'carbon-components-react';
import {
  apiCurrentTicketingSystemGet,
  apiTicketingSystemDelete,
  apiTicketingSystemPost,
  apiTicketingSystemPut,
} from '../../../api/ticketingsystem';
import {authenticationChanged, isAuthenticated, isPortalAdmin} from '../../../api/helpers';
import withKeycloak from '../../../auth/withKeycloak';

class TicketingSystem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticketingSystem: {},
      ticketingSystemType: 'Jira',
      url: '',
      serviceAccount: '',
      serviceAccountSecret: '',
      systemId: '',
      submitMsg: '',
      submitColour: 'black',
    };
  }

  handleChanges = e => {
    const input = e.target;
    const name = input.name;
    const value = input.value;
    this.setState({ [name]: value });
  };

  async createTicketingSystem() {
    const ticketingSystem = {
      url: this.state.url,
      serviceAccount: this.state.serviceAccount,
      serviceAccountSecret: this.state.serviceAccountSecret,
      systemId: this.state.systemId,
    };
    const response = (await apiTicketingSystemPost(this.props.serviceUrl, ticketingSystem)).data;
    this.setState({
      ticketingSystem: response,
    });
  }

  async updateTicketingSystem() {
    const ticketingSystem = {
      id: this.state.ticketingSystem.id,
      url: this.state.url,
      serviceAccount: this.state.serviceAccount,
      serviceAccountSecret: this.state.serviceAccountSecret,
      systemId: this.state.systemId,
    };
    return await apiTicketingSystemPut(this.props.serviceUrl, ticketingSystem);
  }

  async fetchData() {
    const ticketingSystem = await apiCurrentTicketingSystemGet(this.props.serviceUrl);
    this.setState({
      ticketingSystem: ticketingSystem,
      url: ticketingSystem ? ticketingSystem.url : '',
      serviceAccount: ticketingSystem ? ticketingSystem.serviceAccount : '',
      //Secret needs to be entered each time
      systemId: ticketingSystem ? ticketingSystem.systemId : '',
    });
  }

  componentDidMount() {
    if (isAuthenticated(this.props)) {
      this.fetchData();
    }
  }

  componentDidUpdate(prevProps) {
    if (authenticationChanged(this.props, prevProps)) {
      this.fetchData();
    }
  }

  async deleteTicketingSystem() {
    return await apiTicketingSystemDelete(this.props.serviceUrl, this.state.ticketingSystem.id);
  }

  handleDelete() {
    if (window.confirm('Are you sure you want to delete this ticketing system?')) {
      this.deleteTicketingSystem()
        .then(() => {
          this.setState({
            submitMsg: i18n.t('submitMessages.deleted'),
            submitColour: '#24a148',
          });
          this.fetchData();
        })
        .catch(() => {
          this.setState({
            submitMsg: i18n.t('submitMessages.error'),
            submitColour: '#da1e28',
          });
        });
    }
  }

  handleFormSubmit = event => {
    event.preventDefault();
    if (!this.state.ticketingSystem) {
      this.createTicketingSystem()
        .then(() => {
          this.setState({
            submitMsg: i18n.t('submitMessages.created'),
            submitColour: '#24a148',
          });
        })
        .catch(() => {
          this.setState({
            submitMsg: i18n.t('submitMessages.error'),
            submitColour: '#da1e28',
          });
        });
    } else {
      this.updateTicketingSystem()
        .then(() => {
          this.setState({
            submitMsg: i18n.t('submitMessages.updated'),
            submitColour: '#24a148',
          });
        })
        .catch(() => {
          this.setState({
            submitMsg: i18n.t('submitMessages.error'),
            submitColour: '#da1e28',
          });
        });
    }
  };

  render() {
    const ticketingSystemTypes = ['Jira'];
    if (isPortalAdmin()) {
      return (
        <div className="cp-form">
          <p style={{ color: this.state.submitColour }}>{this.state.submitMsg}</p>
          <Form onSubmit={this.handleFormSubmit}>
            <div className="bx--grid">
              <div className="bx--row">
                <div className="bx--col">
                  <Select
                    id="ticketingSystemType"
                    name="ticketingSystemType"
                    labelText={i18n.t('adminConfig.integrationTicketingSystem.selectBackendTicketingSystem')}
                    value={this.state.ticketingSystemType}
                    onChange={this.handleChanges}
                  >
                    <SelectItem text={i18n.t('adminConfig.integrationTicketingSystem.select')}
                                value="ticketing-system"/>
                    {ticketingSystemTypes.map((type, i) => (
                      <SelectItem key={i} text={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </Select>
                  <TextInput
                    id="serviceAccount"
                    name="serviceAccount"
                    labelText={i18n.t('adminConfig.integrationTicketingSystem.userName')}
                    value={this.state.serviceAccount}
                    onChange={this.handleChanges}
                  />
                  <TextInput
                    id="systemId"
                    name="systemId"
                    labelText={i18n.t('adminConfig.integrationTicketingSystem.projectName')}
                    value={this.state.systemId}
                    onChange={this.handleChanges}
                  />
                </div>
                <div className="bx--col">
                  <TextInput
                    id="url"
                    name="url"
                    labelText={i18n.t('adminConfig.integrationTicketingSystem.url')}
                    value={this.state.url}
                    onChange={this.handleChanges}
                  />
                  <TextInput
                    id="serviceAccountSecret"
                    name="serviceAccountSecret"
                    type="password"
                    labelText={i18n.t('adminConfig.integrationTicketingSystem.password')}
                    value={this.state.serviceAccountSecret}
                    onChange={this.handleChanges}
                  />
                </div>
              </div>
              <Button kind="primary" tabIndex={0} type="submit">
                {' '}
                {i18n.t('buttons.submit')}{' '}
              </Button>
              {this.state.ticketingSystem ? (
                <Button kind="danger" onClick={() => this.handleDelete()}>
                  {' '}
                  Delete{' '}
                </Button>
              ) : null}
            </div>
          </Form>
        </div>
      );
    }
    // Unauthorized
    else {
      return <p>{i18n.t('userMessages.unauthorized')}</p>;
    }
  }
}

export default withKeycloak(TicketingSystem);
