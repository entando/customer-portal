import React, { Component } from 'react';
import i18n from '../../i18n';
import { Form, TextInput, Select, SelectItem, Button, DatePicker, DatePickerInput } from 'carbon-components-react';
import { apiGetProjectIdNames } from '../../api/projects';
import withKeycloak from '../../auth/withKeycloak';
import { apiProjectSubscriptionPost, apiProjectSubscriptionPut } from '../../api/subscriptions';
import { apiProductVersionsGet } from '../../api/productVersion';
import { hasKeycloakClientRole } from '../../api/helpers';

const subscriptionLevel = {
    GOLD: 'Gold',
    PLATINUM: 'Platinum'
}

const subscriptionStatus = {
    requested: 'REQUESTED',
    pending: 'PENDING',
    active: 'ACTIVE',
    expired: 'EXPIRED'
}

class SubscriptionForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subscriptionType: '',
            projectName: '',
            startDate: '',
            subscriptionLevel: '',
            subscriptionLength: '',
            entandoVersion: '',
            invalid: {},
            projects: {},
            productVersions: [],
            selectedProjectId: ''
        };
    }

    componentDidMount() {
        const { t, keycloak } = this.props;

        const authenticated = keycloak.initialized && keycloak.authenticated;
        if (authenticated) {
            this.fetchData();
        }
    }

    componentDidUpdate(prevProps) {
        const { t, keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;
      
        const changedAuth = prevProps.keycloak.authenticated !== authenticated;
      
        if (authenticated && changedAuth) {
            this.fetchData();
        }
    }

    async fetchData() {
        const projects = (await apiGetProjectIdNames(this.props.serviceUrl)).data;
        const productVersions = (await apiProductVersionsGet(this.props.serviceUrl)).data;

        this.setState({
            projects,
            productVersions
        });
    }

    handleValidation() {
        let invalid = {};
        let formIsValid = true;

        if (this.state.subscriptionType === '') {
            formIsValid = false;
            invalid['subscriptionType'] = true;
        }

        if (this.state.projectName === '') {
            formIsValid = false;
            invalid['projectName'] = true;
        }

        if (typeof this.state.startDate !== "undefined") {
            if (!this.state.startDate.match(/^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/)) {
                formIsValid = false;
                invalid["startDate"] = true;
            }
        }

        if (this.state.subscriptionLength === '' || !Number.isInteger(Number.parseInt(this.state.subscriptionLength))) {
            formIsValid = false;
            invalid['subscriptionLength'] = true;
        }

        if (this.state.subscriptionLevel === '') {
            formIsValid = false;
            invalid['level'] = true;
        }
        
        if (this.state.entandoVersion === '') {
            formIsValid = false;
            invalid['version'] = true;
        }

        this.setState({ invalid: invalid });
        return formIsValid;
    }

    handleChanges = (e) => {
        const input = e.target;
        const name = input.name;
        const value = input.value;
        this.setState({ [name]: value });
    }

    handleFormSubmit = (event) => {
        event.preventDefault();

        const formIsValid = this.handleValidation();

        if (formIsValid) {
           if (this.state.subscriptionType === 'new') {
               this.newSubscription().then(res => {
                   console.log(res);
                   this.render();
               });
           } else {
               this.renewSubscription();
           }
        }
    };

    async newSubscription() {
        const subscriptionRequest = {
            entandoVersionId: this.state.entandoVersion,
            projectId: this.state.projectName,
            projectSubscription: {
                startDate: new Date(this.state.startDate),
                lengthInMonths: this.state.subscriptionLength,
                level: this.state.subscriptionLevel,
                status: this.subscriptionStatus()
            }
        }

        return await apiProjectSubscriptionPost(this.props.serviceUrl, subscriptionRequest);
    }

    async renewSubscription() {

    }

    subscriptionStatus() {
        return hasKeycloakClientRole('ROLE_ADMIN') ? subscriptionStatus.active : subscriptionStatus.requested;
    }
    
    setupFormComponents() {
        const projectIdsNames = this.state.projects;        
        let projectList = null;

        if (projectIdsNames != null && Object.keys(projectIdsNames).length > 0) {
            projectList = Object.keys(projectIdsNames).map((projectId, i) => (
                <SelectItem key={i} text={projectIdsNames[projectId]} value={projectId}>{projectIdsNames[projectId]}</SelectItem>
            ));
            projectList.unshift(<SelectItem key="-1" text={i18n.t('manageUsers.assign.projectList')} value="" />);
        } else {
            projectList = <SelectItem text={i18n.t('manageUsers.assign.noProjects')} value="" />;
        }

        const subscriptionLevelList = Object.entries(subscriptionLevel).map(([key, value]) => (
            <SelectItem key={key} text={value} value={key}>{value}</SelectItem>
        ));
        subscriptionLevelList.unshift(<SelectItem key="-1" text={i18n.t('subscriptionForm.chooseLevel')} value="" />)

        const versionList = this.state.productVersions.map(version => (
            <SelectItem key={version.id} text={version.name} value={version.id}>{version.name}</SelectItem>
        ));
        versionList.unshift(<SelectItem key="-1" text={i18n.t('subscriptionForm.chooseVersion')} value="" />)

        return { projectList, subscriptionLevelList, versionList }
    }

    renderForm() {
        const formComponents = this.setupFormComponents()
        const { projectList, subscriptionLevelList, versionList } = formComponents;
        let formInputs;

        if (this.state.subscriptionType === 'new') {
            formInputs = (
                <div>
                    <p><strong>{i18n.t('subscriptionForm.newSubscription')}</strong></p><br />
                    <div className="bx--row">
                        <div className="bx--col">
                            <Select
                                name="projectName"
                                labelText={i18n.t('subscriptionForm.projectName')}
                                value={this.state.projectName}
                                onChange={this.handleChanges}
                                invalidText={i18n.t('validation.invalid.required')}
                                invalid={this.state.invalid['projectName']}
                            >
                                {projectList}
                            </Select>
                            <Select 
                                defaultValue=""
                                name="subscriptionLevel"
                                labelText={i18n.t('subscriptionForm.desiredSubscriptionLevel')}
                                value={this.state.subscriptionLevel} onChange={this.handleChanges}
                                invalidText={i18n.t('validation.invalid.required')}
                                invalid={this.state.invalid['level']}
                            >
                                {subscriptionLevelList}
                            </Select>
                            <Select
                                defaultValue=""
                                name="entandoVersion"
                                labelText={i18n.t('subscriptionForm.entandoVersion')}
                                value={this.state.entandoVersion}
                                onChange={this.handleChanges}
                                invalidText={i18n.t('validation.invalid.required')}
                                invalid={this.state.invalid['version']}
                            >
                                {versionList}
                            </Select>
                        </div>
                        <div className="bx--col">
                            <DatePicker dateFormat="m/d/Y" datePickerType="simple">
                                <DatePickerInput
                                    name="startDate"
                                    placeholder="mm/dd/yyyy"
                                    labelText={i18n.t('subscriptionForm.desiredSubscriptionStartDate')}
                                    value={this.state.startDate}
                                    onChange={this.handleChanges}
                                    type="text"
                                    invalidText={i18n.t('validation.invalid.date')}
                                    invalid={this.state.invalid['startDate']}
                                />
                            </DatePicker>
                            <TextInput defaultValue="" name="subscriptionLength" labelText={i18n.t('subscriptionForm.desiredSubscriptionLength')} value={this.state.subscriptionLength} onChange={this.handleChanges} invalidText={i18n.t('validation.invalid.number')}
                                invalid={this.state.invalid['subscriptionLength']} />
                        </div>
                    </div>
                </div>
            )
        } else if (this.state.subscriptionType === 'existing'){
            formInputs = (
                <div>
                    <p><strong>{i18n.t('subscriptionForm.renewSubscription')}</strong></p><br />
                    <div className="bx--row">
                        <div className="bx--col">
                            <Select
                                name="projectName"
                                labelText={i18n.t('subscriptionForm.projectName')}
                                value={this.state.projectName}
                                onChange={this.handleChanges}
                                invalidText={i18n.t('validation.invalid.required')}
                                invalid={this.state.invalid['projectName']}
                            >
                                {projectList}
                            </Select>
                            <Select defaultValue="" name="subscriptionLevel" labelText={i18n.t('subscriptionForm.desiredSubscriptionLevel')} value={this.state.subscriptionLevel} onChange={this.handleChanges}>
                                {subscriptionLevelList}
                            </Select>
                            <Select defaultValue="" name="entandoVersion" labelText={i18n.t('subscriptionForm.entandoVersion')} value={this.state.entandoVersion} onChange={this.handleChanges}>
                                {versionList}
                            </Select>
                        </div>
                        <div className="bx--col">
                            <DatePicker dateFormat="m/d/Y" datePickerType="simple">
                                <DatePickerInput
                                    name="startDate"
                                    placeholder="mm/dd/yyyy"
                                    labelText={i18n.t('subscriptionForm.desiredSubscriptionStartDate')}
                                    value={this.state.startDate}
                                    onChange={this.handleChanges}
                                    type="text"
                                    invalidText={i18n.t('validation.invalid.date')}
                                    invalid={this.state.invalid['startDate']}
                                />
                            </DatePicker>
                            <TextInput defaultValue="" name="subscriptionLength" labelText={i18n.t('subscriptionForm.desiredSubscriptionLength')} value={this.state.subscriptionLength} onChange={this.handleChanges} invalidText={i18n.t('validation.invalid.number')}
                                invalid={this.state.invalid['subscriptionLength']} />
                        </div>
                    </div>
                </div>
            )
        }

        return formInputs;
    }

    render() {
        const subscriptionTypes = ['New', 'Existing'];

        return (
            <div>
                <h3 className="pageTitle">{i18n.t('subscriptionForm.title')}</h3>
                <div className="form-container">
                    <Form onSubmit={this.handleFormSubmit}>
                        <div className="form-desc">
                            <h4>{i18n.t('subscriptionForm.formTitle')}</h4>
                            <p>{i18n.t('subscriptionForm.desc')}</p>
                        </div>
                        <div className="bx--grid">
                            <div className="bx--row">
                                <div className="bx--col">
                                    <Select defaultValue="subscription-type" name="subscriptionType" labelText={i18n.t('subscriptionForm.subscriptionType')} required value={this.state.subscriptionType} onChange={this.handleChanges}>
                                        <SelectItem
                                            text={i18n.t('subscriptionForm.selectType')}
                                            value="subscription-type"
                                        />
                                        {subscriptionTypes.map((subscriptionType, i) => <SelectItem key={i} text={subscriptionType} required value={subscriptionType.toLowerCase()}>{subscriptionType}</SelectItem>)}
                                    </Select>
                                </div>
                            </div>
                            {this.renderForm()}
                        </div>
                        <Button kind="primary" tabIndex={0} type="submit" > {i18n.t('buttons.submit')}  </Button>
                    </Form>
                </div>
            </div>
        );
    }
}

export default withKeycloak(SubscriptionForm);