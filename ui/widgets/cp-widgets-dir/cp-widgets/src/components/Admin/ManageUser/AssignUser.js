import React, { Component } from 'react';
import { Form, TextInput, Select, SelectItem, Button } from 'carbon-components-react';
import { apiUsersGet } from '../../../api/portalusers';
import { apiAddUserToProject, apiProjectsGet } from '../../../api/projects';
import withKeycloak from '../../../auth/withKeycloak';

class AssignUser extends Component {
    
    formSubmittable;

    constructor(props) {
        super(props);
        this.state = {
            projectName: '',
            assignUser: '',
            selectRole: '',
            users: [],
            projects: []
        }
    }

    componentDidMount() {
        this.fetchData();
    }

    async fetchData() {
        const {t, keycloak } = this.props;

        const authenticated = keycloak.initialized && keycloak.authenticated;
        if (authenticated) {
            const projects = await apiProjectsGet(this.props.serviceUrl);
            const users = await apiUsersGet(this.props.serviceUrl);

            this.setState({
                users,
                projects
            });

            this.formSubmittable = users.length > 0 && projects.length > 0;

            console.log(this.formSubmittable);
        }
    }

    handleChanges = (e) => {
        const input = e.target;
        const name = input.name;
        const value = input.value;
        this.setState({ [name]: value });
    }

    handleFormSubmit = (event) => {
        console.log(this.state.assignUser);
        console.log(this.state.selectRole);
        console.log(this.formSubmittable);
        event.preventDefault();
    };

    render() {
        const assignUser = this.state.users;
        const selectRole = this.props.roles;

        let userList = null;
        if (assignUser !== null && assignUser.length > 0) {
            userList = assignUser.map((assignUser, i) => <SelectItem key={i} text={assignUser} value={assignUser.toLowerCase()}>{assignUser}</SelectItem>);
            userList.unshift(<SelectItem key="5000" text="Assign User"
                value="assign-user" />)
        } else {
            userList = <SelectItem text="There are currently no users in the system"
            value="none" />
        }

        return (
            <div className="">
                <Form onSubmit={this.handleFormSubmit}>
                    <div className="bx--grid">
                        <div className="bx--row">
                            <div className="bx--col">
                                <TextInput name="projectName" labelText="Project Name" value={this.state.projectName} onChange={this.handleChanges} />
                            </div>
                        </div>
                        <div className="bx--row">
                            <div className="bx--col">
                                <Select defaultValue="assign-user" name="assignUser" labelText="Assign User" value={this.state.assignUser} onChange={this.handleChanges}>
                                    {userList}
                                </Select>
                            </div>
                            <div className="bx--col">
                                <Select name="selectRole" labelText="Select Role" value={this.state.selectRole} onChange={this.handleChanges}>
                                    {selectRole.map((selectRole, i) => <SelectItem key={i} text={selectRole.name} value={selectRole.value}>{selectRole.name}</SelectItem>)}
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