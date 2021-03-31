import React, { Component } from 'react';
import i18n from '../../i18n';
import { Form, TextInput, Select, SelectItem, Button, DatePicker, DatePickerInput } from 'carbon-components-react';
import { apiGetProjectIdNames, apiGetMyProjectIdNames } from '../../api/projects';
import withKeycloak from '../../auth/withKeycloak';
import { apiProjectSubscriptionPost, apiRenewSubscription } from '../../api/subscriptions';
import { apiProductVersionsGet } from '../../api/productVersion';
import { hasKeycloakClientRole } from '../../api/helpers';
import { apiAddSubscriptionToProject } from '../../api/projects';

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

const subscriptionTypes = ['New', 'Existing'];

class SubscriptionForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            subscriptionType: '',
            projectId: '',
            startDate: '',
            subscriptionLevel: '',
            subscriptionLength: '',
            entandoVersionId: '',
            invalid: {},
            projects: {},
            productVersions: [],
            selectedProjectId: '',
            submitSuccess: false,
            submitError: false,
            submitColour: 'black'
        };
    }

    componentDidMount() {
        const { t, keycloak } = this.props;

        const authenticated = keycloak.initialized && keycloak.authenticated;
        if (authenticated) {
            if (hasKeycloakClientRole('ROLE_ADMIN') || hasKeycloakClientRole('ROLE_SUPPORT') || hasKeycloakClientRole('ROLE_CUSTOMER') || hasKeycloakClientRole('ROLE_PARTNER')) {
                this.fetchData();
            }
            this.setState({
                loading: false
            })
        }
    }

    componentDidUpdate(prevProps) {
        const { t, keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;

        const changedAuth = prevProps.keycloak.authenticated !== authenticated;

        if (authenticated && changedAuth) {
            if (hasKeycloakClientRole('ROLE_ADMIN') || hasKeycloakClientRole('ROLE_SUPPORT') || hasKeycloakClientRole('ROLE_CUSTOMER') || hasKeycloakClientRole('ROLE_PARTNER')) {
                this.fetchData();
            }
            this.setState({
                loading: false
            })
        }
    }

    async fetchData() {
        var projects = ''
        if (hasKeycloakClientRole('ROLE_ADMIN')) {
            projects = (await apiGetProjectIdNames(this.props.serviceUrl)).data;
        }
        else {
            projects = (await apiGetMyProjectIdNames(this.props.serviceUrl)).data;
        }
        const productVersions = (await apiProductVersionsGet(this.props.serviceUrl)).data;

        this.setState({
            projects,
            productVersions
        });
    }

    isNumeric(str) {
        if (typeof str != "string") 
            return false
        return !isNaN(str) && !isNaN(parseFloat(str))
    }

    handleValidation() {
        let invalid = {};
        let formIsValid = true;

        if (this.state.subscriptionType === '') {
            formIsValid = false;
            invalid['subscriptionType'] = true;
        }

        if (this.state.projectId === '') {
            formIsValid = false;
            invalid['projectId'] = true;
        }

        if (typeof this.state.startDate !== "undefined") {
            if (!this.state.startDate.match(/^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/)) {
                formIsValid = false;
                invalid["startDate"] = true;
            }
        }

        if (this.state.subscriptionLength === '' || !this.isNumeric(this.state.subscriptionLength)) {
            formIsValid = false;
            invalid['subscriptionLength'] = true;
        }

        if (this.state.subscriptionLevel === '') {
            formIsValid = false;
            invalid['level'] = true;
        }

        if (this.state.entandoVersionId === '') {
            formIsValid = false;
            invalid['entandoVersionId'] = true;
        }

        this.setState({ invalid: invalid });
        return formIsValid;
    }

    handleChanges = (e) => {
        const input = e.target;
        const name = input.name;
        const value = input.value;
        this.setState({ [name]: value });
        this.setState({
            submitSuccess: false,
            submitError: false
        });
    }

    handleFormSubmit = (event) => {
        event.preventDefault();
        this.setState({
            submitSuccess: false,
            submitError: false
        });
        const formIsValid = this.handleValidation();

        if (formIsValid) {
            if (this.state.subscriptionType === 'new') {
                this.newSubscription().then(res => {
                    apiAddSubscriptionToProject(this.props.serviceUrl, this.state.projectId, res.data.id)
                    this.setState({
                        submitSuccess: true,
                        submitError: false,
                        submitColour: '#24a148'
                    });
                }).catch(err => {
                    this.setState({
                        submitSuccess: false,
                        submitError: true,
                        submitColour: '#da1e28'
                    });
                });
            } else if (this.state.subscriptionType === 'existing') {
                this.renewSubscription().then(res => {
                    apiAddSubscriptionToProject(this.props.serviceUrl, this.state.projectId, res.data.id)
                    this.setState({
                        submitSuccess: true,
                        submitError: false,
                        submitColour: '#24a148'
                    });
                }).catch(err => {
                    this.setState({
                        submitSuccess: false,
                        submitError: true,
                        submitColour: '#da1e28'
                    });
                });
            }
        }
    };

    async newSubscription() {
        const subscriptionRequest = {
            entandoVersionId: this.state.entandoVersionId,
            projectId: this.state.projectId,
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
        const subscriptionRequest = {
            entandoVersionId: this.state.entandoVersionId,
            projectId: this.state.projectId,
            projectSubscription: {
                startDate: new Date(this.state.startDate),
                lengthInMonths: this.state.subscriptionLength,
                level: this.state.subscriptionLevel,
                status: this.subscriptionStatus()
            }
        }

        return await apiRenewSubscription(this.props.serviceUrl, subscriptionRequest);
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
                                id="projectId"
                                name="projectId"
                                labelText={i18n.t('subscriptionForm.projectName')}
                                value={this.state.projectId}
                                onChange={this.handleChanges}
                                invalidText={i18n.t('validation.invalid.required')}
                                invalid={this.state.invalid['projectId']}
                            >
                                {projectList}
                            </Select>
                            <Select
                                id="subscriptionLevel"
                                name="subscriptionLevel"
                                labelText={i18n.t('subscriptionForm.desiredSubscriptionLevel') + " *"}
                                value={this.state.subscriptionLevel} onChange={this.handleChanges}
                                invalidText={i18n.t('validation.invalid.required')}
                                invalid={this.state.invalid['level']}
                            >
                                {subscriptionLevelList}
                            </Select>
                            <Select
                                id="entandoVersionId"
                                name="entandoVersionId"
                                labelText={i18n.t('subscriptionForm.entandoVersion') + " *"}
                                value={this.state.entandoVersionId}
                                onChange={this.handleChanges}
                                invalidText={i18n.t('validation.invalid.required')}
                                invalid={this.state.invalid['entandoVersionId']}
                            >
                                {versionList}
                            </Select>
                        </div>
                        <div className="bx--col">
                            <DatePicker dateFormat="m/d/Y" datePickerType="simple">
                                <DatePickerInput
                                    id="startDate"
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
                            <TextInput
                                id="subscriptionLength"
                                name="subscriptionLength"
                                labelText={i18n.t('subscriptionForm.desiredSubscriptionLength') + " *"}
                                value={this.state.subscriptionLength}
                                onChange={this.handleChanges}
                                invalidText={i18n.t('validation.invalid.number')}
                                invalid={this.state.invalid['subscriptionLength']}
                            />
                        </div>
                    </div>
                </div>
            )
        } else if (this.state.subscriptionType === 'existing') {
            formInputs = (
                <div>
                    <p><strong>{i18n.t('subscriptionForm.renewSubscription')}</strong></p><br />
                    <div className="bx--row">
                        <div className="bx--col">
                            <Select
                                id="projectId"
                                name="projectId"
                                labelText={i18n.t('subscriptionForm.projectName')}
                                value={this.state.projectId}
                                onChange={this.handleChanges}
                                invalidText={i18n.t('validation.invalid.required')}
                                invalid={this.state.invalid['projectId']}
                            >
                                {projectList}
                            </Select>
                            <Select
                                id="subscriptionLevel"
                                name="subscriptionLevel"
                                labelText={i18n.t('subscriptionForm.desiredSubscriptionLevel') + " *"}
                                value={this.state.subscriptionLevel}
                                onChange={this.handleChanges}
                                invalidText={i18n.t('validation.invalid.required')}
                                invalid={this.state.invalid['level']}
                            >
                                {subscriptionLevelList}
                            </Select>
                            <Select
                                id="entandoVersionId"
                                name="entandoVersionId"
                                labelText={i18n.t('subscriptionForm.entandoVersion') + " *"}
                                value={this.state.entandoVersionId}
                                onChange={this.handleChanges}
                                invalidText={i18n.t('validation.invalid.required')}
                                invalid={this.state.invalid['entandoVersionId']}
                            >
                                {versionList}
                            </Select>
                        </div>
                        <div className="bx--col">
                            <DatePicker dateFormat="m/d/Y" datePickerType="simple">
                                <DatePickerInput
                                    id="startDate"
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
                            <TextInput
                                id="subscriptionLength"
                                name="subscriptionLength"
                                labelText={i18n.t('subscriptionForm.desiredSubscriptionLength') + " *"}
                                value={this.state.subscriptionLength}
                                onChange={this.handleChanges}
                                invalidText={i18n.t('validation.invalid.number')}
                                invalid={this.state.invalid['subscriptionLength']}
                            />
                        </div>
                    </div>
                </div>
            )
        }

        return formInputs;
    }

    successErrorMessage() {
        const isAdmin = hasKeycloakClientRole('ROLE_ADMIN');
        const { subscriptionType, submitSuccess, submitError } = this.state;

        if (subscriptionType === 'new') {
            if (submitSuccess) {
                return isAdmin ? this.createFormMessage('adminSubmitNewSuccess') : this.createFormMessage('customerSubmitSuccess');
            } else if (submitError) {
                return this.createFormMessage('newSubError');
            }
        } else {
            if (submitSuccess) {
                return isAdmin ? this.createFormMessage('adminRenewNewSuccess') : this.createFormMessage('customerSubmitSuccess');
            } else if (submitError) {
                return this.createFormMessage('renewSubError');
            }
        }
    }

    createFormMessage(subMessageKey) {
        return <p style={{color: this.state.submitColour}}>{i18n.t(`subscriptionForm.${subMessageKey}`)}</p>
    }

    render() {
        if (!this.state.loading) {
            if (hasKeycloakClientRole('ROLE_ADMIN') || hasKeycloakClientRole('ROLE_SUPPORT') || hasKeycloakClientRole('ROLE_CUSTOMER') || hasKeycloakClientRole('ROLE_PARTNER')) {
                return (
                    <div>
                        {hasKeycloakClientRole('ROLE_ADMIN') ? 
                            <h3 className="pageTitle">{i18n.t('adminDashboard.adminTitle')}</h3> : 
                        hasKeycloakClientRole('ROLE_SUPPORT') ? 
                            <h3 className="pageTitle">{i18n.t('adminDashboard.supportTitle')}</h3> : 
                        hasKeycloakClientRole('ROLE_CUSTOMER') ? 
                            <h3 className="pageTitle">{i18n.t('adminDashboard.customerTitle')}</h3> : 
                        hasKeycloakClientRole('ROLE_PARTNER') ? 
                            <h3 className="pageTitle">{i18n.t('adminDashboard.partnerTitle')}</h3> : 
                        null}
                        <div className="form-container">
                            {this.successErrorMessage()}
                            <Form onSubmit={this.handleFormSubmit}>
                                <div className="form-desc">
                                    <h4>{i18n.t('subscriptionForm.formTitle')}</h4>
                                </div>
                                <div className="bx--grid">
                                    <div className="bx--row">
                                        <div className="bx--col">
                                            <Select id="subscriptionType" name="subscriptionType" labelText={i18n.t('subscriptionForm.subscriptionType')} required value={this.state.subscriptionType} onChange={this.handleChanges}>
                                                <SelectItem
                                                    text={i18n.t('subscriptionForm.selectType')}
                                                    value=""
                                                />
                                                {subscriptionTypes.map((subscriptionType, i) => <SelectItem key={i} text={subscriptionType} required value={subscriptionType.toLowerCase()}>{subscriptionType}</SelectItem>)}
                                            </Select>
                                        </div>
                                    </div>
                                    {this.renderForm()}
                                    {this.state.subscriptionType ? <Button kind="primary" tabIndex={0} type="submit" > {i18n.t('buttons.submit')}</Button> : ''}
                                </div>
                            </Form>
                        </div>
                    </div>
                );
            }
            else {
                return(<p>Unauthorized</p>)
            }
        }
        else {
            return(null)
        }
    }
}

export default withKeycloak(SubscriptionForm);