import React, { Component } from 'react';
import i18n from '../../../i18n';
import { Form, TextInput, Select, SelectItem, Button} from 'carbon-components-react';
import { apiTicketingSystemPost } from '../../../api/ticketingsystem';
import { hasKeycloakClientRole } from '../../../api/helpers';

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
        if (hasKeycloakClientRole('ROLE_ADMIN')) {
            return (
                <div className="cp-form">
                    <Form onSubmit={this.handleFormSubmit}>
                        <div className="bx--grid">
                            <div className="bx--row">
                                <div className="bx--col">
                                    <Select defaultValue="ticketing-system" name="ticketingSystem" labelText={i18n.t('adminConfig.integrationTicketingSystem.selectBackendTicketingSystem')} value={this.state.ticketingSystem} onChange={this.handleChanges}>
                                        <SelectItem
                                            text={i18n.t('adminConfig.integrationTicketingSystem.select')}
                                            value="ticketing-system"
                                        />
                                        {ticketingSystem.map((ticketingSystem, i) => <SelectItem key={i} text={ticketingSystem} value={ticketingSystem.toLowerCase()}>{ticketingSystem}</SelectItem>)}
                                    </Select>
                                    <TextInput name="userName" labelText={i18n.t('adminConfig.integrationTicketingSystem.userName')} value={this.state.userName} onChange={this.handleChanges}/>
                                    <TextInput name="projectName" labelText={i18n.t('adminConfig.integrationTicketingSystem.projectName')} value={this.state.projectName} onChange={this.handleChanges}/>
                                </div>
                                <div className="bx--col">
                                    <TextInput name="url" labelText={i18n.t('adminConfig.integrationTicketingSystem.url')} value={this.state.url} onChange={this.handleChanges}/>
                                    <TextInput name="password" type="password" labelText={i18n.t('adminConfig.integrationTicketingSystem.password')} value={this.state.password} onChange={this.handleChanges}/>
                                </div>
                            </div>
                            <Button kind="primary" tabIndex={0} type="submit"> {i18n.t('buttons.submit')}  </Button>
                        </div>
                    </Form>
                </div>
            );
        }
        else {
            return(<p>You are not authorized to view this</p>)
        }
    }
}
 
export default TicketingSystem;