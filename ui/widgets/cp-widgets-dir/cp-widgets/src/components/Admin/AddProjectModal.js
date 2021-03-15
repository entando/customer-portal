import React, { Component } from 'react';
import i18n from '../../i18n';
import { ModalWrapper, Form, TextInput, Select, SelectItem, TextArea } from 'carbon-components-react';
import withKeycloak from '../../auth/withKeycloak';
import { apiCustomersGet, apiAddProjectToCustomer } from '../../api/customers';
import { apiProjectPost, apiProjectsGet } from '../../api/projects';

class AddProjectModal extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            projects: {},
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

    async getAllProjects() {
        const projects = await apiProjectsGet(this.props.serviceUrl);
        this.setState({
            projects: projects.data
        })
    }

    componentDidUpdate(prevProps) {
        const { keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;
    
        const changedAuth = prevProps.keycloak.authenticated !== authenticated;
    
        if (authenticated && changedAuth) {
          this.getCustomers();
          this.getAllProjects();
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
        const project = {
            name: this.state.name,
            description: this.state.description,
            systemId: this.state.systemId,
            contactName: this.state.contactName,
            contactPhone: this.state.contactPhone,
            contactEmail: this.state.contactEmail,
            notes: this.state.notes
        }
        for (var i = 0; i < this.state.projects.length; i++) {
            if(project.systemId === this.state.projects[i].systemId) {
                window.alert('That system id is already in use in another project');
                return;
            }
        }
        this.projectPost(project);
        window.location.reload(false);
    };

    componentDidMount() {
        this.getCustomers();
        this.getAllProjects();
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
                buttonTriggerText={i18n.t('buttons.addProject')}
                modalHeading="Add a project"
                buttonTriggerClassName="add-project bx--btn bx--btn--tertiary"
                className="modal-form"
                handleSubmit={this.handleFormSubmit}
            >
                <div className="form-container">
                    <p> {i18n.t('adminDashboard.addProject.desc')} </p>
                    <Form onSubmit={this.handleFormSubmit}>
                        <Select defaultValue="customer-list" name="customerId" labelText={i18n.t('adminDashboard.addProject.customerList')} value={this.state.customerId} onChange={this.handleChanges}>
                            <SelectItem
                                text={i18n.t('adminDashboard.addProject.selectCustomer')}
                                value="customer-list"
                            />
                            {Object.keys(this.state.customerList).length !== 0 ? this.state.customerList.data.map((customerList, i) => <SelectItem key={i} text={customerList.name} value={customerList.id}>{customerList.name}</SelectItem>) : null}
                        </Select>

                        <TextInput name="name" labelText={i18n.t('adminDashboard.addProject.projectName')} value={this.state.name} onChange={this.handleChanges}  errorMessage={this.isValid() ? '' : 'This field is required'}/>
                        <TextInput name="description" labelText={i18n.t('adminDashboard.addProject.projectDesc')} value={this.state.description} onChange={this.handleChanges} />
                        <TextInput name="systemId" labelText={i18n.t('adminDashboard.addProject.systemId')} value='' onChange=''value={this.state.systemId} onChange={this.handleChanges} />
                        <TextInput name="contactName" labelText={i18n.t('adminDashboard.addProject.contactName')} value={this.state.contactName} onChange={this.handleChanges} />
                        <TextInput name="contactPhone" labelText={i18n.t('adminDashboard.addProject.contactPhone')} value={this.state.contactPhone} onChange={this.handleChanges} />
                        <TextInput name="contactEmail" labelText={i18n.t('adminDashboard.addProject.contactEmail')} value={this.state.contactEmail} onChange={this.handleChanges} />
                        <TextArea name="notes" labelText={i18n.t('adminDashboard.addProject.notes')} value={this.state.notes} onChange={this.handleChanges} />
                        {/*<button disabled={!this.isValid()} type="submit">Submit</button>*/}
                    </Form>
                </div> 
            </ModalWrapper>
        )
    }
}


export default withKeycloak(AddProjectModal)