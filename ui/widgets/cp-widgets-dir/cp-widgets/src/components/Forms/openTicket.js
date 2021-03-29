import React, { Component } from 'react';
import i18n from '../../i18n';
import { Form, Select, SelectItem, Button, TextArea } from 'carbon-components-react';
import withKeycloak from '../../auth/withKeycloak';
import { apiAdminProjectsGet, apiMyProjectsGet, apiGetProjectSubscriptions } from '../../api/projects';
import { apiJiraTicketPost } from '../../api/tickets';
import { apiTicketingSystemsGet } from '../../api/ticketingsystem';
import { hasKeycloakClientRole } from '../../api/helpers';

class OpenTicket extends Component {
    constructor() {
        super();
        this.state = {
            project: {},
            projects: [],
            systemId: '',
            type: '',
            description: '',
            priority: '',
            status: 'To Do',
            createDate: '',
            updateDate: '',
            role: '',
            invalid: {},
            submitMsg: ''
        };
        this.types = ["Bug", "Task"];
        this.priorities = ['Lowest', 'Low', 'High', 'Highest'];
    }

    handleValidation() {
        let invalid = {};
        let formIsValid = true;

        if(this.state.project.systemId === ''){
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

        if (name === "project") {
            this.setState({
                project: JSON.parse(value),
            })
        }
        else {
            this.setState({ [name]: value });
        }
    }

    handleFormSubmit = (event) => {
        event.preventDefault();

        const formIsValid = this.handleValidation();

        if (formIsValid) {
            // check if project has subscription 
            this.fetchProjectSubscription(this.state.project.id).then(result => {
                // if project has subscription, create ticket
                if(result.data.length > 0) {
                    this.createTicket().then(res => {
                        this.setState({
                            submitMsg: i18n.t('submitMessages.created')
                        })
                    }).catch(err => {
                        this.setState({
                            submitMsg: i18n.t('submitMessages.error')
                        })
                    });
                }
                // if no subscriptions, don't create ticket
                else {
                    this.setState({
                        submitMsg: i18n.t('submitMessages.subscriptionRequired')
                    })
                }
            }).catch(error => {
                this.setState({
                    submitMsg: i18n.t('submitMessages.error')
                })
            });
        }
    };

    async fetchProjectSubscription(projectId) {
        return await apiGetProjectSubscriptions(this.props.serviceUrl, projectId);
    }

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
            console.log(this.state.project.systemId)
            const ticket = {
                systemId: this.state.project.systemId,
                type: this.state.type,
                description: this.state.description,
                priority: this.state.priority,
                status: 'To Do',
                // these dates are just placeholder to validate the POST request (date will be updated in the backend)
                createDate: '2021-02-22T14:14:09-05:00',
                updateDate: '2021-02-22T14:14:09-05:00'
            }
            return await apiJiraTicketPost(this.props.serviceUrl, this.state.ticketingSystem.systemId, this.state.project.systemId, ticket);
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
                                        name="project" 
                                        labelText={i18n.t('supportTicketForm.selectProject')} 
                                        value={JSON.stringify(this.state.project)} 
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
                                                    <SelectItem key={i} text={project.name} value={JSON.stringify(project)}>{project.name}</SelectItem>
                                                )
                                        }) : null}
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
                <strong>{this.state.submitMsg}</strong>
            </div>    
        );
    }
}

export default withKeycloak(OpenTicket);