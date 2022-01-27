import React, { Component } from "react";
import { authenticationChanged, isAuthenticated, isPortalAdminOrSupport } from "../../../api/helpers";
import withKeycloak from "../../../auth/withKeycloak";
import i18n from "../../../i18n";
import { Button, Form, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow, TextInput } from 'carbon-components-react';
import { apiProductVersionsGet } from "../../../api/productVersion";
import { Add16 } from '@carbon/icons-react'

class TicketTypeConfiguration extends Component {
    constructor() {
        super();
        this.state = {
            ticketName: '',
            ticketTypeRowData: [
                // {
                //     // id: 'a',
                //     ticketType: 'Bug'
                // },
                {
                    // id: 'b',
                    ticketType: 'Task'
                },
                {
                    // id: 'c',
                    ticketType: 'Epic'
                },
                {
                    // id: 'd',
                    ticketType: 'Story'
                },
            ],
            validations: [
                { isError: false, errorMsg: '' }
            ]
        };
    }

    componentDidMount() {
        if (isPortalAdminOrSupport()) {
            this.getProductVersions();
        }
    }

    componentDidUpdate(prevProps) {
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

    handleFormSubmit = (e) => {
        e.preventDefault();

        if (!this.state.ticketName.length || this.state.ticketName.length < 3) {
            this.setState({ validations: { isError: true, errorMsg: "Ticket Type must be at least 3 characters" } })
            return
        }
        if (this.state.ticketTypeRowData.find((ticket) => (ticket.ticketType === this.state.ticketName))) {
            this.setState({ validations: { isError: true, errorMsg: "This ticket type already exists, please enter a new ticket type" } })
            return
        }
        const updateTicketTypeRowData = [...this.state.ticketTypeRowData, { ticketType: this.state.ticketName }]
        this.setState({ ticketTypeRowData: updateTicketTypeRowData })
        this.setState({ ticketName: '' })
    }

    setFormData = (e) => {
        if ((!e && !e.target && !e.target.value) || e.target.value.length > 100) return
        this.setState({ validations: { isError: false, errorMsg: "" } })
        this.setState({ ticketName: e.target.value.trimStart() })
    }

    handleDeleteTicketType = (ticket) => {
        if (window.confirm(`Are you sure you want to Delete the ${ticket.ticketType} type!`)) {
            let updateTicketTypeAfterDeletedTicket = []
            updateTicketTypeAfterDeletedTicket = this.state.ticketTypeRowData.filter(ticketType => ticket.ticketType !== ticketType.ticketType)
            this.setState({ ticketTypeRowData: updateTicketTypeAfterDeletedTicket })
        }
    }

    render() {
        if (isPortalAdminOrSupport()) {
            return (
                <>
                    <div>
                        <h4>Ticket Type Configurations</h4>
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
                                            <TableCell>{ticket.ticketType}</TableCell>
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
                                        id="tickettype" labelText="Ticket Type" type="text"
                                        value={this.state.ticketName} onChange={this.setFormData}
                                        invalid={this.state.validations.isError} invalidText={this.state.validations.errorMsg}
                                        onBlur={() => { this.setState({ ticketName: this.state.ticketName.trimEnd() }) }}
                                    />
                                </div>
                                <div className="bx--col-lg-6">
                                    <Button size="lg" kind="tertiary" tabIndex={0} type="submit" renderIcon={Add16} style={{ "paddingTop": "0.5rem", "alignItems": "center" }}>
                                        Add Ticket Type
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
        header: "Ticket Type",
        key: 'ticketType',
    },
    {
        header: "Action",
        key: 'action',
    },
];

// const ticketTypeRowData = [
//     {
//         // id: 'a',
//         ticketType: 'Bug'
//     },
//     {
//         // id: 'b',
//         ticketType: 'Task'
//     },
//     {
//         // id: 'c',
//         ticketType: 'Epic'
//     },
//     {
//         // id: 'd',
//         ticketType: 'Story'
//     },
// ]

export default withKeycloak(TicketTypeConfiguration);