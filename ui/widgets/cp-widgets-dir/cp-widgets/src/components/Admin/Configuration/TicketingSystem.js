import React, { Component } from 'react';
import { Form, TextInput, Select, SelectItem, Button} from 'carbon-components-react';
import { apiTicketingSystemPost } from '../../../api/ticketingsystem';

class TicketingSystem extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            ticketingSystem:'',
            url: '',
            userName: '',
            password: '',
            projectName: ''
        }
    }
    
    handleChanges = (e) => {
        const input = e.target;
        const name = input.name;
        const value = input.value;
        this.setState({ [name]: value });
    }

    async createTicketingSystem() {
        const ticketingSystem = {
            url: this.state.url,
            serviceAccount: this.state.userName,
            serviceAccountSecret: this.state.password,
            systemId: this.state.projectName
        }
        await apiTicketingSystemPost(this.props.serviceUrl, ticketingSystem);
    }

    handleFormSubmit = (event) => {
        event.preventDefault();
        this.createTicketingSystem();
        this.setState({
            ticketingSystem:'',
            url: '',
            userName: '',
            password: '',
            projectName: ''
        })
    };

    render() { 
        const ticketingSystem = ['Jira', 'Other'];
        return (
            <div className="cp-form">
                <Form onSubmit={this.handleFormSubmit}>
                    <div className="bx--grid">
                        <div className="bx--row">
                            <div className="bx--col">
                                <Select required defaultValue="ticketing-system" name="ticketingSystem" labelText="Select Backend Ticketing System *" value={this.state.ticketingSystem} onChange={this.handleChanges}>
                                    <SelectItem
                                        text="Select"
                                        value="ticketing-system"
                                    />
                                    {ticketingSystem.map((ticketingSystem, i) => <SelectItem key={i} text={ticketingSystem} value={ticketingSystem.toLowerCase()}>{ticketingSystem}</SelectItem>)}
                                </Select>
                                <TextInput required name="userName" labelText="User Name *" value={this.state.userName} onChange={this.handleChanges}/>
                                <TextInput required name="projectName" labelText="Project Name *" value={this.state.projectName} onChange={this.handleChanges}/>
                            </div>
                            <div className="bx--col">
                                <TextInput required name="url" labelText="URL *" value={this.state.url} onChange={this.handleChanges}/>
                                <TextInput required name="password" type="password" labelText="Password *" value={this.state.password} onChange={this.handleChanges}/>
                            </div>
                        </div>
                        <Button kind="primary" tabIndex={0} type="submit"> Submit  </Button>
                    </div>
                </Form>
            </div>
        );
    }
}
 
export default TicketingSystem;