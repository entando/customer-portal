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
    const authenticated = keycloak.initialized && keycloak.authenticated;
    if (authenticated) {
        
        var tickets = await apiJiraTicketsGet(this.props.serviceUrl);
        
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
    console.log(this.state.data)
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
                {rows.map((row) => (
                  <TableRow key={row.id} >
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id}>{cell.value}</TableCell>
                    ))}
                  </TableRow>
                ))}
                {Object.keys(this.state.data).length !== 0 ? this.state.data.data.issues.map((ticket) => {
                  return (
                    <TableRow key={ticket.id}>
                      <TableCell key={ticket.id}>{ticket.key}</TableCell>
                      <TableCell key={ticket.id}>{ticket.key.split("-")[0]}</TableCell>
                      <TableCell key={ticket.id}>6.2</TableCell>
                      <TableCell key={ticket.id}>March, 2020</TableCell>
                      <TableCell key={ticket.id}><a href="https://jorden-test-partner-portal.atlassian.net/jira/software/projects/JAT/boards/1">Open Ticket</a></TableCell>
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
    header: 'Entando Version',
    key: 'entandoVersion',
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
