import React, {Component} from 'react';
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
        const textareaProps = {
            labelText: 'Ticket Description',
            placeholder: 'Add ticket description',
            name: 'description',
        }

        return (
            <div>
                <h3 className="pageTitle">Welcome to Entando Customer Portal</h3>
                <div className="form-container">
                    <Form onSubmit={this.handleFormSubmit}>
                        <div className="form-desc">
                            <h4>Open Service Ticket</h4>
                            <p>Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. </p>
                        </div>

                        <div className="bx--grid">
                            <div className="bx--row">
                                <div className="bx--col">
                                    <Select defaultValue="ticketing-system" name="systemId" labelText="Select Project" value={this.state.systemId} onChange={this.handleChanges}>
                                        <SelectItem
                                            text="Select"
                                            value="ticketing-system"
                                        />
                                        {Object.keys(this.state.projects).length !== 0 ? this.state.projects.data.map((project, i) => {
                                        return (
                                            <SelectItem key={i} text={project.name} value={project.systemId}>{project.name}</SelectItem>
                                        )}) : null}
                                    </Select>
                                    <TextInput name="type" labelText="Type" value={this.state.type} onChange={this.handleChanges}/>
                                    <TextInput name="priority" labelText="Priority" value={this.state.priority} onChange={this.handleChanges}/>
                                </div>
                            </div>
                            <div className="bx--row">
                                <div className="bx--col">
                                    <TextArea {...textareaProps} value={this.state.description} onChange={this.handleChanges}  />
                                    <Button kind="primary" tabIndex={0} type="submit" > Submit  </Button>
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