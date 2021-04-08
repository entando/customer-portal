import React, { Component } from 'react';
import i18n from '../../i18n';
import { ModalWrapper, Form, TextInput, Select, SelectItem, TextArea } from 'carbon-components-react';
import withKeycloak from '../../auth/withKeycloak';
import { apiCustomersGet, apiAddProjectToCustomer } from '../../api/customers';
import { apiProjectGet, apiProjectPut, apiProjectsGet } from '../../api/projects';

class EditProjectModal extends Component {
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
            notes:'',
            invalid: {},
            modalId: '',
            buttonId: '',
            submitMsg: '',
            submitColour: 'black'
        };
    }

    handleValidation() {
        let invalid = {};
        let formIsValid = true;

        //name
        if(this.state.name === ''){
          formIsValid = false;
          invalid["name"] = true;
        }

        //description
        if(this.state.description === ''){
            formIsValid = false;
            invalid["description"] = true;
        }

        //contactEmail
        if(typeof this.state.contactEmail !== "undefined"){
          let lastAtPos = this.state.contactEmail.lastIndexOf('@');
          let lastDotPos = this.state.contactEmail.lastIndexOf('.');
    
          if (!(lastAtPos < lastDotPos && lastAtPos > 0 && this.state.contactEmail.indexOf('@@') == -1 && lastDotPos > 2 && (this.state.contactEmail.length - lastDotPos) > 2)) {
            formIsValid = false;
            invalid["contactEmail"] = true;
          }
        }
    
        this.setState({invalid: invalid});
        return formIsValid;
    }

    componentDidUpdate(prevProps) {
        const { keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;
    
        const changedAuth = prevProps.keycloak.authenticated !== authenticated;
    
        if (authenticated && changedAuth) {
          this.getCustomers();
          this.getAllProjects();
          this.getProjectDetails();
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

    async getProjectDetails() {
        const { t, keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;
        if (authenticated) {
            const project = await apiProjectGet(this.props.serviceUrl, this.props.project.id);
            this.setState({
                name: project.data.name,
                description: project.data.description,
                systemId: project.data.systemId,
                contactName: project.data.contactName,
                contactPhone: project.data.contactPhone,
                contactEmail:project.data.contactEmail,
                notes:project.data.notes,
                modalId: "modal-form-project-edit-" + project.data.id,
                buttonId: "edit-project-button-" + project.data.id
            })
        }
    }

    async getAllProjects() {
        const projects = await apiProjectsGet(this.props.serviceUrl);
        this.setState({
          projects: projects.data
        });
      }

    async projectPut(project) {
        const { t, keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;
        if (authenticated) {
            return await apiProjectPut(this.props.serviceUrl, project);
        }
    }

    handleFormSubmit = (e) => {
        const formIsValid = this.handleValidation();

        if (formIsValid) {
            const project = {
                id: this.props.project.id,
                customer: this.props.project.customer,
                name: this.state.name,
                description: this.state.description,
                systemId: this.state.systemId,
                contactName: this.state.contactName,
                contactPhone: this.state.contactPhone,
                contactEmail: this.state.contactEmail,
                notes: this.state.notes
            }
            for (var i = 0; i < this.props.allProjects.length; i++) {
                if((project.systemId === this.props.allProjects[i].systemId) && (project.id !== this.props.allProjects[i].id) && (project.systemId.trim() !== "")) {
                    window.alert('That system id is already in use in another project');
                    return;
                }
            }
            this.projectPut(project).then(result => {
                this.setState({
                    submitMsg: i18n.t('submitMessages.updated'),
                    submitColour: '#24a148'
                })
                this.props.updateProjectList();
            }).catch(err => {
                this.setState({
                    submitMsg: i18n.t('submitMessages.error'),
                    submitColour: '#da1e28'
                })
            });
        }
    };

    clearValues = () => {
        const { keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;

        const customerModalElement = document.querySelector('#' + this.state.modalId);
        if(!customerModalElement.className.includes("is-visible") && authenticated) {
            this.setState({
                name: this.props.project.name,
                description: this.props.project.description,
                systemId: this.props.project.systemId,
                contactName: this.props.project.contactName,
                contactPhone: this.props.project.contactPhone,
                contactEmail:this.props.project.contactEmail,
                notes:this.props.project.notes,
                invalid: {}
            })
        }
    }

    componentDidMount() {
        const { keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;
    
        if (authenticated) {
            this.getCustomers();
            this.getAllProjects();
            this.getProjectDetails();

            const modalOpenButton = document.querySelector('.edit-project-button-' + this.props.project.id);
            modalOpenButton.addEventListener("click", this.clearValues, false);
        }
    }

    render() {
        const buttonClassName = "dropdown-button-button bx--btn bx--btn--ghost edit-project-button-" + this.props.project.id;
        return (
            <ModalWrapper
                buttonTriggerText={i18n.t('buttons.edit')}
                modalHeading={i18n.t('adminDashboard.addProject.editTitle')}
                buttonTriggerClassName={buttonClassName}
                className="modal-form"
                id={this.state.modalId}
                handleSubmit={this.handleFormSubmit}
                primaryButtonText={i18n.t('modalText.save')}
                secondaryButtonText={i18n.t('modalText.cancel')}
                modalLabel={<p style={{color: this.state.submitColour}}>{this.state.submitMsg}</p>}
            >
                <div className="form-container">
                    {/*<p> {i18n.t('adminDashboard.addProject.desc')} </p>*/}
                    <Form onSubmit={this.handleFormSubmit}>
                        <TextInput 
                            name="name" 
                            labelText={i18n.t('adminDashboard.addProject.projectName') + " *"} 
                            value={this.state.name} 
                            onChange={this.handleChanges} 
                            invalidText={i18n.t('validation.invalid.required')} 
                            invalid={this.state.invalid["name"]} 
                        />
                        <TextInput 
                            name="description" 
                            labelText={i18n.t('adminDashboard.addProject.projectDesc') + " *"} 
                            value={this.state.description} 
                            onChange={this.handleChanges} 
                            invalidText={i18n.t('validation.invalid.required')} 
                            invalid={this.state.invalid["description"]} 
                        />
                        <TextInput 
                            name="systemId" 
                            labelText={i18n.t('adminDashboard.addProject.systemId')} 
                            value={this.state.systemId}
                            onChange={this.handleChanges} 
                        />
                        <TextInput 
                            name="contactName" 
                            labelText={i18n.t('adminDashboard.addProject.contactName')} 
                            value={this.state.contactName} 
                            onChange={this.handleChanges} 
                        />
                        <TextInput 
                            name="contactPhone" 
                            labelText={i18n.t('adminDashboard.addProject.contactPhone')} 
                            value={this.state.contactPhone} 
                            onChange={this.handleChanges} 
                        />
                        <TextInput 
                            name="contactEmail" 
                            labelText={i18n.t('adminDashboard.addProject.contactEmail') + " *"} 
                            value={this.state.contactEmail} 
                            onChange={this.handleChanges} 
                            invalidText={i18n.t('validation.invalid.email')} 
                            invalid={this.state.invalid["contactEmail"]} 
                        />
                        <TextArea 
                            name="notes" 
                            labelText={i18n.t('adminDashboard.addProject.notes')} 
                            value={this.state.notes} 
                            onChange={this.handleChanges} 
                        />
                    </Form>
                </div> 
            </ModalWrapper>
        )
    }
}


export default withKeycloak(EditProjectModal)