import React, { Component } from "react";
import { authenticationChanged, isAuthenticated, isPortalAdminOrSupport } from "../../../api/helpers";
import withKeycloak from "../../../auth/withKeycloak";
import i18n from "../../../i18n";
import { Button, Form, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow, TextInput } from 'carbon-components-react';
import { apiProductVersionsGet } from "../../../api/productVersion";
import { Add16 } from '@carbon/icons-react'
import { apiTicketingSystemConfigResourcePost } from "../../../api/manageFieldConfigurations";

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
    }

    componentDidMount() {
        if (isPortalAdminOrSupport()) {
            this.getProductVersions();
        }
        if (this.props.ticketType.length) {
            this.getTicketTypes()
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // IMP: remove all the console.log
        // console.log('-------------------------');
        // console.log('this.props', this.props)
        // console.log('prevProps', prevProps);
        // console.log('prevState', prevState);
        // console.log('this.state', this.state);
        // console.log('-------------------------');
        if (prevProps.ticketType.length !== this.props.ticketType.length) {
            // console.log("#########################");
            // console.log('this.props', this.props)
            // console.log('prevProps', prevProps);
            // console.log('prevState', prevState);
            // console.log('this.state', this.state);
            // console.log("#########################");
            this.getTicketTypes()
        }
        if (authenticationChanged(this.props, prevProps)) {
            if (isPortalAdminOrSupport()) {
                this.getProductVersions();
            }
        }
    }

    getTicketTypes(data) {
        if (this.props.ticketType.length) {
            // console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%', this.props.ticketType)
            this.setState({ ticketTypeRowData: this.props.ticketType })
            // console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%')
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

        if (!this.state.ticketName.length || this.state.ticketName.length < 3) {
            this.setState({ validations: { isError: true, errorMsg: "Ticket Type must be at least 3 characters" } })
            return
        }
        if (this.state.ticketTypeRowData.find((ticket) => (ticket.ticketType === this.state.ticketName))) {
            this.setState({ validations: { isError: true, errorMsg: "This ticket type already exists, please enter a new ticket type" } })
            return
        }

        const ticketListBuilder = JSON.stringify([...this.state.ticketTypeRowData, { name: this.state.ticketName }]);
        // TODO: Post API HIT
        // TODO: Rerender happens here.
        try {
            await apiTicketingSystemConfigResourcePost(this.props.serviceUrl, true, 'Entando', ticketListBuilder).then(() => {
                this.props.getTicketAndSubLevel()
            });
            const updateTicketTypeRowData = [...this.state.ticketTypeRowData, { name: this.state.ticketName }]
            this.setState({ ticketTypeRowData: updateTicketTypeRowData })
            this.setState({ ticketName: '' })
        } catch (error) {
            console.error('Error :',error)
        }
    }

    setFormData = (e) => {
        if ((!e && !e.target && !e.target.value) || e.target.value.length > 100) return
        this.setState({ validations: { isError: false, errorMsg: "" } })
        this.setState({ ticketName: e.target.value.trimStart() })
    }

    handleDeleteTicketType = async (ticket) => {
        if (window.confirm(`Are you sure you want to Delete the ${ticket.name} type!`)) {
            let updateTicketTypeAfterDeletedTicket = []
            updateTicketTypeAfterDeletedTicket = JSON.stringify(this.state.ticketTypeRowData.filter(ticketType => ticket.name !== ticketType.name))
            try {
                await apiTicketingSystemConfigResourcePost(this.props.serviceUrl, true, 'Entando', updateTicketTypeAfterDeletedTicket).then(() => {
                    this.props.getTicketAndSubLevel()
                });
                updateTicketTypeAfterDeletedTicket = JSON.parse(updateTicketTypeAfterDeletedTicket)
                this.setState({ ticketTypeRowData: updateTicketTypeAfterDeletedTicket })
            } catch (error) {
                console.error('Error ', error)
            }
        }
    }

    render() {
        if (isPortalAdminOrSupport()) {
            return (
                <>
                    <div>
                        <h4>{i18n.t('adminConfig.manageFieldConfigurations.ticketTypeConfigurations')}</h4>
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
                                    {this.state.ticketTypeRowData.map((ticket, index) => (
                                        <TableRow key={index} id={index}>
                                            {/* FIXME:  ticket.name can change*/}
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
                                        </TableRow>
                                    ))}
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
                                    <Button size="lg" kind="tertiary" tabIndex={0} type="submit" renderIcon={Add16} style={{ "paddingTop": "0.5rem", "alignItems": "center" }}>
                                        {i18n.t('adminConfig.manageFieldConfigurations.addTicketTypeButton')}
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
        header: i18n.t('adminConfig.manageFieldConfigurations.ticketType'),
        key: 'ticketType',
    },
    {
        header: i18n.t('customerDashboard.action'),
        key: 'action',
    },
];

export default withKeycloak(TicketTypeConfiguration);