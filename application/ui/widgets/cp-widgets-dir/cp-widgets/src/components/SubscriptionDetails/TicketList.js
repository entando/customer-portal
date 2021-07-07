import React, { Component } from 'react';
import {
  DataTable,
  InlineLoading,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  PaginationNav,
  Button,
} from 'carbon-components-react';
import {apiJiraTicketsGet} from '../../api/tickets';
import {apiCurrentTicketingSystemGet} from '../../api/ticketingsystem';
import withKeycloak from '../../auth/withKeycloak';
import {apiProjectGet} from '../../api/projects';
import {authenticationChanged, isAuthenticated, isPortalUser} from '../../api/helpers';
import i18n from '../../i18n';
import {Link} from 'react-router-dom';

class TicketList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tickets: {},
      project: {},
      ticketingSystem: {},
      currentPage: 0,
      loading: true
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
    if (isPortalUser()) {
      try {
        const project = (await apiProjectGet(this.props.serviceUrl, this.props.projectId)).data;
        const ticketingSystem = await apiCurrentTicketingSystemGet(this.props.serviceUrl);
        const tickets = await apiJiraTicketsGet(this.props.serviceUrl, project.id);
        this.setState({
          tickets: tickets,
          project: project,
          ticketingSystem: ticketingSystem,
          loading: false
        });
      } catch (err) {
        console.log(err);
      }
    }
  }

  componentDidMount() {
    if (isAuthenticated(this.props)) {
      this.fetchData();
    }
  }

  componentDidUpdate(prevProps) {
    if (authenticationChanged(this.props, prevProps)) {
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
    const ticketSystemUrl = this.state.ticketingSystem.url;
    const ticketingSystemBaseUrl = ticketSystemUrl != null ? ticketSystemUrl.substr(0, ticketSystemUrl.indexOf('/rest')) : null;
    const ticketCount = Object.keys(this.state.tickets).length;

    return (
      <div className="bx--tile">
        {this.state.project.id && (
          <div>
            {/*View All Ticket*/}
            <a
              href={ticketingSystemBaseUrl + '/issues/?jql=Organizations=' + this.state.project.systemId}
              style={{textDecoration: 'none'}}
              target="_blank"
              rel="noreferrer"
            >
              <Button kind="ghost" style={{display: 'block', width: '100%'}} value="Open Ticket">
                {i18n.t('buttons.viewAllTickets')}
              </Button>
            </a>
            {/*Open Ticket*/}
            <Link to={`/ticket/${this.state.project.id}`} style={{textDecoration: 'none'}}>
              <Button kind="ghost" style={{display: 'block', width: '100%'}} value="Open Ticket">
                {i18n.t('buttons.openTicket')}
              </Button>
            </Link>
          </div>
        )}
        {this.state.loading && <InlineLoading/>}
        {!this.state.loading && (
          <>
            <DataTable rows={[{id: '1'}]} headers={this.headerData}>
              {({rows, headers, getHeaderProps, getTableProps}) => (
                <TableContainer title={i18n.t('ticketDetails.listOfTickets')}>
                  <Table {...getTableProps()}>
                    <TableHead>
                      <TableRow>
                        {headers.map(header => (
                          <TableHeader {...getHeaderProps({header})}>{header.header}</TableHeader>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {ticketCount !== 0 ? (
                        this.state.tickets.data.map((ticket, index) => {
                          const indexOfLastItem = (this.state.currentPage + 1) * 10 - 1;
                          const firstIndexOfCurrentPage = this.state.currentPage * 10;
                          const ticketUrl = ticketingSystemBaseUrl + '/browse/' + ticket.systemId;

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
            {ticketCount > 10 && (
              <PaginationNav {...paginationProps()} className="pagination-right"/>
            )}
          </>
        )}
      </div>
    );
  }
}

export default withKeycloak(TicketList);
