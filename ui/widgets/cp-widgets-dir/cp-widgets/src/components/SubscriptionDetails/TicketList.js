import React, { Component } from 'react';
import { DataTable, TableContainer, Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from 'carbon-components-react';
import { apiJiraTicketsGet } from '../../api/tickets';
import { apiTicketingSystemsGet, apiTicketingSystemPost } from '../../api/ticketingsystem';
import { AuthenticatedView, UnauthenticatedView } from '../../auth/KeycloakViews';
import withKeycloak from '../../auth/withKeycloak';
import { apiGetProjectsUsers, apiProjectGet, apiGetProjectsTickets, apiAddTicketToProject } from '../../api/projects';
import { hasKeycloakClientRole } from '../../api/helpers';

class TicketList extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      tickets: {}
     }
  }

  async fetchData() {
    const { t, keycloak } = this.props;
    var authenticated = keycloak.initialized && keycloak.authenticated;

    if (authenticated) {
      try {
          const project = await apiProjectGet(this.props.serviceUrl, this.props.projectId);
          const ticketingSystems = await apiTicketingSystemsGet(this.props.serviceUrl);
          const currentTicketingSystem = ticketingSystems.data[ticketingSystems.data.length-1]
          const tickets = await apiJiraTicketsGet(this.props.serviceUrl, currentTicketingSystem.systemId, project.data.systemId);
          for(var i = 0; i < tickets.data.length; i++) {
            apiAddTicketToProject(this.props.serviceUrl, this.props.projectId, tickets.data[i].id);
          }
          this.setState({
              tickets: tickets
          });
      }
      catch(err) {
        console.log(err)
      }
    }
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
        <DataTable rows={rowData} headers={headerData}>
        {({ rows, headers, getHeaderProps, getTableProps }) => (
          <TableContainer title="List of Tickets" description="Tickets">
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
                      <TableCell key={ticket.id}>{ticket.systemId.split("-")[0]}</TableCell>
                      <TableCell key={ticket.id}>{ticket.description}</TableCell>
                      <TableCell key={ticket.id}>{ticket.type}</TableCell>
                      <TableCell key={ticket.id}>{new Date(ticket.createDate).toDateString()}</TableCell>
                      <TableCell key={ticket.id}><a href={"https://jorden-test-partner-portal.atlassian.net/browse/" + ticket.systemId} target="_blank">View Ticket</a></TableCell>
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

const headerData = [
  {
    header: 'Issue',
    key: 'projectName',
  },
  {
    header: 'Project',
    key: 'project',
  },
  {
    header: 'Description',
    key: 'description',
  },
  {
    header: 'Type',
    key: 'type',
  },
  {
    header: 'Creation Date',
    key: 'creationDate',
  },
  {
      header: 'Link',
      key: 'openTicket',
  },
];

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