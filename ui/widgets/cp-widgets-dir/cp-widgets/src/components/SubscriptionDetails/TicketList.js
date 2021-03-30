import React, { Component } from 'react';
import { DataTable, TableContainer, Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from 'carbon-components-react';
import { apiJiraTicketsGet } from '../../api/tickets';
import { apiTicketingSystemsGet } from '../../api/ticketingsystem';
import { AuthenticatedView, UnauthenticatedView } from '../../auth/KeycloakViews';
import withKeycloak from '../../auth/withKeycloak';
import { apiProjectGet, apiAddTicketToProject } from '../../api/projects';
import { hasKeycloakClientRole } from '../../api/helpers';
import i18n from '../../i18n';

class TicketList extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      tickets: {}
     }
     this.headerData = [
      {
        header: i18n.t('ticketDetails.issue'),
        key: 'issue',
      },
      {
        header: i18n.t('ticketDetails.description'),
        key: 'description',
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
        header: i18n.t('ticketDetails.creationDate'),
        key: 'creationDate',
      },
      {
        header: i18n.t('ticketDetails.lastUpdated'),
        key: 'lastUpdated',
      },
      {
        header: i18n.t('ticketDetails.link'),
        key: 'link',
      }
    ];
  }

  async fetchData() {
    const { t, keycloak } = this.props;
    var authenticated = keycloak.initialized && keycloak.authenticated;

    if (authenticated) {
      try {
          const project = await apiProjectGet(this.props.serviceUrl, this.props.projectId);
          const ticketingSystems = await apiTicketingSystemsGet(this.props.serviceUrl);
          const currentTicketingSystem = ticketingSystems.data[ticketingSystems.data.length-1]
          var tickets = await apiJiraTicketsGet(this.props.serviceUrl, currentTicketingSystem.systemId, project.data.systemId);
          for(var i = 0; i < tickets.data.length; i++) {
            apiAddTicketToProject(this.props.serviceUrl, this.props.projectId, tickets.data[i].id);
          }

          const ticketOrder = { "Lowest": 1, "Low": 2, "Medium": 3 , "High": 4, "Highest": 5};
          tickets.data.sort(function (a, b) {
            return ticketOrder[b.priority] - ticketOrder[a.priority];
          });
          this.setState({
              tickets: tickets
          });
      }
      catch(err) {
        console.log(err)
      }
    }
}

compare(a, b) {
  if (a.priority < b.priority){
    return -1;
  }
  if (a.priority > b.priority){
    return 1;
  }
  return 0;
}

componentDidMount(){
  const { keycloak } = this.props;
  const authenticated = keycloak.initialized && keycloak.authenticated;

  if(authenticated) {
    if (hasKeycloakClientRole('ROLE_ADMIN') || hasKeycloakClientRole('ROLE_SUPPORT') || hasKeycloakClientRole('ROLE_CUSTOMER') || hasKeycloakClientRole('ROLE_PARTNER')) {
      this.fetchData();
    }
  }
}

componentDidUpdate(prevProps) {
  const { keycloak } = this.props;
  const authenticated = keycloak.initialized && keycloak.authenticated;

  const changedAuth = prevProps.keycloak.authenticated !== authenticated;

  if (authenticated && changedAuth) {
    if (hasKeycloakClientRole('ROLE_ADMIN') || hasKeycloakClientRole('ROLE_SUPPORT') || hasKeycloakClientRole('ROLE_CUSTOMER') || hasKeycloakClientRole('ROLE_PARTNER')) {
      this.fetchData();
    }
  }
}

  render() {
    return ( 
      <div>
        <DataTable rows={rowData} headers={this.headerData}>
        {({ rows, headers, getHeaderProps, getTableProps }) => (
          <TableContainer title={i18n.t('ticketDetails.listOfTickets')} description={i18n.t('ticketDetails.tickets')}>
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader {...getHeaderProps({ header })}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(this.state.tickets).length !== 0 ? this.state.tickets.data.map((ticket) => {
                  return (
                    <TableRow key={ticket.id}>
                      <TableCell key={ticket.id}>{ticket.systemId}</TableCell>
                      <TableCell key={ticket.id}>{ticket.description}</TableCell>
                      <TableCell key={ticket.id}>{ticket.status}</TableCell>
                      <TableCell key={ticket.id}>{ticket.type}</TableCell>
                      <TableCell key={ticket.id}>{ticket.priority}</TableCell>
                      <TableCell key={ticket.id}>{new Date(ticket.createDate).toDateString()}</TableCell>
                      <TableCell key={ticket.id}>{new Date(ticket.updateDate).toDateString()}</TableCell>
                      <TableCell key={ticket.id}><a href={"https://jorden-test-partner-portal.atlassian.net/browse/" + ticket.systemId} target="_blank">{i18n.t('ticketDetails.viewTicket')}</a></TableCell>
                    </TableRow>
                  )
                }) : <p></p> }
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>
    </div>
  )}
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