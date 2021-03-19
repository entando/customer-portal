import React, { Component } from 'react';
import i18n from '../../i18n';
import { Form, TextInput, Select, SelectItem, Button, DatePicker, DatePickerInput } from 'carbon-components-react';
import { apiGetProjectIdNames } from '../../api/projects';
import withKeycloak from '../../auth/withKeycloak';
import { apiProjectSubscriptionPost, apiProjectSubscriptionPut } from '../../api/subscriptions';
import { apiProductVersionsGet } from '../../api/productVersion';

const subscriptionLevel = {
    GOLD: 'Gold',
    PLATINUM: 'Platinum'
}

const status = {
    REQUESTED: 'Requested',
    PENDING: 'Pending',
    ACTIVE: 'Active',
    EXPIRED: 'Expired'
}

class SubscriptionForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customerNo: '',
            customerName: '',
            subscriptionType: '',
            customerEmail: '',
            projectName: '',
            startDate: '',
            subscriptionLevel: '',
            subscriptionLength: '',
            entandoVersion: '',
            contactName: '',
            contactEmail: '',
            contactNo: '',
            invalid: {},
            projects: {},
            productVersions: [],
            selectedProjectId: ''
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    async fetchData() {
        const { t, keycloak } = this.props;

        const authenticated = keycloak.initialized && keycloak.authenticated;
        if (authenticated) {
            const projects = (await apiGetProjectIdNames(this.props.serviceUrl)).data;
            const productVersions = (await apiProductVersionsGet(this.props.serviceUrl)).data;

            this.setState({
                projects,
                productVersions
            });

            console.log('yaa', productVersions);
        }
    }


    handleValidation() {
        let invalid = {};
        let formIsValid = true;

        if (this.state.subscriptionType === '') {
            formIsValid = false;
            invalid['subscriptionType'] = true;
        }

        if (this.state.customerName === '') {
            formIsValid = false;
            invalid['customerName'] = true;
        }

        if (this.state.customerNo === '') {
            formIsValid = false;
            invalid['customerNo'] = true;
        }

        if (typeof this.state.customerEmail !== "undefined") {
            let lastAtPos = this.state.customerEmail.lastIndexOf('@');
            let lastDotPos = this.state.customerEmail.lastIndexOf('.');

            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && this.state.customerEmail.indexOf('@@') == -1 && lastDotPos > 2 && (this.state.customerEmail.length - lastDotPos) > 2)) {
                formIsValid = false;
                invalid['customerEmail'] = true;
            }
        }

        if (this.state.projectName === '') {
            formIsValid = false;
            invalid['projectName'] = true;
        }

        if (this.state.contactName === '') {
            formIsValid = false;
            invalid['contactName'] = true;
        }

        if (typeof this.state.contactEmail !== "undefined") {
            let lastAtPos = this.state.contactEmail.lastIndexOf('@');
            let lastDotPos = this.state.contactEmail.lastIndexOf('.');

            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && this.state.contactEmail.indexOf('@@') == -1 && lastDotPos > 2 && (this.state.contactEmail.length - lastDotPos) > 2)) {
                formIsValid = false;
                invalid['contactEmail'] = true;
            }
        }

        if (typeof this.state.startDate !== "undefined") {
            if (!this.state.startDate.match(/^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/)) {
                formIsValid = false;
                invalid["startDate"] = true;
            }
        }

        this.setState({ invalid: invalid });
        return formIsValid;
    }

    handleChanges = (e) => {
        const input = e.target;
        const name = input.name;
        const value = input.value;
        this.setState({ [name]: value });
        console.log(this.state);
    }

    handleFormSubmit = (event) => {
        event.preventDefault();

        const formIsValid = this.handleValidation();

        if (formIsValid) {
            // placeholder
        }
    };

    newSubscription() {

    }

    renewSubscription() {

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

        const subscriptionList = Object.entries(subscriptionLevel).map(([key, value]) => (
            <SelectItem key={key} text={value} value={key}>{value}</SelectItem>
        ));
        subscriptionList.unshift(<SelectItem key="-1" text={i18n.t('subscriptionForm.chooseLevel')} value="" />)

        const versionList = this.state.productVersions.map(version => (
            <SelectItem key={version.id} text={version.name} value={version.id}>{version.name}</SelectItem>
        ));
        versionList.unshift(<SelectItem key="-1" text={i18n.t('subscriptionForm.chooseVersion')} value="" />)

        return { projectList, subscriptionList, versionList }
    }

    render() {
        const formComponents = this.setupFormComponents()
        const { projectList, subscriptionList, versionList } = formComponents;
        const subscriptionLength = ['1 Year', '2 Years', '3 Years'];
        

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
                                    <Select defaultValue="" name="subscriptionLevel" labelText={i18n.t('subscriptionForm.desiredSubscriptionLevel')} value={this.state.subscriptionLevel} onChange={this.handleChanges}>
                                        {subscriptionList}
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
                                    <Select defaultValue="subscription-length" name="subscriptionLength" labelText={i18n.t('subscriptionForm.desiredSubscriptionLength')} value={this.state.subscriptionLength} onChange={this.handleChanges}>
                                        <SelectItem
                                            text={i18n.t('subscriptionForm.chooseLevel')}
                                            value="subscription-length"
                                        />
                                        {subscriptionLength.map((subscriptionLength, i) => <SelectItem key={i} text={subscriptionLength} value={subscriptionLength.toLowerCase()}>{subscriptionLength}</SelectItem>)}
                                    </Select>
                                </div>
                            </div>
                            <Button kind="primary" tabIndex={0} type="submit" > {i18n.t('buttons.submit')}  </Button>
                        </div>
                    </Form>
                </div>
            </div>
        );
    }
}

export default withKeycloak(SubscriptionForm);