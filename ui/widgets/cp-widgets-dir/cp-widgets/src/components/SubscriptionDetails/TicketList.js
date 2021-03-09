import React, { Component } from 'react';
import { DataTable, TableContainer, Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from 'carbon-components-react';
import { apiJiraTicketsGet } from '../../api/tickets';
import { apiTicketingSystemsGet, apiTicketingSystemPost } from '../../api/ticketingsystem';
import { AuthenticatedView, UnauthenticatedView } from '../../auth/KeycloakViews';
import withKeycloak from '../../auth/withKeycloak';

class TicketList extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      data: {}
     }
  }

  async fetchData() {
    const { t, keycloak } = this.props;
    var authenticated = keycloak.initialized && keycloak.authenticated;

    /*
    if (keycloak.realmAccess) {
      for (var i = 0; i < keycloak.tokenParsed.roles.length; i++) {
        console.log(keycloak.tokenParsed.roles[i])
        console.log(keycloak.tokenParsed.preferred_username)
        if (keycloak.tokenParsed.roles[i] == "ROLE_ADMIN") {
          authenticated = true;
        }
      }
    }
    */
   console.log(this.props.serviceUrl)

    if (authenticated) {
        var tickets = await apiJiraTicketsGet(this.props.serviceUrl);
        console.log("Tickets:", tickets)
        this.setState({
            data: tickets
        });
    }
    this.render();
}

componentDidMount(){
    this.fetchData();
}

componentDidUpdate(prevProps) {
  const { keycloak } = this.props;
  const authenticated = keycloak.initialized && keycloak.authenticated;

  const changedAuth = prevProps.keycloak.authenticated !== authenticated;

  if (authenticated && changedAuth) {
    this.fetchData();
  }
}

  changeState = () => {   
    this.setState({data:'test data'});  
  };  

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
                {Object.keys(this.state.data).length !== 0 ? this.state.data.data.map((ticket) => {
                  return (
                    <TableRow key={ticket.id}>
                      <TableCell key={ticket.id}>{ticket.systemId}</TableCell>
                      <TableCell key={ticket.id}>{ticket.systemId.split("-")[0]}</TableCell>
                      <TableCell key={ticket.id}>{ticket.description}</TableCell>
                      <TableCell key={ticket.id}>{ticket.type}</TableCell>
                      <TableCell key={ticket.id}>{ticket.createDate}</TableCell>
                      <TableCell key={ticket.id}><a href={"https://jira.entando.org/browse/" + ticket.systemId} target="_blank">View Ticket</a></TableCell>
                    </TableRow>
                  )
                }) : null}
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
