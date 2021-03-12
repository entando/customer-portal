import React, { Component } from 'react';
import { Form, TextInput, Select, SelectItem, Button } from 'carbon-components-react';
import { apiUsersGet } from '../../../api/portalusers';
import { apiAddUserToProject, apiGetProjectIdNames } from '../../../api/projects';
import withKeycloak from '../../../auth/withKeycloak';

class AssignUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            projectId: '',
            assignUser: '',
            selectRole: '',
            users: [],
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
            const users = (await apiUsersGet(this.props.serviceUrl)).data;
            const projects = (await apiGetProjectIdNames(this.props.serviceUrl)).data;

            this.setState({
                users,
                projects
            });
        }
    }

    setupFormComponents() {
        const users = this.state.users;
        const roleSelection = this.props.roles;
        const projectIdsNames = this.state.projects;

        let userList = null;
        if (users != null && users.length > 0) {
            userList = users.map((assignUser, i) => <SelectItem key={i} text={assignUser.username} value={assignUser.id}>{assignUser.username}</SelectItem>);
            userList.unshift(<SelectItem key="-1" text="Assign User" value="" />)
        } else {
            userList = <SelectItem text="There are currently no users in the system" value="" />
        }

        let projectList = null;
        if (projectIdsNames != null && Object.keys(projectIdsNames).length > 0) {
            projectList = Object.keys(projectIdsNames).map((projectId, i) => <SelectItem key={i} text={projectIdsNames[projectId]} value={projectId}>test</SelectItem>);
            projectList.unshift(<SelectItem key="-1" text="Project List" value=""/>)
        } else {
            projectList = <SelectItem text="There are currently no projects in the system" value="" />
        }

        return { userList, roleSelection, projectList };
    }

    handleChanges = (e) => {
        const input = e.target;
        const name = input.name;
        const value = input.value;
        this.setState({ [name]: value });
    }

    handleFormSubmit = (event) => {
        event.preventDefault();
        console.log(this.state.assignUser);
        console.log(this.state.selectRole);
        console.log(this.state.projectId);
        if (this.formSubmittable) {
            //await apiAddUserToProject(this.props.serviceUrl, this.state.projectName, this.state.)
        } else {
            // TODO Handle error situation
        }
    };

    render() {
        const { userList, roleSelection, projectList } = this.setupFormComponents();

        return (
            <div className="">
                <Form onSubmit={this.handleFormSubmit}>
                    <div className="bx--grid">
                        <div className="bx--row">
                            <div className="bx--col">
                                <Select name="projectName" labelText="Project Name" value={this.state.projectId} onChange={this.handleChanges}>
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
                            <div className="bx--col">
                                <Select name="selectRole" defaultValue="ROLE_ADMIN" labelText="Select Role" value={this.state.selectRole} onChange={this.handleChanges}>
                                    <SelectItem text="Please select a role" value="">Please select a role</SelectItem>
                                    {roleSelection.map((selectRole, i) => <SelectItem key={i} text={selectRole.name} value={selectRole.value}>{selectRole.name}</SelectItem>)}
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