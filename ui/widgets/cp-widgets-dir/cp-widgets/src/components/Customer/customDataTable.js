import React, { Component } from 'react';
import { DataTable, TableContainer, Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from 'carbon-components-react';
import '../../index.scss';
import { apiProjectsGetForCustomer } from '../../api/projects';
import { AuthenticatedView, UnauthenticatedView } from '../../auth/KeycloakViews';
import withKeycloak from '../../auth/withKeycloak';
import keycloakType from '../../components/__types__/keycloak';
import { Link } from 'react-router-dom';
import RoleCheck from '../Admin/RoleCheck';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Subscription from '../SubscriptionDetails/Subscription';

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
        var projects = await apiProjectsGetForCustomer(this.props.serviceUrl, this.props.customerNumber);
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
                  this.state.data.data.map((project, index) => (
                    <TableRow key={index} >
                        <TableCell><Link to={`/project-details/${project.projectName}`}>{project.projectName}</Link></TableCell>
                        <TableCell>{project.partners}</TableCell>
                        <TableCell>{project.entandoVersion}</TableCell>
                        <TableCell>{project.startDate}</TableCell>
                        <TableCell>{project.endDate}</TableCell>
                        <TableCell>{project.tickets}</TableCell>
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
    header: 'Partners',
    key: 'partners',
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
