import React, { Component } from 'react';
import {
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  PaginationNav,
} from 'carbon-components-react';
import { apiJiraTicketsGet } from '../../api/tickets';
import { apiCurrentTicketingSystemGet } from '../../api/ticketingsystem';
import withKeycloak from '../../auth/withKeycloak';
import { apiProjectGet, apiAddTicketToProject } from '../../api/projects';
import { isPortalUser } from '../../api/helpers';
import i18n from '../../i18n';

class TicketList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tickets: {},
      project: {},
      currentTicketingSystem: {},
      currentPage: 0,
    };
    this.headerData = [
      {
        header: i18n.t('ticketDetails.issue'),
        key: 'issue',
      },
      {
        header: i18n.t('ticketDetails.summary'),
        key: 'summary',
      },
      {
        header: i18n.t('ticketDetails.status'),
        key: 'status',
      },
      {
        header: i18n.t('ticketDetails.type'),
        key: 'type',
      },
      {
        header: i18n.t('ticketDetails.priority'),
        key: 'priority',
      },
      {
        header: i18n.t('ticketDetails.created'),
        key: 'created',
      },
      {
        header: i18n.t('ticketDetails.updated'),
        key: 'updated',
      },
      {
        header: i18n.t('ticketDetails.link'),
        key: 'link',
      },
    ];
  }

  async fetchData() {
    const { t, keycloak } = this.props;
    var authenticated = keycloak.initialized && keycloak.authenticated;

    if (authenticated) {
      try {
        const project = await apiProjectGet(this.props.serviceUrl, this.props.projectId);
        const currentTicketingSystem = await apiCurrentTicketingSystemGet(this.props.serviceUrl);
        var tickets = await apiJiraTicketsGet(this.props.serviceUrl, currentTicketingSystem.systemId, project.data.systemId);
        for (var i = 0; i < tickets.data.length; i++) {
          apiAddTicketToProject(this.props.serviceUrl, this.props.projectId, tickets.data[i].id);
        }

        this.setState({
          tickets: tickets,
          project: project,
          currentTicketingSystem: currentTicketingSystem,
        });
      } catch (err) {
        console.log(err);
      }
    }
  }

  componentDidMount() {
    if (isPortalUser()) {
      this.fetchData();
    }
  }

  componentDidUpdate(prevProps) {
    const { keycloak } = this.props;
    const authenticated = keycloak.initialized && keycloak.authenticated;

    const changedAuth = prevProps.keycloak.authenticated !== authenticated;

    if (authenticated && changedAuth && isPortalUser()) {
      this.fetchData();
    }
  }

  render() {
    var numberOfPages = 1;
    if (Object.keys(this.state.tickets).length !== 0) {
      numberOfPages = Math.ceil(this.state.tickets.data.length / 10);
    }

    const paginationProps = () => ({
      loop: Boolean(false),
      page: Number(this.state.currentPage),
      totalItems: Number(numberOfPages),
      itemsShown: Number(1),
      onChange: event => this.setState({ currentPage: event }),
    });

    return (
      <div>
        <DataTable rows={rowData} headers={this.headerData}>
          {({ rows, headers, getHeaderProps, getTableProps }) => (
            <TableContainer
              title={i18n.t('ticketDetails.listOfTickets')}
              description={
                Object.keys(this.state.tickets).length !== 0 && Object.keys(this.state.project).length !== 0 ? (
                <a
                  href={
                    this.state.currentTicketingSystem.url.substr(0, this.state.currentTicketingSystem.url.indexOf('/rest')) +
                    '/issues/' +
                    '?jql=Organizations=' +
                    this.state.project.data.systemId
                  }
                  style={{ textDecoration: 'none' }}
                  target="_blank"
                >
                  {i18n.t('buttons.viewTickets')}
                </a>
                ) : (
                  <a>{i18n.t('ticketDetails.tickets')}</a>
                )
              }
            >
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    {headers.map(header => (
                      <TableHeader {...getHeaderProps({ header })}>{header.header}</TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.keys(this.state.tickets).length !== 0 ? (
                    this.state.tickets.data.map((ticket, index) => {
                      var indexOfLastItem = (this.state.currentPage + 1) * 10 - 1;
                      var firstIndexOfCurrentPage = this.state.currentPage * 10;

                      if (index >= firstIndexOfCurrentPage && index <= indexOfLastItem) {
                        return (
                          <TableRow key={ticket.id}>
                            <TableCell key={ticket.id}>{ticket.systemId}</TableCell>
                            <TableCell key={ticket.id}>{ticket.summary}</TableCell>
                            <TableCell key={ticket.id}>{ticket.status}</TableCell>
                            <TableCell key={ticket.id}>{ticket.type}</TableCell>
                            <TableCell key={ticket.id}>{ticket.priority}</TableCell>
                            <TableCell key={ticket.id}>{new Date(ticket.createDate).toDateString()}</TableCell>
                            <TableCell key={ticket.id}>{new Date(ticket.updateDate).toDateString()}</TableCell>
                            <TableCell key={ticket.id}>
                              <a
                                href={
                                  this.state.currentTicketingSystem.url.substr(0, this.state.currentTicketingSystem.url.indexOf('/rest')) +
                                  '/browse/' +
                                  ticket.systemId
                                }
                                target="_blank"
                              >
                                {i18n.t('ticketDetails.viewTicket')}
                              </a>
                            </TableCell>
                          </TableRow>
                        );
                      } else {
                        return null;
                      }
                    })
                  ) : (
                    <p></p>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DataTable>
        <PaginationNav {...paginationProps()} cssClass="pagination-right" />
      </div>
    );
  }
}

const rowData = [
  {
    id: 'a',
    projectName: 'Ticket1',
    project: 'Leonardo',
    entandoVersion: 6.2,
    creationDate: 'October, 2019',
    openTicket: <a href="">Open Ticket</a>,
  },
  {
    id: 'a',
    projectName: 'Ticket1',
    project: 'Leonardo',
    entandoVersion: 6.2,
    creationDate: 'October, 2019',
    openTicket: <a href="">Open Ticket</a>,
  },
  {
    id: 'a',
    projectName: 'Ticket1',
    project: 'Leonardo',
    entandoVersion: 6.2,
    creationDate: 'October, 2019',
    openTicket: <a href="">Open Ticket</a>,
  },
];

export default withKeycloak(TicketList);
