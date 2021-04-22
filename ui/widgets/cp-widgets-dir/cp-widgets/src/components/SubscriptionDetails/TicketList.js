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
import {apiJiraTicketsGet} from '../../api/tickets';
import {apiCurrentTicketingSystemGet} from '../../api/ticketingsystem';
import withKeycloak from '../../auth/withKeycloak';
import {apiProjectGet, apiAddTicketToProject, apiGetMyProject} from '../../api/projects';
import {isPortalAdminOrSupport, isPortalUser} from '../../api/helpers';
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
    const { keycloak } = this.props;
    var authenticated = keycloak.initialized && keycloak.authenticated;

    if (authenticated) {
      try {
        let project;
        if (isPortalAdminOrSupport()) {
          project = await apiProjectGet(this.props.serviceUrl, this.props.projectId);
        } else {
          project = await apiGetMyProject(this.props.serviceUrl, this.props.projectId);
        }
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
      onChange: event => this.setState({currentPage: event}),
    });
    const ticketSystemUrl = this.state.currentTicketingSystem.url;
    const ticketingSystemBaseUrl = (ticketSystemUrl != null) ?
      ticketSystemUrl.substr(0, ticketSystemUrl.indexOf('/rest'))
      : null;

    return (
      <div>
        <DataTable rows={rowData} headers={this.headerData}>
          {({rows, headers, getHeaderProps, getTableProps}) => (
            <TableContainer
              title={i18n.t('ticketDetails.listOfTickets')}
              description={
                this.state.project.data != null ? (
                  <a
                    href={ticketingSystemBaseUrl + '/issues/' +
                    '?jql=Organizations=' +
                    this.state.project.data.systemId
                    }
                    style={{textDecoration: 'none'}}
                    target="_blank" rel="noreferrer"
                  >
                    {i18n.t('buttons.viewAllTickets')}
                  </a>
                ) : (
                  <div>{i18n.t('ticketDetails.tickets')}</div>
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
                      const indexOfLastItem = (this.state.currentPage + 1) * 10 - 1;
                      const firstIndexOfCurrentPage = this.state.currentPage * 10;
                      const ticketUrl = ticketingSystemBaseUrl +
                        '/browse/' + ticket.systemId;

                      if (index >= firstIndexOfCurrentPage && index <= indexOfLastItem) {
                        return (
                          <TableRow key={ticket.id}>
                            <TableCell>
                              <a href={ticketUrl} target="_blank" rel="noreferrer">
                                {ticket.systemId}
                              </a>
                            </TableCell>
                            <TableCell>{ticket.summary}</TableCell>
                            <TableCell>{ticket.status}</TableCell>
                            <TableCell>{ticket.type}</TableCell>
                            <TableCell>{ticket.priority}</TableCell>
                            <TableCell>{new Date(ticket.createDate).toDateString()}</TableCell>
                            <TableCell>{new Date(ticket.updateDate).toDateString()}</TableCell>
                            <TableCell>
                              <a href={ticketUrl} target="_blank" rel="noreferrer">
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
                    <TableRow/>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DataTable>
        <PaginationNav {...paginationProps()} className="pagination-right"/>
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
    openTicket: 'Open Ticket',
  },
  {
    id: 'a',
    projectName: 'Ticket1',
    project: 'Leonardo',
    entandoVersion: 6.2,
    creationDate: 'October, 2019',
    openTicket: 'Open Ticket',
  },
  {
    id: 'a',
    projectName: 'Ticket1',
    project: 'Leonardo',
    entandoVersion: 6.2,
    creationDate: 'October, 2019',
    openTicket: 'Open Ticket',
  },
];

export default withKeycloak(TicketList);
