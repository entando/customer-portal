import React, {Component} from 'react';
import { Form, TextInput, Select, SelectItem, Button, TextArea } from 'carbon-components-react';
import withKeycloak from '../../auth/withKeycloak';
import { apiProjectsGet } from '../../api/projects';

class OpenTicket extends Component {
    constructor() {
        super();
        this.state = {
            projectId: '',
            projects: {},
            ticketData: {
                type: '',
                description: '',
                priority: '',
                status: 'To Do',
                createDate: '',
                updateDate: ''
            }
        };
    }

    handleChanges = (e) => {
        const input = e.target;
        const name = input.name;
        const value = input.value;
        this.setState({ [name]: value });
    }

    handleFormSubmit = (event) => {
        console.log(this.state.ticketNo)
        event.preventDefault();
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
            name: 'ticketDescription',
        }

        return (
            <div className="form-container">
                <Form onSubmit={this.handleFormSubmit}>
                    <div className="form-desc">
                        <h4>Open Service Ticket</h4>
                        <p>Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. </p>
                    </div>

                    <div className="bx--grid">
                        <div className="bx--row">
                            <div className="bx--col">
                                <Select defaultValue="ticketing-system" name="ticketingSystem" labelText="Select Backend Ticketing System" value={this.state.projects} onChange={this.handleChanges}>
                                    <SelectItem
                                        text="Select"
                                        value="ticketing-system"
                                    />
                                    {Object.keys(this.state.projects).length !== 0 ? this.state.projects.data.map((project, i) => {
                                    return (
                                        <SelectItem key={i} text={project.name} value={project.id}>{project.name}</SelectItem>
                                    )}) : null}
                                </Select>
                                <TextInput name="projectName" labelText="Project Id" value={this.state.projectId} onChange={this.handleChanges}/>
                                <TextInput name="ticketNo" labelText="Type" value={this.state.type} onChange={this.handleChanges}/>
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
        );
    }
}

export default withKeycloak(OpenTicket);