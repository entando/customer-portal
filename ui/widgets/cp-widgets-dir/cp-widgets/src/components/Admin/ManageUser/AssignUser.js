import React, { Component } from 'react';
import { Form, Select, SelectItem, Button } from 'carbon-components-react';
import * as portalUserApi from '../../../api/portalusers';
import {apiAddUserToProject, apiProjectGet} from '../../../api/projects';
import withKeycloak from '../../../auth/withKeycloak';
import { apiKeycloakUserGet } from '../../../api/keycloak';
import i18n from '../../../i18n';
class AssignUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      project: null,
      projectId: '',
      assignUser: '',
      users: new Map(),
      invalid: {},
      submitMsg: '',
      submitColour: 'black',
    };
  }

  componentDidMount() {
    const { keycloak } = this.props;

    const authenticated = keycloak.initialized && keycloak.authenticated;
    if (authenticated) {
      this.fetchData(keycloak.authServerUrl);
    }
  }

  componentDidUpdate(prevProps) {
    const { keycloak } = this.props;
    const authenticated = keycloak.initialized && keycloak.authenticated;

    const changedAuth = prevProps.keycloak.authenticated !== authenticated;

    if (authenticated && changedAuth) {
      this.fetchData(keycloak.authServerUrl);
    }
  }

  async fetchData(keycloakUrl) {
    const {keycloak} = this.props;
    const users = this.mapKeycloakUserEmails((await apiKeycloakUserGet(keycloakUrl, keycloak.realm)).data);
    const search = window.location.search;
    const params = new URLSearchParams(search);
    let projectId = params.get('project');
    let project = null;
    if (projectId != null) {
      project = (await apiProjectGet(this.props.serviceUrl, projectId)).data;
    } else {
      projectId = '';
    }

    this.setState({
      projectId: projectId,
      project: project,
      users: users,
    });
  }

  mapKeycloakUserEmails = keycloakUsers => {
    const usernameEmailMap = new Map();
    keycloakUsers.forEach(keycloakUser => usernameEmailMap.set(keycloakUser.username, keycloakUser.email));
    return usernameEmailMap;
  };

  handleChanges = e => {
    const input = e.target;
    const name = input.name;
    const value = input.value;
    this.setState({ [name]: value });
  };

  handleFormSubmit = event => {
    event.preventDefault();
    const { projectId, assignUser } = this.state;
    const formIsValid = this.handleFormValidation();

    if (formIsValid) {
      this.assignUserToProject(projectId, assignUser).then(res => {
        if (res.status === 201) {
          this.setState({
            submitMsg: i18n.t('submitMessages.updated'),
            submitColour: '#24a148',
          });
          window.dispatchEvent(new CustomEvent('cp-user-assigned'));
        } else {
          this.setState({
            submitMsg: i18n.t('submitMessages.error'),
            submitColour: '#da1e28',
          });
        }
      });
    }
  };

  handleFormValidation() {
    let invalid = {};
    let formIsValid = true;
    const { projectId, assignUser } = this.state;

    //name
    if (projectId === '') {
      formIsValid = false;
      invalid['projectId'] = true;
    }

    //customerNumber
    if (assignUser === '') {
      formIsValid = false;
      invalid['assignUser'] = true;
    }

    this.setState({ invalid: invalid });
    return formIsValid;
  }

  assignUserToProject = async (projectId, username) => {
    const portalUserId = await this.getPortalUserId({ username, email: this.state.users.get(username) });
    return await apiAddUserToProject(this.props.serviceUrl, projectId, portalUserId);
  };

  getPortalUserId = async keycloakUser => {
    let portalUserId = null;
    try {
      const portalUser = await portalUserApi.apiUserGetByUsername(this.props.serviceUrl, keycloakUser.username);
      portalUserId = portalUser.data.id;
    } catch (e) {
      if (e.message.toLowerCase().includes('not found')) {
        const portalUser = await this.createPortalUser(keycloakUser);
        portalUserId = portalUser.data.id;
      }
    }

    return portalUserId;
  };

  createPortalUser = async keycloakUser => {
    return await portalUserApi.apiUserPost(this.props.serviceUrl, { username: keycloakUser.username, email: keycloakUser.email });
  };

  setupFormComponents() {
    const users = this.state.users;
    const project = this.state.project;
    let userList = null;
    let projectList = null;

    if (users.size > 0) {
      userList = [...users.keys()].map((assignUser, i) => (
        <SelectItem key={i} text={assignUser} value={assignUser}>
          {assignUser}
        </SelectItem>
      ));
      userList.unshift(<SelectItem key="-1" text={i18n.t('manageUsers.assign.userList')} value=""/>);
    } else {
      userList = <SelectItem text={i18n.t('manageUsers.assign.noUsers')} value=""/>;
    }

    if (project != null) {
      projectList = <SelectItem key={project.id} text={project.name} value={project.id}/>;
    } else {
      projectList = <SelectItem text={i18n.t('manageUsers.assign.noProjects')} value=""/>;
    }

    return {userList, projectList};
  }

  render() {
    const { userList, projectList } = this.setupFormComponents();

    return (
      <div>
        <p style={{ color: this.state.submitColour }}>{this.state.submitMsg}</p>
        <Form onSubmit={this.handleFormSubmit}>
          <div className="bx--grid">
            <div className="bx--row">
              <div className="bx--col">
                <Select
                  id="projectId"
                  name="projectId"
                  labelText={i18n.t('manageUsers.assign.projectName')}
                  value={this.state.projectId}
                  onChange={this.handleChanges}
                  invalidText={i18n.t('validation.invalid.required')}
                  invalid={this.state.invalid['projectId']}
                >
                  {projectList}
                </Select>
              </div>
            </div>
            <div className="bx--row">
              <div className="bx--col">
                <Select
                  id="assignUser"
                  name="assignUser"
                  labelText={i18n.t('manageUsers.assign.assignUser')}
                  value={this.state.assignUser}
                  onChange={this.handleChanges}
                  invalidText={i18n.t('validation.invalid.required')}
                  invalid={this.state.invalid['assignUser']}
                >
                  {userList}
                </Select>
              </div>
            </div>
            <Button kind="primary" tabIndex={0} type="submit">
              {' '}
              {i18n.t('buttons.submit')}{' '}
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}

export default withKeycloak(AssignUser);
