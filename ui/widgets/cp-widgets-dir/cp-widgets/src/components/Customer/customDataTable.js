import React, { Component } from 'react';
import { DataTable, TableContainer, Table, TableHead, TableRow, TableHeader, TableBody, TableCell, Button } from 'carbon-components-react';
import '../../index.scss';
import { apiGetCustomersProjects, apiGetMyCustomersProjects, apiDeleteProjectFromCustomer } from '../../api/customers';
import { AuthenticatedView, UnauthenticatedView } from '../../auth/KeycloakViews';
import withKeycloak from '../../auth/withKeycloak';
import { Link, HashRouter } from 'react-router-dom';
import i18n from '../../i18n';
import EditProjectModal from '../Admin/EditProjectModal'
import { hasKeycloakClientRole } from '../../api/helpers';
import { apiProjectsDelete } from '../../api/projects';

class CustomTable extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      projects: {},
      action: "Edit",
      showMenu: false,
     }
     this.headerData = [
      {
        header: i18n.t('customerDashboard.projectName'),
        key: 'projectName',
      },
      {
        header: i18n.t('customerDashboard.partners'),
        key: 'partners',
      },
      {
        header: i18n.t('customerDashboard.entandoVersion'),
        key: 'entandoVersion',
      },
      {
        header: i18n.t('customerDashboard.status'),
        key: 'status',
      },
      {
        header: i18n.t('customerDashboard.startDate'),
        key: 'startDate',
      },
      {
          header: i18n.t('customerDashboard.endDate'),
          key: 'endDate',
      },
      {
          header: i18n.t('customerDashboard.openTickets'),
          key: 'openTickets',
      },
      {
        header: i18n.t('customerDetails.notes'),
        key: 'notes',
      },  
      {
          header: i18n.t('customerDashboard.action'),
          key: 'action',
      }
    ];
  }

  async fetchData() {
    const { t, keycloak } = this.props;
    const authenticated = keycloak.initialized && keycloak.authenticated;
    
    if (authenticated) {
      try {
      var projects;
      if (hasKeycloakClientRole('ROLE_ADMIN') || hasKeycloakClientRole('ROLE_SUPPORT')) {
        projects = await apiGetCustomersProjects(this.props.serviceUrl, this.props.customerNumber);
      }
      else {
        projects = await apiGetMyCustomersProjects(this.props.serviceUrl, this.props.customerNumber);
      }
      
      this.setState({
          projects: projects
      });
    } catch(error) {
      console.log(error)
    }
    }
    this.render();
}

componentDidMount(){
  const { keycloak } = this.props;
    const authenticated = keycloak.initialized && keycloak.authenticated;

    if (authenticated) {
      this.fetchData();
    }
}

updateProjectList = () => {
  this.fetchData();
}

handleActions = (e, id) => {
  if (e.target.value === "View") {
    window.location.href = `/#/subscription-details/${id}`
  }
  console.log(e);
}

showMenu = () => {
  this.setState({
    showMenu: !this.state.showMenu
  })
  //document.addEventListener('mousedown', this.closeMenu);
}

closeMenu = () => {
  this.setState({ showMenu: false }, () => {
    document.removeEventListener('click', this.closeMenu);
  });  
}

async deleteProject(id) {
  const { t, keycloak } = this.props;
  const authenticated = keycloak.initialized && keycloak.authenticated;
  if (authenticated) {
    return await apiDeleteProjectFromCustomer(this.props.serviceUrl, this.props.customerNumber, id);
  }
}

handleDeleteProject = (e, id) => {
  e.preventDefault();
  if (window.confirm("Are you sure you want to delete this project?")) {
    this.deleteProject(id).then(result => {
      this.setState({
          submitMsg: i18n.t('submitMessages.deleted'),
          submitColour: '#24a148'
      })
      this.props.updateCustomerList();
    }).catch(err => {
      this.setState({
          submitMsg: i18n.t('submitMessages.error'),
          submitColour: '#da1e28'
      })
    });
  }
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
    return (
      <div>
        <DataTable rows={rowData} headers={this.headerData}>
        {({ rows, headers, getHeaderProps, getTableProps }) => (
          <TableContainer description={i18n.t('customerDashboard.tableDesc')}>
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {headers.map((header) => {
                    if(header.header === i18n.t('customerDetails.notes')) {
                      if (hasKeycloakClientRole('ROLE_ADMIN') || hasKeycloakClientRole('ROLE_SUPPORT')) {
                        return(
                          <TableHeader {...getHeaderProps({ header })}>
                            {header.header}
                          </TableHeader>
                        )
                      }
                    }
                    else {
                      return(
                        <TableHeader {...getHeaderProps({ header })}>
                          {header.header}
                        </TableHeader>
                      )
                    }
                  })}
                  
                </TableRow>
              </TableHead>
              <TableBody>
              {Object.keys(this.state.projects).length !== 0 ? 
                  this.state.projects.data.map((project, index) => {
                    if (project.projectSubscriptions.length === 0) {
                      return(
                        <TableRow key={index} >
                          <TableCell>{project.name}</TableCell>
                          {project.partners.length !== 0 ? 
                            <TableCell>
                              {project.partners.map(partner => (
                                <p>{partner.name}</p>
                              ))}
                            </TableCell> 
                          : <TableCell>{i18n.t('userMessages.none')}</TableCell>}
                          <TableCell>{i18n.t('userMessages.none')}</TableCell>
                          <TableCell>{i18n.t('userMessages.none')}</TableCell>
                          <TableCell>{i18n.t('userMessages.none')}</TableCell>
                          <TableCell>{i18n.t('userMessages.none')}</TableCell>
                          <TableCell>{project.tickets.length}</TableCell>
                          {hasKeycloakClientRole('ROLE_ADMIN') || hasKeycloakClientRole('ROLE_SUPPORT')  ? <TableCell style={{width: '250px'}}>{project.notes}</TableCell> : null}
                          <TableCell>
                            <div>
                              <Button onClick={this.showMenu} style={{padding: '10px 20px'}} kind="tertiary">
                                +
                              </Button>
                              {this.state.showMenu ? 
                                <div 
                                  className="menu" 
                                  style={{zIndex: '100', position: 'absolute', backgroundColor: 'white'}} 
                                >
                                  <hr style={{margin: '0', border: 'none', borderTop: '1px solid lightgrey'}} />
                                  {hasKeycloakClientRole('ROLE_ADMIN') ?
                                    <div>
                                      <EditProjectModal key={project.id} allProjects={this.state.projects.data} project={project} serviceUrl={this.props.serviceUrl} updateProjectList={this.updateProjectList}/>
                                      <hr style={{margin: '0', border: 'none', borderTop: '1px solid lightgrey'}} />
                                    </div> : null
                                  }
                                  {hasKeycloakClientRole('ROLE_ADMIN') ?
                                    <div>
                                      <Button kind='ghost' onClick={(e) => this.handleDeleteProject(e, project.id)} style={{display: 'block', width: '100%', color: 'red'}}>Delete</Button>
                                      <hr style={{margin: '0', border: 'none', borderTop: '1px solid lightgrey'}} />
                                    </div> : null
                                  }
                                </div>
                                : null
                              }
                            </div>
                          </TableCell>
                      </TableRow>
                      )
                    }
                    else {
                      var sub = project.projectSubscriptions[project.projectSubscriptions.length - 1];
                      return(
                        <TableRow key={index} >
                            <TableCell><Link to={`/subscription-details/${sub.id}`}>{project.name}</Link></TableCell>
                            {project.partners.length !== 0 ? 
                              <TableCell>
                                {project.partners.map(partner => (
                                  <p>{partner.name}</p>
                                ))}
                              </TableCell> 
                              : <TableCell>{i18n.t('userMessages.none')}</TableCell>}
                            {sub.entandoVersion ? <TableCell>{sub.entandoVersion.name}</TableCell> : <TableCell>{i18n.t('userMessages.none')}</TableCell>}
                            <TableCell>{sub.status}</TableCell>
                            <TableCell>{String(new Date(sub.startDate).toDateString())}</TableCell>
                            <TableCell>{String(new Date(new Date(sub.startDate).setMonth(new Date(sub.startDate).getMonth() + sub.lengthInMonths)).toDateString())}</TableCell>
                            <TableCell>{project.tickets.length}</TableCell>
                            {hasKeycloakClientRole('ROLE_ADMIN') || hasKeycloakClientRole('ROLE_SUPPORT')  ? <TableCell style={{width: '250px'}}>{project.notes}</TableCell> : null}
                            <TableCell>
                              <div>
                                <Button onClick={this.showMenu} style={{padding: '10px 20px'}} kind="tertiary">
                                  +
                                </Button>
                                {this.state.showMenu ? 
                                  <div 
                                    className="menu" 
                                    style={{zIndex: '100', position: 'absolute', backgroundColor: 'white'}} 
                                  >
                                    <Button kind='ghost' style={{display: 'block', width: '100%'}} onClick={(e) => this.handleActions(e, sub.id)} value="View">View</Button>
                                    <hr style={{margin: '0', border: 'none', borderTop: '1px solid lightgrey'}} />
                                    {hasKeycloakClientRole('ROLE_ADMIN') ?
                                      <div>
                                        <EditProjectModal key={project.id} allProjects={this.state.projects.data} project={project} serviceUrl={this.props.serviceUrl} updateProjectList={this.updateProjectList}/>
                                        <hr style={{margin: '0', border: 'none', borderTop: '1px solid lightgrey'}} />
                                      </div> : null
                                    }
                                    {hasKeycloakClientRole('ROLE_ADMIN') ?
                                      <div>
                                        <Button kind='ghost' onClick={(e) => this.handleDeleteProject(e, project.id)} style={{display: 'block', width: '100%', color: 'red'}}>Delete</Button>
                                        <hr style={{margin: '0', border: 'none', borderTop: '1px solid lightgrey'}} />
                                      </div> : null
                                    }
                                  </div>
                                  : null
                                }
                              </div>
                            </TableCell>
                        </TableRow>
                      )
                    }
                  }) : null
              }
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