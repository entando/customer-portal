import React, { Component } from 'react';
import i18n from '../../i18n';
import { Form, TextInput, Select, SelectItem, Button, TextArea } from 'carbon-components-react';
import withKeycloak from '../../auth/withKeycloak';
import { apiProjectsGet, apiAdminProjectsGet, apiMyProjectsGet, apiAddTicketToProject } from '../../api/projects';
import { apiUsersGet } from '../../api/portalusers';
import { apiJiraTicketPost } from '../../api/tickets';
import { apiTicketingSystemsGet } from '../../api/ticketingsystem';
import { hasKeycloakClientRole } from '../../api/helpers';

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
            role: '',
            invalid: {}
        };
        this.types = ["Bug", "Task"];
        this.priorities = ['Lowest', 'Low', 'High', 'Highest'];
    }

    handleValidation() {
        let invalid = {};
        let formIsValid = true;

        if(this.state.systemId === ''){
          formIsValid = false;
          invalid['systemId'] = true;
        }

        if(this.state.type === ''){
            formIsValid = false;
            invalid['type'] = true;
        }

        if(this.state.description === ''){
            formIsValid = false;
            invalid['description'] = true;
        }

        this.setState({invalid: invalid});
        return formIsValid;
    }

    handleChanges = (e) => {
        const input = e.target;
        const name = input.name;
        const value = input.value;
        this.setState({ [name]: value });
    }

    handleFormSubmit = (event) => {
        event.preventDefault();

        const formIsValid = this.handleValidation();

        if (formIsValid) {
            this.createTicket();
            window.location.reload(false);
        }
    };

    async fetchProjects() {
        const { t, keycloak } = this.props;
        var authenticated = keycloak.initialized && keycloak.authenticated;
    
        if (authenticated) {
            if (hasKeycloakClientRole('ROLE_ADMIN') || hasKeycloakClientRole('ROLE_SUPPORT')) {
                var projects = await apiAdminProjectsGet(this.props.serviceUrl)
                this.setState({
                    projects: projects.data
                })
            }
            else if (hasKeycloakClientRole('ROLE_CUSTOMER') || hasKeycloakClientRole('ROLE_PARTNER')) {
                var projects = await apiMyProjectsGet(this.props.serviceUrl)
                this.setState({
                    projects: projects.data
                })
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
                // these dates are just placeholder to validate the POST request (date will be updated in the backend)
                createDate: '2021-02-22T14:14:09-05:00',
                updateDate: '2021-02-22T14:14:09-05:00'
            }
            const result = await apiJiraTicketPost(this.props.serviceUrl, this.state.ticketingSystem.systemId, this.state.systemId, ticket);
            //const addedTicket = await apiAddTicketToProject(this.props.serviceUrl, this.state.project.id, result.data.id);
        }
    }

    async getTicketingSystem() {
        const ticketingSystems = await apiTicketingSystemsGet(this.props.serviceUrl);
        const currentTicketingSystem = ticketingSystems.data[ticketingSystems.data.length-1]
        this.setState({
            ticketingSystem: currentTicketingSystem
        })
    }

    componentDidMount() {
        const { t, keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;

        if (authenticated) {
            this.fetchProjects();
            this.getTicketingSystem();
        }
    }

    componentDidUpdate(prevProps) {
        const { t, keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;
      
        const changedAuth = prevProps.keycloak.authenticated !== authenticated;
      
        if (authenticated && changedAuth) {
            this.fetchProjects();
            this.getTicketingSystem();
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
                                    <Select 
                                        defaultValue="ticketing-system" 
                                        name="systemId" 
                                        labelText={i18n.t('supportTicketForm.selectProject')} 
                                        value={this.state.systemId} 
                                        onChange={this.handleChanges}
                                        invalidText={i18n.t('validation.invalid.required')}
                                        invalid={this.state.invalid['systemId']} 
                                    >
                                        <SelectItem
                                            text={i18n.t('supportTicketForm.select')}
                                            value="ticketing-system"
                                        />
                                        {Object.keys(this.state.projects).length !== 0 ? this.state.projects.map((project, i) => {
                                        return (
                                            <SelectItem key={i} text={project.name} value={project.systemId}>{project.name}</SelectItem>
                                        )}) : null}
                                    </Select>
                                    <Select 
                                        defaultValue="Task" 
                                        name="type" 
                                        labelText={i18n.t('supportTicketForm.type')} 
                                        value={this.state.type} 
                                        onChange={this.handleChanges}
                                        invalidText={i18n.t('validation.invalid.required')}
                                        invalid={this.state.invalid['type']} 
                                    >
                                        <SelectItem
                                            text={i18n.t('supportTicketForm.select')}
                                            value="Task"
                                        />
                                        {this.types.map((type, i) => (
                                            <SelectItem key={i} text={type} value={type}>{type}</SelectItem>
                                        ))}
                                    </Select>
                                    <Select 
                                        defaultValue="Low" 
                                        name="priority" 
                                        labelText={i18n.t('supportTicketForm.priority')} 
                                        value={this.state.priority} 
                                        onChange={this.handleChanges}
                                    >
                                        <SelectItem
                                            text={i18n.t('supportTicketForm.select')}
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
                                    <TextArea 
                                        labelText={i18n.t('supportTicketForm.ticketDescription')} 
                                        placeholder={i18n.t('supportTicketForm.addticketDescription')} 
                                        name="description" 
                                        value={this.state.description} 
                                        onChange={this.handleChanges}  
                                        invalidText={i18n.t('validation.invalid.required')}
                                        invalid={this.state.invalid['description']} 
                                    />
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