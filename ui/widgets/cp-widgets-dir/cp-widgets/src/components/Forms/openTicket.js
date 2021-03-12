import React, { Component } from 'react';
import i18n from '../../i18n';
import { Form, TextInput, Select, SelectItem, Button, TextArea } from 'carbon-components-react';
import withKeycloak from '../../auth/withKeycloak';
import { apiProjectsGet, apiAddTicketToProject } from '../../api/projects';
import { apiJiraTicketPost } from '../../api/tickets';

class OpenTicket extends Component {
    constructor() {
        super();
        this.state = {
            systemId: '',
            projects: {},
            type: '',
            description: '',
            priority: '',
            status: 'To Do',
            createDate: '',
            updateDate: ''
        };
    }

    handleChanges = (e) => {
        const input = e.target;
        const name = input.name;
        const value = input.value;
        this.setState({ [name]: value });
        console.log(this.state)
    }

    handleFormSubmit = (event) => {
        event.preventDefault();
        this.createTicket();
    };

    async fetchProjects() {
        const { t, keycloak } = this.props;
        var authenticated = keycloak.initialized && keycloak.authenticated;
    
        if (authenticated && keycloak.tokenParsed.preferred_username === "admin") {
            
            var projects = await apiProjectsGet(this.props.serviceUrl)
            this.setState({
                projects: projects
            })
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
        this.fetchProjects();
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
                                        {Object.keys(this.state.projects).length !== 0 ? this.state.projects.data.map((project, i) => {
                                        return (          
                                            <SelectItem key={i} text={project.name} value={project.systemId}>{project.name}</SelectItem>
                                        )}) : null}
                                    </Select>
                                    <TextInput name="type" labelText={i18n.t('supportTicketForm.type')} value={this.state.type} onChange={this.handleChanges}/>
                                    <TextInput name="priority" labelText={i18n.t('supportTicketForm.priority')} value={this.state.priority} onChange={this.handleChanges}/>
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