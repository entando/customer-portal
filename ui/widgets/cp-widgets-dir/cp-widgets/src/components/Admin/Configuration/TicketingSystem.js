import React, { Component } from 'react';
import i18n from '../../../i18n';
import { Form, TextInput, Select, SelectItem, Button } from 'carbon-components-react';
import {
  apiTicketingSystemPost,
  apiTicketingSystemsGet,
  apiTicketingSystemPut,
  apiTicketingSystemDelete,
} from '../../../api/ticketingsystem';
import { isPortalAdmin } from '../../../api/helpers';
import withKeycloak from '../../../auth/withKeycloak';

class TicketingSystem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticketingSystem: '',
      ticketingSystemType: '',
      url: '',
      serviceAccount: '',
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
    return await apiTicketingSystemPost(this.props.serviceUrl, ticketingSystem);
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

  async getTicketingSystems() {
    const ticketingSystems = await apiTicketingSystemsGet(this.props.serviceUrl);
    if (ticketingSystems.data.length > 0) {
      const currentTicketingSystem = ticketingSystems.data[ticketingSystems.data.length - 1];

      this.setState({
        ticketingSystem: currentTicketingSystem,
        url: currentTicketingSystem.url,
        serviceAccount: currentTicketingSystem.serviceAccount,
        serviceAccountSecret: currentTicketingSystem.serviceAccountSecret,
        systemId: currentTicketingSystem.systemId,
      });
    }
  }

  componentDidMount() {
    const { t, keycloak } = this.props;
    const authenticated = keycloak.initialized && keycloak.authenticated;

    if (authenticated) {
      this.getTicketingSystems();
    }
  }

  componentDidUpdate(prevProps) {
    const { t, keycloak } = this.props;
    const authenticated = keycloak.initialized && keycloak.authenticated;

    const changedAuth = prevProps.keycloak.authenticated !== authenticated;

    if (authenticated && changedAuth) {
      this.getTicketingSystems();
    }
  }

  async deleteTicketingSystem() {
    return await apiTicketingSystemDelete(this.props.serviceUrl, this.state.ticketingSystem.id);
  }

  handleDelete(e) {
    if (window.confirm('Are you sure you want to delete this ticketing system?')) {
      this.deleteTicketingSystem()
        .then(result => {
          this.setState({
            submitMsg: i18n.t('submitMessages.deleted'),
            submitColour: '#24a148',
          });
        })
        .catch(err => {
          this.setState({
            submitMsg: i18n.t('submitMessages.error'),
            submitColour: '#da1e28',
          });
        });
    }
  }

  handleFormSubmit = event => {
    event.preventDefault();
    if (this.state.ticketingSystem === '') {
      this.createTicketingSystem()
        .then(result => {
          this.setState({
            submitMsg: i18n.t('submitMessages.created'),
            submitColour: '#24a148',
          });
        })
        .catch(err => {
          this.setState({
            submitMsg: i18n.t('submitMessages.error'),
            submitColour: '#da1e28',
          });
        });
    } else {
      this.updateTicketingSystem()
        .then(result => {
          this.setState({
            submitMsg: i18n.t('submitMessages.updated'),
            submitColour: '#24a148',
          });
        })
        .catch(err => {
          this.setState({
            submitMsg: i18n.t('submitMessages.error'),
            submitColour: '#da1e28',
          });
        });
    }
  };

  render() {
    const ticketingSystem = ['Jira', 'Other'];
    if (isPortalAdmin()) {
      return (
        <div className="cp-form">
          <p style={{ color: this.state.submitColour }}>{this.state.submitMsg}</p>
          <Form onSubmit={this.handleFormSubmit}>
            <div className="bx--grid">
              <div className="bx--row">
                <div className="bx--col">
                  <Select
                    defaultValue="ticketing-system"
                    name="ticketingSystemType"
                    labelText={i18n.t('adminConfig.integrationTicketingSystem.selectBackendTicketingSystem')}
                    value={this.state.ticketingSystemType}
                    onChange={this.handleChanges}
                  >
                    <SelectItem text={i18n.t('adminConfig.integrationTicketingSystem.select')} value="ticketing-system" />
                    {ticketingSystem.map((ticketingSystem, i) => (
                      <SelectItem key={i} text={ticketingSystem} value={ticketingSystem.toLowerCase()}>
                        {ticketingSystem}
                      </SelectItem>
                    ))}
                  </Select>
                  <TextInput
                    name="serviceAccount"
                    labelText={i18n.t('adminConfig.integrationTicketingSystem.userName')}
                    value={this.state.serviceAccount}
                    onChange={this.handleChanges}
                  />
                  <TextInput
                    name="systemId"
                    labelText={i18n.t('adminConfig.integrationTicketingSystem.projectName')}
                    value={this.state.systemId}
                    onChange={this.handleChanges}
                  />
                </div>
                <div className="bx--col">
                  <TextInput
                    name="url"
                    labelText={i18n.t('adminConfig.integrationTicketingSystem.url')}
                    value={this.state.url}
                    onChange={this.handleChanges}
                  />
                  <TextInput
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
