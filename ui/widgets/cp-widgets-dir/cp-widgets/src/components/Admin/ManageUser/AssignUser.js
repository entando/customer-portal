import React, { Component } from 'react';
import { Form, TextInput, Select, SelectItem, Button } from 'carbon-components-react';
import * as portalUserApi from '../../../api/portalusers';
import { apiAddUserToProject, apiGetProjectIdNames } from '../../../api/projects';
import withKeycloak from '../../../auth/withKeycloak';
import { apiKeycloakUserGet } from '../../../api/keycloak';

class AssignUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            projectId: '',
            assignUser: '',
            selectRole: '',
            users: new Map(),
            projects: {}
        }
    }

    componentDidMount() {
        this.fetchData();
    }

    async fetchData() {
        const { t, keycloak } = this.props;

        const authenticated = keycloak.initialized && keycloak.authenticated;
        if (authenticated) {
            const users = this.mapKeycloakUserEmails((await apiKeycloakUserGet(this.props.keycloakUrl)).data);
            const projects = (await apiGetProjectIdNames(this.props.serviceUrl)).data;
            this.setState({
                users,
                projects
            });
        }
    }

    mapKeycloakUserEmails = keycloakUsers => {
        const usernameEmailMap = new Map();
        keycloakUsers.forEach(keycloakUser => usernameEmailMap.set(keycloakUser.username, keycloakUser.email));
        return usernameEmailMap;
    }


    handleChanges = (e) => {
        const input = e.target;
        const name = input.name;
        const value = input.value;
        this.setState({ [name]: value });
    }

    handleFormSubmit = (event) => {
        event.preventDefault();
        const { projectId, assignUser } = this.state;

        if (projectId.length !== 0 && assignUser.length !== 0) {
            this.assignUserToProject(projectId, assignUser)
        }

        // TODO: improved validation and rejection
    };

    assignUserToProject = async (projectId, username) => {
        const portalUserId = await this.getPortalUserId({ username, email: this.state.users.get(username) });
        const result = await apiAddUserToProject(this.props.serviceUrl, projectId, portalUserId);
        // TODO: Feedback if succeeded or failed.
        this.render();
    }

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
    }

    createPortalUser = async keycloakUser => {
        return await portalUserApi.apiUserPost(this.props.serviceUrl, { username: keycloakUser.username, email: keycloakUser.email });
    }

    setupFormComponents() {
        const users = this.state.users;
        const projectIdsNames = this.state.projects;
        let userList, projectList = userList = null;

        if (users.size > 0) {
            userList = [...users.keys()].map((assignUser, i) => <SelectItem key={i} text={assignUser} value={assignUser}>{assignUser}</SelectItem>);
            userList.unshift(<SelectItem key="-1" text="Assign User" value="" />)
        } else {
            userList = <SelectItem text="There are currently no users in the system" value="" />
        }

        if (projectIdsNames != null && Object.keys(projectIdsNames).length > 0) {
            projectList = Object.keys(projectIdsNames).map((projectId, i) => <SelectItem key={i} text={projectIdsNames[projectId]} value={projectId}>test</SelectItem>);
            projectList.unshift(<SelectItem key="-1" text="Project List" value="" />)
        } else {
            projectList = <SelectItem text="There are currently no projects in the system" value="" />
        }

        return { userList, projectList };
    }

    render() {
        const { userList, projectList } = this.setupFormComponents();

        return (
            <div className="">
                <Form onSubmit={this.handleFormSubmit}>
                    <div className="bx--grid">
                        <div className="bx--row">
                            <div className="bx--col">
                                <Select name="projectId" labelText="Project Name" value={this.state.projectId} onChange={this.handleChanges}>
                                    {projectList}
                                </Select>
                            </div>
                        </div>
                        <div className="bx--row">
                            <div className="bx--col">
                                <Select name="assignUser" labelText="Assign User" value={this.state.assignUser} onChange={this.handleChanges}>
                                    {userList}
                                </Select>
                            </div>
                        </div>
                        <Button kind="primary" tabIndex={0} type="submit">Submit</Button>
                    </div>
                </Form>
            </div>
        );
    }
}

export default withKeycloak(AssignUser);