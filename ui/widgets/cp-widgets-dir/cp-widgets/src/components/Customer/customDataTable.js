import React, { Component } from 'react';
import { DataTable, TableContainer, Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from 'carbon-components-react';
import '../../index.scss';
import { apiProjectsGet } from '../../api/projects';
import { AuthenticatedView, UnauthenticatedView } from '../../auth/KeycloakViews';
import withKeycloak from '../../auth/withKeycloak';
import keycloakType from '../../components/__types__/keycloak';

class CustomTable extends Component {
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
        var projects = await apiProjectsGet(this.props.serviceUrl);
        this.setState({
            data: projects
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

  render() { 
    /*
    if (Object.keys(this.state.data).length !== 0 && this.props.customerId) {
      var filteredProjects = this.state.data.data.filter(project => project.customer != null)
    }
    */
    return ( 
      <div>
        <DataTable rows={rowData} headers={headerData} data={this.state.data}>
        {({ rows, headers, getHeaderProps, getTableProps }) => (
          <TableContainer title="Subscriptions" description="In this table there are open subscriptions">
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
                {Object.keys(this.state.data).length !== 0 ? 
                  this.state.data.data.map((project) => (
                    <TableRow key={project.id} >
                        <TableCell key={project.id}>{project.name}</TableCell>
                        <TableCell key={project.id}>{project.contactName}</TableCell>
                        <TableCell key={project.id}>{project.customer ? project.customer.id : "0"}</TableCell>
                        <TableCell key={project.id}>{project.createDate}</TableCell>
                        <TableCell key={project.id}>{project.createDate}</TableCell>
                        <TableCell key={project.id}>{project.tickets ? project.tickets.length : "0"}</TableCell>
                    </TableRow>
                  )) : null
              }
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
    header: 'Project Name',
    key: 'projectName',
  },
  {
    header: 'Partner Name',
    key: 'partnerName',
  },
  {
    header: 'Entando Version',
    key: 'entandoVersion',
  },
  {
    header: 'Start Date',
    key: 'startDate',
  },
  {
      header: 'End Date',
      key: 'endDate',
  },
  {
      header: 'Open Tickets',
      key: 'openTickets',
  },
];

const rowData = [
  {
       id: 'a',
       projectName: <a href="">Supplier Portal</a>,
       partnerName: 'Leonardo',
       entandoVersion: 5.2,
       startDate: 'October, 2019',
       endDate: 'October, 2022',
       openTickets: '5',
    },
    {
      id: 'b',
      projectName: <a href="">Task Manager</a>,
      partnerName: 'Veriday',
      entandoVersion: 5.2,
      startDate: 'July, 2019',
      endDate: 'July, 2022',
      openTickets: '2',
    },
    {
      id: 'c',
      projectName: <a href="">Sales Coordination App</a>,
      partnerName: 'Accenture',
      entandoVersion: 6.2,
      startDate: 'September, 2019',
      endDate: 'September, 2022',
      openTickets: '2',
    },
    {
      id: 'd',
      projectName: <a href="">Website</a>,
      partnerName: 'Veriday',
      entandoVersion: 5.2,
      startDate: 'October, 2019',
      endDate: 'October, 2022',
      openTickets: '1',
    }  
];
 
export default withKeycloak(CustomTable);
