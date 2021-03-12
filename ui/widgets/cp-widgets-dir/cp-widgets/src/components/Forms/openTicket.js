import React, { Component } from 'react';
import i18n from '../../i18n';
import { Form, TextInput, Select, SelectItem, Button, TextArea } from 'carbon-components-react';
import withKeycloak from '../../auth/withKeycloak';
import { apiProjectsGet, apiAddTicketToProject } from '../../api/projects';
import { apiUsersGet } from '../../api/portalusers';
import { apiJiraTicketPost } from '../../api/tickets';

class OpenTicket extends Component {
    constructor() {
        super();
        this.state = {
            projects: [],
            systemId: '',
            type: '',
            description: '',
            priority: '',
            status: 'To Do',
            createDate: '',
            updateDate: '',
            role: ''
        };
        this.types = ["Bug", "Task"];
        this.priorities = ['Lowest', 'Low', 'High', 'Highest'];
    }

    async checkRole() {
        const { t, keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;

        var role = ''
        if (keycloak.realmAccess) {
            for (var i = 0; i < keycloak.tokenParsed.roles.length; i++) {
              if (keycloak.tokenParsed.roles[i] == "ROLE_ADMIN") {
                role = 'Admin'
                break;
              }
              else if (keycloak.tokenParsed.roles[i] == "ROLE_SUPPORT") {
                role = 'Support'
              }
              else if (keycloak.tokenParsed.roles[i] == "ROLE_PARTNER") {
                role = 'Partner'
              }
              else if (keycloak.tokenParsed.roles[i] == "ROLE_CUSTOMER") {
                role = 'Customer'
              }
            }
            this.setState({
                role: role
            })
        }
    }

    handleChanges = (e) => {
        const input = e.target;
        const name = input.name;
        const value = input.value;
        this.setState({ [name]: value });
    }

    handleFormSubmit = (event) => {
        event.preventDefault();
        this.createTicket();
        window.location.reload(false);
    };

    async fetchProjects() {
        const { t, keycloak } = this.props;
        var authenticated = keycloak.initialized && keycloak.authenticated;
    
        if (authenticated) {
            await this.checkRole();
            if (this.state.role === 'Admin' || this.state.role === 'Support') {
                var projects = await apiProjectsGet(this.props.serviceUrl)
                this.setState({
                    projects: projects.data
                })
            }
            else if (this.state.role === 'Customer' || this.state.role === 'Partner') {
                const users = await apiUsersGet(this.props.serviceUrl);
                for (var i = 0; i < users.data.length; i++) {
                    if (keycloak.tokenParsed.preferred_username === users.data[i].username) {
                        if (users.data[i].project) {
                            this.setState(prevState => ({
                                projects: [...prevState.projects, users.data[i].project]
                            }))
                        }
                    }
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
                systemId: this.state.systemId,
                type: this.state.type,
                description: this.state.description,
                priority: this.state.priority,
                status: 'To Do',
                createDate: '2021-02-22T14:14:09-05:00',
                updateDate: '2021-02-22T14:14:09-05:00'
            }
            const result = await apiJiraTicketPost(this.props.serviceUrl, this.state.systemId, ticket);
            //const addedTicket = await apiAddTicketToProject(this.props.serviceUrl, this.state.project.id, result.data.id);
        }
    }

    componentDidMount() {
        const { t, keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;

        if (authenticated) {
            this.fetchProjects();
        }
    }

    componentDidUpdate(prevProps) {
        const { t, keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;
      
        const changedAuth = prevProps.keycloak.authenticated !== authenticated;
      
        if (authenticated && changedAuth) {
            this.fetchProjects();
        }
    }
        
    render() {
        return (
            <div>
                <h3 className="pageTitle">{i18n.t('supportTicketForm.title')}</h3>
                <div className="form-container">
                    <Form onSubmit={this.handleFormSubmit}>
                        <div className="form-desc">
                            <h4>{i18n.t('supportTicketForm.formTitle')}</h4>
                            <p>{i18n.t('supportTicketForm.desc')}</p>
                        </div>

                        <div className="bx--grid">
                            <div className="bx--row">
                                <div className="bx--col">
                                    <Select defaultValue="ticketing-system" name="systemId" labelText={i18n.t('supportTicketForm.selectProject')} value={this.state.systemId} onChange={this.handleChanges}>
                                        <SelectItem
                                            text={i18n.t('supportTicketForm.select')}
                                            value="ticketing-system"
                                        />
                                        {Object.keys(this.state.projects).length !== 0 ? this.state.projects.map((project, i) => {
                                        return (
                                            <SelectItem key={i} text={project.name} value={project.systemId}>{project.name}</SelectItem>
                                        )}) : null}
                                    </Select>
                                    <Select defaultValue="Task" name="type" labelText={i18n.t('supportTicketForm.type')} value={this.state.type} onChange={this.handleChanges}>
                                        <SelectItem
                                            text="Select"
                                            value="Task"
                                        />
                                        {this.types.map((type, i) => (
                                            <SelectItem key={i} text={type} value={type}>{type}</SelectItem>
                                        ))}
                                    </Select>
                                    <Select defaultValue="Low" name="priority" labelText={i18n.t('supportTicketForm.priority')} value={this.state.priority} onChange={this.handleChanges}>
                                        <SelectItem
                                            text="Select"
                                            value="Low"
                                        />
                                        {this.priorities.map((priority, i) => (
                                            <SelectItem key={i} text={priority} value={priority}>{priority}</SelectItem>
                                        ))}
                                    </Select>
                                </div>
                            </div>
                            <div className="bx--row">
                                <div className="bx--col">
                                    <TextArea labelText={i18n.t('supportTicketForm.ticketDescription')} placeholder={i18n.t('supportTicketForm.addticketDescription')} name="description" value={this.state.description} onChange={this.handleChanges}  />
                                    <Button kind="primary" tabIndex={0} type="submit" > {i18n.t('buttons.submit')}  </Button>
                                </div>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>    
        );
    }
}

export default withKeycloak(OpenTicket);