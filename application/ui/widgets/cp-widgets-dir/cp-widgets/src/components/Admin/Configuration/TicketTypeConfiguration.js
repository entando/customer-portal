import React, { Component } from "react";
import { authenticationChanged, isAuthenticated, isPortalAdminOrSupport } from "../../../api/helpers";
import withKeycloak from "../../../auth/withKeycloak";
import i18n from "../../../i18n";
import { Button, Form, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow, TextInput } from 'carbon-components-react';
import { apiProductVersionsGet } from "../../../api/productVersion";
import { Add16 } from '@carbon/icons-react'
import { apiTicketingSystemConfigResourcePost } from "../../../api/manageFieldConfigurations";
import { TICKETING_SYSTEM_CONFIG_ENUM, VALIDATION_VARS } from "../../../api/constants";

class TicketTypeConfiguration extends Component {
    constructor() {
        super();
        this.state = {
            ticketName: '',
            ticketTypeRowData: [],
            validations: [
                { isError: false, errorMsg: '' }
            ]
        };
        this.timeoutId = null;
    }

    componentDidMount() {
        if (isPortalAdminOrSupport()) {
            this.getProductVersions();
        }
        if (this.props.ticketType.length) {
            this.getTicketTypes()
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.ticketType.length !== this.props.ticketType.length) {
            this.getTicketTypes()
        }
        if (authenticationChanged(this.props, prevProps) && isPortalAdminOrSupport()) {
            this.getProductVersions();
        }
    }

    getTicketTypes() {
        if (this.props.ticketType.length) {
            this.setState({ ticketTypeRowData: this.props.ticketType })
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

        if (!this.state.ticketName.length || this.state.ticketName.length < VALIDATION_VARS.CHAR_MIN_LIMIT) {
            this.setState({ validations: { isError: true, errorMsg: i18n.t('validation.invalid.ticketTypeMinChar') } })
            return
        }
        if (this.state.ticketTypeRowData.find((ticket) => (ticket.name.toLocaleLowerCase() === this.state.ticketName.toLocaleLowerCase()))) {
            this.setState({ validations: { isError: true, errorMsg: i18n.t('validation.invalid.ticketDupCheck') } })
            return
        }
        let ticketListBuilder = [...this.state.ticketTypeRowData, {name: this.state.ticketName}]
        try {
            await apiTicketingSystemConfigResourcePost(this.props.serviceUrl, TICKETING_SYSTEM_CONFIG_ENUM.TICKET_TYPE, ticketListBuilder).then(() => {
                this.props.getTicketAndSubLevel()
            });
            const updateTicketTypeRowData = ticketListBuilder
            this.setState({ ticketTypeRowData: [updateTicketTypeRowData], ticketName: '' })
        } catch (error) {
            console.error('Error handleFormSubmit: ',error)
        }
    }

    setFormData = (e) => {
        if (!e.target.value) return
        if (e.target.value.length <= VALIDATION_VARS.CHAR_MAX_LIMIT) {
            if (e.target.value.length && e.target.value.length < VALIDATION_VARS.CHAR_MIN_LIMIT) {
                this.setState({ validations: { isError: true, errorMsg: i18n.t('validation.invalid.ticketTypeMinChar') }, ticketName: e.target.value.trimStart() })
            } else {
                this.setState({ validations: { isError: false, errorMsg: "" }, ticketName: e.target.value.trimStart() })
            }
            return;
        }
        if (this.state.ticketName.length >= VALIDATION_VARS.CHAR_MAX_LIMIT) {
            this.setState({ validations: { isError: true, errorMsg: i18n.t('validation.invalid.ticketTypeMaxChar') } })
            if (!this.timeoutId) {
                setTimeout(() => {
                    this.setState({ validations: { isError: false, errorMsg: "" } })
                    this.timeoutId = null;
                }, VALIDATION_VARS.CHAR_LIMIT_MSG_APPEAR_TIME)
            }
            return
        }
    }

    handleDeleteTicketType = async (ticket) => {
        if (window.confirm(i18n.t('submitMessages.confirmDeleteTicketType'))) {
            let updateTicketTypeAfterDeletedTicket = []
            updateTicketTypeAfterDeletedTicket = this.state.ticketTypeRowData.filter(ticketType => ticket.name !== ticketType.name)
            try {
                await apiTicketingSystemConfigResourcePost(this.props.serviceUrl, TICKETING_SYSTEM_CONFIG_ENUM.TICKET_TYPE, updateTicketTypeAfterDeletedTicket).then(() => {
                    this.props.getTicketAndSubLevel()
                });
                this.setState({ ticketTypeRowData: updateTicketTypeAfterDeletedTicket })
            } catch (error) {
                console.error('Error handleDeleteTicketType: ', error)
            }
        }
    }

    ticketTypeRecord() {
        let ticketTypeRecord = [];
        this.state.ticketTypeRowData.forEach((ticket) => {
            ticketTypeRecord.push(<TableRow key={ticket.name} id={ticket.name}>
                <TableCell>{ticket.name}</TableCell>
                <TableCell>
                    <Button
                        kind="ghost"
                        onClick={() => this.handleDeleteTicketType(ticket)}
                        style={{ display: 'flex', width: '100%', color: 'red' }}
                    >
                        {i18n.t('buttons.delete')}
                    </Button>
                </TableCell>
            </TableRow>);
        });
        return ticketTypeRecord;
    }

    render() {
        if (isPortalAdminOrSupport()) {
            return (
                <>
                    <h4>{i18n.t('adminConfig.manageFieldConfigurations.ticketTypeConfigurations')}</h4>
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
                                {this.ticketTypeRecord()}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <div className="bx--grid" style={{ margin: "0rem", padding: "0rem" }}>
                        <Form className="bx--row" style={{ margin: "2rem 0rem", padding: "0rem" }} onSubmit={this.handleFormSubmit}>
                            <div className="bx--col-lg-6" style={{ paddingLeft: "0rem" }}>
                                <TextInput
                                    id="tickettype" labelText={i18n.t('adminConfig.manageFieldConfigurations.ticketType')} type="text"
                                    value={this.state.ticketName} onChange={this.setFormData}
                                    invalid={this.state.validations.isError} invalidText={this.state.validations.errorMsg}
                                    onBlur={() => { this.setState({ ticketName: this.state.ticketName.trimEnd() }) }}
                                />
                            </div>
                            <div className="bx--col-lg-6">
                                <Button size="lg" kind="tertiary" tabIndex={0} type="submit" renderIcon={Add16} style={{ paddingRight: "2.5rem", "paddingTop": "0.5rem", "alignItems": "center" }}>
                                    {i18n.t('adminConfig.manageFieldConfigurations.addTicketTypeButton')}
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
        header: i18n.t('adminConfig.manageFieldConfigurations.ticketType'),
        key: 'ticketType',
    },
    {
        header: i18n.t('customerDashboard.action'),
        key: 'action',
    },
];

export default withKeycloak(TicketTypeConfiguration);