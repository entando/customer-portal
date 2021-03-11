import React, {Component} from 'react';
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
            notes:''
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

    handleChanges = e => {
        const input = e.target;
        const name = input.name;
        const value = input.value;
        this.setState({ [name]: value });
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
        //e.preventDefault();
        console.log('Project Id:', this.state.projectId);
        console.log('Partner Name:', this.state.name);
        console.log('Partner Number:', this.state.partnerNumber);
        console.log('Notes:', this.state.notes);
        const partner = {
            name: this.state.name,
            partnerNumber: this.state.partnerNumber,
            notes: this.state.notes
        }
        this.partnerPost(partner);
    };

    componentDidMount() {
        this.getProjects();
    }

    isValid() {
        if (this.state.customerName === '') {
          return false;
        }
        return true;
    }
    
    render() {
        return (
            <ModalWrapper
                buttonTriggerText="Add a partner + "
                modalHeading="Add a partner"
                buttonTriggerClassName="add-partner bx--btn bx--btn--tertiary"
                className="modal-form"
                handleSubmit={this.handleFormSubmit}
            >
                <div className="form-container">
                    <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse cursus fermentum risus, sit amet fringilla nunc pellentesque quis. </p>
                    <Form onSubmit={this.handleFormSubmit}>
                        <Select defaultValue="project-list" name="projectId" labelText="Project List" value={this.state.projectId} onChange={this.handleChanges}>
                            <SelectItem
                                text="Select Project"
                                value="project-list"
                            />
                            {Object.keys(this.state.projectList).length !== 0 ? this.state.projectList.data.map((projectList, i) => <SelectItem key={i} text={projectList.name} value={projectList.id}>{projectList.name}</SelectItem>) : null}
                        </Select>

                        <TextInput name="name" labelText="Partner Name" value={this.state.name} onChange={this.handleChanges}  errorMessage={this.isValid() ? '' : 'This field is required'}/>
                        <TextInput name="partnerNumber" labelText="Partner Number" value='' onChange=''value={this.state.partnerNumber} onChange={this.handleChanges} />
                        <TextArea name="notes" labelText="Notes" value={this.state.notes} onChange={this.handleChanges} />
                        {/*<button disabled={!this.isValid()} type="submit">Submit</button>*/}
                    </Form>
                </div> 
            </ModalWrapper>
        )
    }
}


export default withKeycloak(AddPartnerModal)