import React, { Component } from "react";
import { authenticationChanged, isAuthenticated, isPortalAdminOrSupport } from "../../../api/helpers";
import withKeycloak from "../../../auth/withKeycloak";
import i18n from "../../../i18n";
import { Button, ComposedModal, ModalBody, ModalFooter, ModalHeader, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow, TextInput, } from 'carbon-components-react';
import { apiProductVersionsGet } from "../../../api/productVersion";
import { TICKETING_SYSTEM_CONFIG_ENUM } from "../../../api/constants";
import { apiTicketingSystemConfigResourcePost } from "../../../api/manageFieldConfigurations";

class JiraConfiguration extends Component {
    constructor() {
        super();
        this.state = {
            open: false,
            validations: [
                { isError: false, errorMsg: '' }
            ],
            changedProductName: '',
            jiraConfig: [],
            jiraOnChangedValue : {
                versionId: 0,
                organizationId: 0,
                subscriptionLevelId: 0
            }
        };
        this.timeoutId = null;
    }

    componentDidMount() {
        this.setState({ changedProductName: this.props.productName, jiraConfig: this.props.jiraCustomField })
        if (isPortalAdminOrSupport()) {
            this.getProductVersions();
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.jiraCustomField.length !== this.props.jiraCustomField.length) {
            this.setState({ changedProductName: this.props.productName, jiraConfig: this.props.jiraCustomField })
            let initJira = {
                versionId: 0,
                organizationId: 0,
                subscriptionLevelId: 0
            };
            this.props.jiraCustomField.forEach((el) => {
                initJira[Object.keys(el)[0]] = el[Object.keys(el)[0]]
            })
            this.setState({ jiraOnChangedValue: initJira })
        }
        if (authenticationChanged(this.props, prevProps)) {
            if (isPortalAdminOrSupport()) {
                this.getProductVersions();
            }
        }
    }

    async getProductVersions() {
        if (isAuthenticated(this.props)) {
            const productVersions = await apiProductVersionsGet(this.props.serviceUrl);

            this.setState({
                versions: productVersions.data,
            });
        }
    }

    onClickJiraConfigEdit = () => {
        this.setState({ validations: { isError: false, errorMsg: "" }, changedProductName: this.props.productName, open: true })
    }

    onClickJiraConfigSave = async () => {
        const jiraConfigBuilder = []
        for (let key in this.state.jiraOnChangedValue) {
            jiraConfigBuilder.push({ [key]: this.state.jiraOnChangedValue[key] })
        }
        try {
            await apiTicketingSystemConfigResourcePost(this.props.serviceUrl, TICKETING_SYSTEM_CONFIG_ENUM.JIRA_CUSTOM_FIELD, [this.state.jiraOnChangedValue]).then(() => {
                this.props.getTicketAndSubLevel()
                this.setState({ jiraConfig: jiraConfigBuilder })
            });
        } catch (error) {
            console.error('Error ', error)
        }
        this.setState({ open: false })
    }

    jiraConfigOnChangeHandler = (e, configKey) => {
        const getEleId = e.target.id;
        const getEleValue = e.target.value;
        const updateJiraconfig = this.state.jiraOnChangedValue;
        for (let i = 0; i < this.state.jiraConfig.length; i++) {
            if (getEleId === Object.keys(this.state.jiraConfig[i])[0]) {
                updateJiraconfig[`${Object.keys(this.state.jiraConfig[i])}`] = getEleValue;
            }
        };
        this.setState({ jiraChangedValue: updateJiraconfig })
    }

    onClickCloseModal = () => {
        let initJira = {
            versionId: 0,
            organizationId: 0,
            subscriptionLevelId: 0
        };
        this.state.jiraConfig.forEach((el) => {
            initJira[Object.keys(el)[0]] = el[Object.keys(el)[0]]
        })
        this.setState({ jiraOnChangedValue: initJira })
    }

    getJiraConfigValues = (eleType) => {
        let content = [];
        if (this.state.jiraConfig.length) {
            this.state.jiraConfig.forEach((config, idx) => {
                if (eleType === 'tableCell') {
                    content.push(<TableCell key={Object.keys(config)[0]}>{config[Object.keys(config)[0]]}</TableCell>)
                } else if (eleType === 'textInput') {
                    content.push(
                        <TextInput
                            key={Object.keys(config)[0]} data-modal-primary-focus id={Object.keys(config)[0]} labelText={`${headerData[idx].header}*`}
                            type="number" value={config[Object.keys(config)[0]]}
                            invalid={this.state.validations.isError} invalidText={this.state.validations.errorMsg}
                            onChange={(e) => { this.jiraConfigOnChangeHandler(e, Object.keys(config)[0]) }}
                        />
                    )
                }
            })
        }
        return content
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
                                    {this.getJiraConfigValues('tableCell')}
                                    <TableCell>
                                        <Button
                                            kind="ghost" onClick={this.onClickJiraConfigEdit}
                                            style={{ display: 'flex', width: '100%', color: 'red' }}
                                        >
                                            {i18n.t('buttons.edit')}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <ComposedModal open={this.state.open} onClose={() => { this.setState({ open: false }) }} >
                        <ModalHeader title="Edit" />
                        <ModalBody>
                            {/* {this.getJiraConfigValues('textInput')} */}
                            <TextInput
                                key={"versionId"} data-modal-primary-focus id={"versionId"} labelText={"Version ID*"}
                                type="number" value={this.state.jiraOnChangedValue['versionId']}
                                invalid={this.state.validations.isError} invalidText={this.state.validations.errorMsg}
                                onChange={(e) => { this.jiraConfigOnChangeHandler(e) }}
                            />  
                            <TextInput
                                key={"organizationId"} data-modal-primary-focus id={"organizationId"} labelText={"Organizatoin ID*"}
                                type="number" value={this.state.jiraOnChangedValue.organizationId}
                                invalid={this.state.validations.isError} invalidText={this.state.validations.errorMsg}
                                onChange={(e) => { this.jiraConfigOnChangeHandler(e) }}
                            />
                            <TextInput
                                key={"subscriptionLevelId"} data-modal-primary-focus id={"subscriptionLevelId"} labelText={"Subscription Level ID*"}
                                type="number" value={this.state.jiraOnChangedValue.subscriptionLevelId}
                                invalid={this.state.validations.isError} invalidText={this.state.validations.errorMsg}
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
        header: "Version ID",
        key: 'versionId',
    },
    {
        header: "Organizatoin ID",
        key: 'orgId',
    },
    {
        header: "Subscription Level ID",
        key: 'subscrId',
    },
    {
        header: "Action",
        key: 'actn',
    },
];

export default withKeycloak(JiraConfiguration);