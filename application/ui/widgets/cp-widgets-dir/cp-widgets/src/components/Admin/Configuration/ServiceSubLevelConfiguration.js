import React, { Component } from "react";
import { authenticationChanged, isAuthenticated, isPortalAdminOrSupport } from "../../../api/helpers";
import withKeycloak from "../../../auth/withKeycloak";
import i18n from "../../../i18n";
import { Button, Form, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow, TextInput } from 'carbon-components-react';
import { apiProductVersionsGet } from "../../../api/productVersion";
import { Add16 } from '@carbon/icons-react'
import { apiTicketingSystemConfigResourcePost } from "../../../api/manageFieldConfigurations";

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
    }

    componentDidMount() {
        if (isPortalAdminOrSupport()) {
            this.getProductVersions();
        }
        if (this.props.subLevel.length) {
            this.getSubscription()
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.subLevel.length !== this.props.subLevel.length) {
            this.getSubscription()
        }
        if (authenticationChanged(this.props, prevProps)) {
            if (isPortalAdminOrSupport()) {
                this.getProductVersions();
            }
        }
    }

    getSubscription() {
        if (this.props.subLevel.length) {
            this.setState({ serviceSubTypeRowData: this.props.subLevel })
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

    handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!this.state.subscriptionLevel.length || this.state.subscriptionLevel.length < 3) {
            this.setState({ validations: { isError: true, errorMsg: "Subscription Level must be at least 3 characters" } })
            return
        }
        if (this.state.serviceSubTypeRowData.find((ticket) => (ticket.ticketType === this.state.subscriptionLevel))) {
            this.setState({ validations: { isError: true, errorMsg: "This Subscription Level already exist, please enter a new Level" } })
            return
        }

        console.log(this.state.subscriptionLevel, this.state.serviceSubTypeRowData)
        const subsListBuilder = JSON.stringify([...this.state.serviceSubTypeRowData, { levelName: this.state.subscriptionLevel }]);
        // IMP: remover latter
        const ticketListFake = JSON.stringify([])
        console.log(subsListBuilder);
        // TODO: Post API HIT
        try {
            await apiTicketingSystemConfigResourcePost(this.props.serviceUrl, true, 'Entando', ticketListFake, subsListBuilder).then(() => {
                this.props.getTicketAndSubLevel()
            });
            const updateserviceSubTypeRowData = [...this.state.serviceSubTypeRowData, { levelName: this.state.subscriptionLevel }]
            this.setState({ serviceSubTypeRowData: updateserviceSubTypeRowData })
            this.setState({ subscriptionLevel: '' })
        } catch (error) {
            console.error('Error ', error)
        }
    }

    setFormData = (e) => {
        if ((!e && !e.target && !e.target.value) || e.target.value.length > 100) return
        this.setState({ validations: { isError: false, errorMsg: "" } })
        this.setState({ subscriptionLevel: e.target.value.trimStart()})
    }

    handleDeleteServiceSubType = async (ticket) => {
        if (window.confirm(`Are you sure you want to Delete the ${ticket.levelName} Subs Level Config!`)) {
            let updateServiceSubTypeAfterDeletedSubscr = []
            updateServiceSubTypeAfterDeletedSubscr = JSON.stringify(this.state.serviceSubTypeRowData.filter(ticketType => ticket.levelName !== ticketType.levelName))
            const updateTicketTypeAfterDeletedTicket = JSON.stringify([])
            try {
                await apiTicketingSystemConfigResourcePost(this.props.serviceUrl, true, 'Entando', updateTicketTypeAfterDeletedTicket, updateServiceSubTypeAfterDeletedSubscr).then(() => {
                    this.props.getTicketAndSubLevel()
                });
                updateServiceSubTypeAfterDeletedSubscr = JSON.parse(updateServiceSubTypeAfterDeletedSubscr)
                this.setState({ serviceSubTypeRowData: updateServiceSubTypeAfterDeletedSubscr })
            } catch (error) {
                console.error(error);
            }
        }
    }

    render() {
        if (isPortalAdminOrSupport()) {
            return (
                <>
                    <div>
                        <h4>{i18n.t('adminConfig.manageFieldConfigurations.subscriptionLevelConfiguration')}</h4>
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
                                    {this.state.serviceSubTypeRowData.map((ticket, index) => (
                                        <TableRow key={index} id={index}>
                                            {/* FIXME:  ticket.levelName can change*/}
                                            <TableCell>{ticket.levelName}</TableCell>
                                            <TableCell>
                                                <Button
                                                    kind="ghost"
                                                    onClick={() => this.handleDeleteServiceSubType(ticket)}
                                                    style={{ display: 'flex', width: '100%', color: 'red' }}
                                                >
                                                    {i18n.t('buttons.delete')}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
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
                                    <Button size="lg" kind="tertiary" tabIndex={0} type="submit" renderIcon={Add16} style={{ "paddingTop": "0.5rem", "alignItems": "center" }}>
                                        {i18n.t('adminConfig.manageFieldConfigurations.addSubscriptionLevelButton')}
                                    </Button>
                                </div>
                            </Form>
                        </div>
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