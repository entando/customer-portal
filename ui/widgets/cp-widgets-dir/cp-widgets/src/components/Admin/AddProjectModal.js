import React, {Component} from 'react';
import { ModalWrapper, Form, TextInput, Select, SelectItem, TextArea } from 'carbon-components-react';
import withKeycloak from '../../auth/withKeycloak';
import { apiCustomersGet, apiAddProjectToCustomer } from '../../api/customers';
import { apiProjectPost } from '../../api/projects';

class AddProjectModal extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            customerList: {},
            customerId: '',
            name: '',
            description: '',
            systemId: '',
            contactName: '',
            contactPhone: '',
            contactEmail:'',
            notes:''
        };
    }

    componentDidUpdate(prevProps) {
        const { keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;
    
        const changedAuth = prevProps.keycloak.authenticated !== authenticated;
    
        if (authenticated && changedAuth) {
          this.getCustomers();
        }
      }

    handleChanges = e => {
        const input = e.target;
        const name = input.name;
        const value = input.value;
        this.setState({ [name]: value });
    };

    async getCustomers() {
        const { t, keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;
        if (authenticated) {
            const customers = await apiCustomersGet(this.props.serviceUrl);
            this.setState({customerList: customers})
        }
    }

    async projectPost(project) {
        const { t, keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;
        if (authenticated) {
            const result = await apiProjectPost(this.props.serviceUrl, project);
            await apiAddProjectToCustomer(this.props.serviceUrl, this.state.customerId, result.data.id)
        }
    }

    handleFormSubmit = (e) => {
        //e.preventDefault();
        console.log('Customer Id:', this.state.customerId);
        console.log('Project Name:', this.state.name);
        console.log('project Description:', this.state.description);
        console.log('SystemId:', this.state.systemId);
        console.log('Contact Name:', this.state.contactName);
        console.log('Contact Phone:', this.state.contactPhone);
        console.log('Contact email:', this.state.contactEmail);
        console.log('Notes:', this.state.notes);
        const project = {
            name: this.state.name,
            description: this.state.description,
            systemId: this.state.systemId,
            contactName: this.state.contactName,
            contactPhone: this.state.contactPhone,
            contactEmail: this.state.contactEmail,
            notes: this.state.notes
        }
        this.projectPost(project);
    };

    componentDidMount() {
        this.getCustomers();
    }

    isValid() {
        if (this.state.customerName === '') {
          return false;
        }
        return true;
    }
    
    render() {
        const customerList = ['Customer1', 'Customer2', 'Customer3'];
        return (
            <ModalWrapper
                buttonTriggerText="Add a project + "
                modalHeading="Add a project"
                buttonTriggerClassName="add-project bx--btn bx--btn--tertiary"
                className="modal-form"
                handleSubmit={this.handleFormSubmit}
            >
                <div className="form-container">
                    <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse cursus fermentum risus, sit amet fringilla nunc pellentesque quis. </p>
                    <Form onSubmit={this.handleFormSubmit}>
                        <Select defaultValue="customer-list" name="customerId" labelText="Customer List" value={this.state.customerId} onChange={this.handleChanges}>
                            <SelectItem
                                text="Select Customer"
                                value="customer-list"
                            />
                            {Object.keys(this.state.customerList).length !== 0 ? this.state.customerList.data.map((customerList, i) => <SelectItem key={i} text={customerList.name} value={customerList.id}>{customerList.name}</SelectItem>) : null}
                        </Select>

                        <TextInput name="name" labelText="Project Name" value={this.state.name} onChange={this.handleChanges}  errorMessage={this.isValid() ? '' : 'This field is required'}/>
                        <TextInput name="description" labelText="Project Description" value={this.state.description} onChange={this.handleChanges} />
                        <TextInput name="systemId" labelText="System Id" value='' onChange=''value={this.state.systemId} onChange={this.handleChanges} />
                        <TextInput name="contactName" labelText="Contact Name" value={this.state.contactName} onChange={this.handleChanges} />
                        <TextInput name="contactPhone" labelText="Contact Phone" value={this.state.contactPhone} onChange={this.handleChanges} />
                        <TextInput name="contactEmail" labelText="Contact Email" value={this.state.contactEmail} onChange={this.handleChanges} />
                        <TextArea name="notes" labelText="Notes" value={this.state.notes} onChange={this.handleChanges} />
                        {/*<button disabled={!this.isValid()} type="submit">Submit</button>*/}
                    </Form>
                </div> 
            </ModalWrapper>
        )
    }
}


export default withKeycloak(AddProjectModal)