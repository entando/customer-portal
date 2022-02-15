import React, { Component } from "react";
import { isPortalAdminOrSupport } from "../../../api/helpers";
import withKeycloak from "../../../auth/withKeycloak";
import i18n from "../../../i18n";
import { Button, ComposedModal, ModalBody, ModalFooter, ModalHeader, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow, TextInput, } from 'carbon-components-react';
import { TICKETING_SYSTEM_CONFIG_ENUM } from "../../../api/constants";
import { apiTicketingSystemConfigResourcePost } from "../../../api/manageFieldConfigurations";

class JiraConfiguration extends Component {
    constructor() {
        super();
        this.state = {
            open: false,
            validations: {
                versionIdIsValid: true,
                organizationIdIsValid: true,
                subscriptionLevelIdIsValid: true,
                errMsg: ''
            },
            changedProductName: '',
            jiraConfig: [],
            jiraOnChangedValue : this.initializeJiraConfigObj()
        };
        this.timeoutId = null;
    }

    componentDidMount() {
        if (isPortalAdminOrSupport()) {
            this.setState({ changedProductName: this.props.productName, jiraConfig: this.props.jiraCustomField })
            this.getJiraConfig();
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.jiraCustomField.length !== this.props.jiraCustomField.length) {
            this.getJiraConfig();
        }
    }

    getJiraConfig() {
        this.setState({ changedProductName: this.props.productName, jiraConfig: this.props.jiraCustomField });
        let initJira = this.initializeJiraConfigObj();
        this.props.jiraCustomField.forEach((el) => {
            initJira[Object.keys(el)[0]] = el[Object.keys(el)[0]];
        });
        this.setState({ jiraOnChangedValue: initJira });
    }

    initializeJiraConfigObj() {
        return { versionId: 0, organizationId: 0, subscriptionLevelId: 0 };
    }

    onClickJiraConfigEdit = () => {
        this.setState({ validations: { isError: false, errorMsg: "" }, changedProductName: this.props.productName, open: true })
    }

    onClickJiraConfigSave = async () => {
        // validation before submit form
        for (let key in this.state.jiraOnChangedValue) {
            if (!this.state.jiraOnChangedValue[key]) return
        }
        const jiraConfigBuilder = []
        for (let key in this.state.jiraOnChangedValue) {
            jiraConfigBuilder.push({ [key]: this.state.jiraOnChangedValue[key] })
        }
        try {
            await apiTicketingSystemConfigResourcePost(this.props.serviceUrl,
                TICKETING_SYSTEM_CONFIG_ENUM.JIRA_CUSTOM_FIELD, [this.state.jiraOnChangedValue])
                .then(() => {
                    this.props.getTicketAndSubLevel()
                    this.setState({ jiraConfig: jiraConfigBuilder })
                });
        } catch (error) {
            console.error('Error onClickJiraConfigSave: ', error)
        }
        this.setState({ open: false })
    }

    jiraConfigOnChangeHandler = (e) => {
        const getEleId = e.target.id;
        const getEleValue = e.target.value;
        const updateJiraconfig = this.state.jiraOnChangedValue;
        const errorUpdate = this.state.validations;
        if (!getEleValue.length) {
            errorUpdate[`${getEleId}IsValid`] = true
            this.updateStateOfJiraConfig(getEleId, updateJiraconfig, getEleValue);
        } else {
            errorUpdate[`${getEleId}IsValid`] = false
            this.updateStateOfJiraConfig(getEleId, updateJiraconfig, getEleValue);
        }
    }

    onClickCloseModal = () => {
        let initJira = this.initializeJiraConfigObj();
        this.state.jiraConfig.forEach((el) => {
            initJira[Object.keys(el)[0]] = parseInt(el[Object.keys(el)[0]].toString(), 10)
        })
        this.setState({ jiraOnChangedValue: initJira })
    }

    getJiraConfigValues = () => {
        let content = [];
        if (this.state.jiraConfig.length) {
            this.state.jiraConfig.forEach((config, idx) => {
                content.push(<TableCell key={Object.keys(config)[0]}>{config[Object.keys(config)[0]]}</TableCell>)
            })
        }
        return content
    }

    updateStateOfJiraConfig(getEleId, updateJiraconfig, getEleValue) {
        for (let i = 0; i < this.state.jiraConfig.length; i++) {
            if (getEleId === Object.keys(this.state.jiraConfig[i])[0]) {
                updateJiraconfig[`${Object.keys(this.state.jiraConfig[i])}`] = getEleValue;
            }
        }
        this.setState({ jiraOnChangedValue: updateJiraconfig });
    }

    render() {
        if (isPortalAdminOrSupport()) {
            return (
                <>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {headerData.map((head, index) => (
                                        <TableHeader id={index} key={head.key}> {head.header}
                                        </TableHeader>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow key={1} id={1}>
                                    {this.getJiraConfigValues()}
                                    <TableCell>
                                        <Button
                                            kind="ghost" onClick={this.onClickJiraConfigEdit}
                                            style={{ display: 'flex', width: '100%', color: 'red' }}>
                                            {i18n.t('buttons.edit')}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <ComposedModal open={this.state.open} onClose={() => { this.onClickCloseModal(); this.setState({ open: false }) }} >
                        <ModalHeader title={i18n.t("buttons.edit")} />
                        <ModalBody>
                            <TextInput
                                key={"versionId"} data-modal-primary-focus id={"versionId"}
                                labelText={`${i18n.t('adminConfig.jiraFieldsConfigurations.versionIDLabel')}*`}
                                type="number" value={this.state.jiraOnChangedValue['versionId']}
                                invalid={this.state.validations.versionIdIsValid}
                                invalidText={i18n.t('validation.invalid.required')}
                                onChange={(e) => { this.jiraConfigOnChangeHandler(e) }}
                            />
                            <TextInput
                                key={"organizationId"} data-modal-primary-focus id={"organizationId"}
                                labelText={`${i18n.t('adminConfig.jiraFieldsConfigurations.organizatoinIDLabel')}*`}
                                type="number" value={this.state.jiraOnChangedValue.organizationId}
                                invalid={this.state.validations.organizationIdIsValid}
                                invalidText={i18n.t('validation.invalid.required')}
                                onChange={(e) => { this.jiraConfigOnChangeHandler(e) }}
                            />
                            <TextInput
                                key={"subscriptionLevelId"} data-modal-primary-focus id={"subscriptionLevelId"}
                                labelText={`${i18n.t('adminConfig.jiraFieldsConfigurations.SubscriptionLevelIDLabel')}*`}
                                type="number" value={this.state.jiraOnChangedValue.subscriptionLevelId}
                                invalid={this.state.validations.subscriptionLevelIdIsValid}
                                invalidText={i18n.t('validation.invalid.required')}
                                onChange={(e) => { this.jiraConfigOnChangeHandler(e) }}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                kind="secondary"
                                onMouseDown={() => { this.setState({ open: false }) }}
                                onClick={this.onClickCloseModal}>
                                {i18n.t('buttons.cancel')}
                            </Button>
                            <Button kind="primary" onClick={() => { this.onClickJiraConfigSave() }}>
                                {i18n.t('buttons.save')}
                            </Button>
                        </ModalFooter>
                    </ComposedModal>
                </>
            )
        } else {
            return <p>{i18n.t('userMessages.unauthorized')}</p>;
        }
    }
}

const headerData = [
    {
        header: i18n.t('adminConfig.jiraFieldsConfigurations.versionIDLabel'),
        key: 'versionId',
    },
    {
        header: i18n.t('adminConfig.jiraFieldsConfigurations.organizatoinIDLabel'),
        key: 'orgId',
    },
    {
        header: i18n.t('adminConfig.jiraFieldsConfigurations.SubscriptionLevelIDLabel'),
        key: 'subscrId',
    },
    {
        header: i18n.t('customerDashboard.action'),
        key: 'actn',
    },
];

export default withKeycloak(JiraConfiguration);
