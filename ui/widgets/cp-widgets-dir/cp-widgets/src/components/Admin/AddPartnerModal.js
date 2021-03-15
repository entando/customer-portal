import React, { Component } from 'react';
import i18n from '../../i18n';
import { ModalWrapper, Form, TextInput, Select, SelectItem, TextArea } from 'carbon-components-react';
import withKeycloak from '../../auth/withKeycloak';
import { apiPartnerPost } from '../../api/partners';
import { apiProjectPost, apiProjectsGet, apiAddPartnerToProject } from '../../api/projects';

class AddPartnerModal extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            projectList: {},
            projectId: '',
            name: '',
            partnerNumber: '',
            notes:'',
            invalid: {}
        };
    }

    componentDidUpdate(prevProps) {
        const { keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;
    
        const changedAuth = prevProps.keycloak.authenticated !== authenticated;
    
        if (authenticated && changedAuth) {
          this.getProjects();
        }
    }

    handleValidation() {
        let invalid = {};
        let formIsValid = true;

        //name
        if(this.state.name === ''){
          formIsValid = false;
          invalid["name"] = true;
        }

        //partnerNumber
        if(this.state.partnerNumber === ''){
            formIsValid = false;
            invalid["partnerNumber"] = true;
        }

        this.setState({invalid: invalid});
        return formIsValid;
    }

    handleChanges = e => {
        const input = e.target;
        const name = input.name;
        const value = input.value;
        this.setState({ [name]: value });
        this.handleValidation();
    };

    async getProjects() {
        const { t, keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;
        if (authenticated) {
            const projects = await apiProjectsGet(this.props.serviceUrl);
            this.setState({projectList: projects})
        }
    }

    async partnerPost(partner) {
        const { t, keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;
        if (authenticated) {
            const result = await apiPartnerPost(this.props.serviceUrl, partner);
            await apiAddPartnerToProject(this.props.serviceUrl, this.state.projectId, result.data.id)
        }
    }

    handleFormSubmit = (e) => {
        const formIsValid = this.handleValidation();

        if (formIsValid) {
            const partner = {
                name: this.state.name,
                partnerNumber: this.state.partnerNumber,
                notes: this.state.notes
            }
            this.partnerPost(partner);
            window.location.reload(false);
        }
    };

    componentDidMount() {
        this.getProjects();
    }

    render() {
        return (
            <ModalWrapper
                buttonTriggerText={i18n.t('buttons.addPartner')}
                modalHeading={i18n.t('adminDashboard.addPartner.title')}
                buttonTriggerClassName="add-partner bx--btn bx--btn--tertiary"
                className="modal-form modal-form-partner"
                handleSubmit={this.handleFormSubmit}
            >
                <div className="form-container">
                    <p> {i18n.t('adminDashboard.addPartner.desc')}</p>
                    <Form onSubmit={this.handleFormSubmit}>
                        <Select defaultValue="project-list" name="projectId" labelText={i18n.t('adminDashboard.addPartner.projectList')} value={this.state.projectId} onChange={this.handleChanges}>
                            <SelectItem
                                text={i18n.t('adminDashboard.addPartner.selectProject')}
                                value="project-list"
                            />
                            {Object.keys(this.state.projectList).length !== 0 ? this.state.projectList.data.map((projectList, i) => <SelectItem key={i} text={projectList.name} value={projectList.id}>{projectList.name}</SelectItem>) : null}
                        </Select>

                        <TextInput 
                            name="name" 
                            labelText={i18n.t('adminDashboard.addPartner.partnerName')} 
                            value={this.state.name} 
                            onChange={this.handleChanges}  
                            invalidText="This field is required" 
                            invalid={this.state.invalid["name"]} 
                        />
                        <TextInput 
                            name="partnerNumber" 
                            labelText={i18n.t('adminDashboard.addPartner.partnerNumber')} 
                            value={this.state.partnerNumber} 
                            onChange={this.handleChanges}
                            invalidText="This field is required" 
                            invalid={this.state.invalid["partnerNumber"]} 
                        />
                        <TextArea 
                            name="notes" 
                            labelText={i18n.t('adminDashboard.addPartner.notes')} 
                            value={this.state.notes} 
                            onChange={this.handleChanges} 
                        />
                        {/*<button disabled={!this.isValid()} type="submit">Submit</button>*/}
                    </Form>
                </div> 
            </ModalWrapper>
        )
    }
}


export default withKeycloak(AddPartnerModal)