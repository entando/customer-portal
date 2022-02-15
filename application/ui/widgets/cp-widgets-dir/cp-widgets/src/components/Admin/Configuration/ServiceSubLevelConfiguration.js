import React, { Component } from "react";
import { isPortalAdminOrSupport } from "../../../api/helpers";
import withKeycloak from "../../../auth/withKeycloak";
import i18n from "../../../i18n";
import { Button, Form, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow, TextInput } from 'carbon-components-react';
import { Add16 } from '@carbon/icons-react'
import { apiTicketingSystemConfigResourcePost } from "../../../api/manageFieldConfigurations";
import { TICKETING_SYSTEM_CONFIG_ENUM, VALIDATION_VARS } from "../../../api/constants";

class ServiceSubLevelConfiguration extends Component {
    constructor() {
        super();
        this.state = {
            subscriptionLevel: '',
            serviceSubTypeRowData : [],
            validations: [
                { isError: false, errorMsg: '' }
            ]
        };
        this.timeoutId = null;
    }

    componentDidMount() {
        if (isPortalAdminOrSupport()) {
            this.getSubscription()
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.subLevel.length !== this.props.subLevel.length) {
            this.getSubscription()
        }
    }

    getSubscription() {
        if (this.props.subLevel.length) {
            this.setState({ serviceSubTypeRowData: this.props.subLevel })
        }
    }

    handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!this.state.subscriptionLevel.length || this.state.subscriptionLevel.length < VALIDATION_VARS.CHAR_MIN_LIMIT) {
            this.setState({ validations: { isError: true, errorMsg: i18n.t('validation.invalid.subscrLevelMinChar') } })
            return
        }
        if (this.state.serviceSubTypeRowData.find((ticket) => (ticket.name.toLocaleLowerCase() === this.state.subscriptionLevel.toLocaleLowerCase()))) {
            this.setState({ validations: { isError: true, errorMsg: i18n.t('validation.invalid.subscrDupCheck') } })
            return
        }
        const subsListBuilder = [...this.state.serviceSubTypeRowData, { name: this.state.subscriptionLevel }];
        try {
            await apiTicketingSystemConfigResourcePost(this.props.serviceUrl, TICKETING_SYSTEM_CONFIG_ENUM.SUBSCRIPTION_LEVEL, subsListBuilder).then(() => {
                this.props.getTicketAndSubLevel()
            });
            const updateserviceSubTypeRowData = [...this.state.serviceSubTypeRowData, { levelName: this.state.subscriptionLevel }]
            this.setState({ serviceSubTypeRowData: updateserviceSubTypeRowData, subscriptionLevel: '' })
        } catch (error) {
            console.error('Error handleFormSubmit: ', error)
        }
    }

    setFormData = (e) => {
        if (!e.target && !e.target.value) return
        if (e.target.value.length <= VALIDATION_VARS.CHAR_MAX_LIMIT) {
            if (e.target.value.length && e.target.value.length < VALIDATION_VARS.CHAR_MIN_LIMIT) {
                this.setState({ validations: { isError: true, errorMsg: i18n.t('validation.invalid.subscrLevelMinChar') }, subscriptionLevel: e.target.value.trimStart() })
            }
            else {
                this.setState({ validations: { isError: false, errorMsg: "" }, subscriptionLevel: e.target.value.trimStart() })
            }
            return;
        }
        if (this.state.subscriptionLevel.length >= VALIDATION_VARS.CHAR_MAX_LIMIT) {
            this.setState({ validations: { isError: true, errorMsg: i18n.t('validation.invalid.subscrLevelMaxChar') } })
            if (!this.timeoutId) {
                this.timeoutId = setTimeout(() => {
                    this.setState({ validations: { isError: false, errorMsg: "" } })
                    this.timeoutId = null;
                }, VALIDATION_VARS.CHAR_LIMIT_MSG_APPEAR_TIME)
            }
            return
        }
    }

    handleDeleteServiceSubType = async (ticket) => {
        if (window.confirm(i18n.t('submitMessages.confirmDeleteSubscrLevel'))) {
            let updateServiceSubTypeAfterDeletedSubscr = []
            updateServiceSubTypeAfterDeletedSubscr = this.state.serviceSubTypeRowData.filter(ticketType => ticket.name !== ticketType.name)
            try {
                await apiTicketingSystemConfigResourcePost(this.props.serviceUrl, TICKETING_SYSTEM_CONFIG_ENUM.SUBSCRIPTION_LEVEL, updateServiceSubTypeAfterDeletedSubscr).then(() => {
                    this.props.getTicketAndSubLevel()
                });
                this.setState({ serviceSubTypeRowData: updateServiceSubTypeAfterDeletedSubscr })
            } catch (error) {
                console.error('Error handleDeleteServiceSubType: ',error);
            }
        }
    }

    subLeveRecord() {
        let subLevelRecord = [];
        this.state.serviceSubTypeRowData.forEach((subscr, index) => {
            subLevelRecord.push(<TableRow key={index} id={subscr.name}>
                <TableCell>{subscr.name}</TableCell>
                <TableCell>
                    <Button
                        kind="ghost"
                        onClick={() => this.handleDeleteServiceSubType(subscr)}
                        style={{ display: 'flex', width: '100%', color: 'red' }}
                    >
                        {i18n.t('buttons.delete')}
                    </Button>
                </TableCell>
            </TableRow>);
        });
        return subLevelRecord;
    }

    render() {
        if (isPortalAdminOrSupport()) {
            return (
                <>
                    <h4>{i18n.t('adminConfig.manageFieldConfigurations.subscriptionLevelConfiguration')}</h4>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {headerData.map((head, index) => (
                                        <TableHeader style={{ width: '50%' }} id={index} key={head.key}> {head.header}
                                        </TableHeader>
                                    ))}
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {this.subLeveRecord()}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <div className="bx--grid" style={{ margin: "0rem", padding: "0rem" }}>
                        <Form className="bx--row" style={{ margin: "2rem 0rem", padding: "0rem" }} onSubmit={this.handleFormSubmit}>
                            <div className="bx--col-lg-6" style={{ paddingLeft: "0rem" }}>
                                <TextInput
                                    id="sublevel" labelText={i18n.t('adminConfig.manageFieldConfigurations.subscriptionLevel')} type="text"
                                    value={this.state.subscriptionLevel} onChange={this.setFormData}
                                    invalid={this.state.validations.isError} invalidText={this.state.validations.errorMsg}
                                    onBlur={() => { this.setState({ subscriptionLevel: this.state.subscriptionLevel.trimEnd() }) }}
                                />
                            </div>
                            <div className="bx--col-lg-6">
                                <Button size="lg" kind="tertiary" tabIndex={0} type="submit" renderIcon={Add16} style={{ paddingRight: "2.5rem", "paddingTop": "0.5rem", "alignItems": "center" }}>
                                    {i18n.t('adminConfig.manageFieldConfigurations.addSubscriptionLevelButton')}
                                </Button>
                            </div>
                        </Form>
                    </div>
                    <hr />
                </>
            );
        } else {
            return <p>{i18n.t('userMessages.unauthorized')}</p>;
        }
    }
}

const headerData = [
    {
        header: i18n.t('adminConfig.manageFieldConfigurations.subscriptionLevel'),
        key: 'sublevel',
    },
    {
        header: i18n.t('customerDashboard.action'),
        key: 'action',
    },
];

export default withKeycloak(ServiceSubLevelConfiguration);
