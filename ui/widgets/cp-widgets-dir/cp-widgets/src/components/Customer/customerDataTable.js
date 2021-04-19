import React, { Component } from 'react';
import { DataTable, TableContainer, Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from 'carbon-components-react';
import '../../index.scss';
import { apiGetCustomersProjects, apiGetMyCustomersProjects, apiDeleteProjectFromCustomer } from '../../api/customers';
import withKeycloak from '../../auth/withKeycloak';
import { Link } from 'react-router-dom';
import i18n from '../../i18n';
import { isPortalAdminOrSupport } from '../../api/helpers';
import {apiCurrentTicketingSystemGet} from "../../api/ticketingsystem";
import ProjectActionItems from '../Admin/ProjectActionItems';

class CustomerDataTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: {},
      ticketingSystem: {},
      action: 'Edit',
      showMenu: {},
    };
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
      },
    ];
  }

  async fetchData() {
    const { keycloak } = this.props;
    const authenticated = keycloak.initialized && keycloak.authenticated;

    if (authenticated) {
      try {
        var projects;
        if (isPortalAdminOrSupport()) {
          projects = await apiGetCustomersProjects(this.props.serviceUrl, this.props.customerNumber);
        } else {
          projects = await apiGetMyCustomersProjects(this.props.serviceUrl, this.props.customerNumber);
        }

        const ticketingSystem = await apiCurrentTicketingSystemGet(this.props.serviceUrl);

        this.setState({
          projects: projects,
          ticketingSystem: ticketingSystem,
        });
      } catch (error) {
        console.log(error);
      }
    }
    this.render();
  }

  componentDidMount() {
    const { keycloak } = this.props;
    const authenticated = keycloak.initialized && keycloak.authenticated;

    if (authenticated) {
      this.fetchData();
    }
  }

  updateProjectList = () => {
    this.fetchData();
  };

  showMenu = (e, id) => {
    var showMenu = {};
    showMenu[String(id)] = !this.state.showMenu[String(id)];
    this.setState({
      showMenu: showMenu,
    });
    //document.addEventListener('mousedown', this.closeMenu);
  };

  closeMenu = () => {
    this.setState({ showMenu: false }, () => {
      document.removeEventListener('click', this.closeMenu);
    });
  };

  async deleteProject(id) {
    const { keycloak } = this.props;
    const authenticated = keycloak.initialized && keycloak.authenticated;
    if (authenticated) {
      return await apiDeleteProjectFromCustomer(this.props.serviceUrl, this.props.customerNumber, id);
    }
  }

  handleDeleteProject = (e, id) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to delete this project?')) {
      this.deleteProject(id)
        .then(() => {
          this.setState({
            submitMsg: i18n.t('submitMessages.deleted'),
            submitColour: '#24a148',
          });
          this.props.updateCustomerList();
        })
        .catch(() => {
          this.setState({
            submitMsg: i18n.t('submitMessages.error'),
            submitColour: '#da1e28',
          });
        });
    }
  };

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
                    {headers.map(header => {
                      if (header.header === i18n.t('customerDetails.notes')) {
                        if (isPortalAdminOrSupport()) {
                          return <TableHeader {...getHeaderProps({ header })}>{header.header}</TableHeader>;
                        }
                      } else {
                        return <TableHeader {...getHeaderProps({ header })}>{header.header}</TableHeader>;
                      }
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.keys(this.state.projects).length !== 0
                    ? this.state.projects.data.map((project, index) => {
                        if (project.projectSubscriptions.length === 0) {
                          return (
                            <TableRow key={index}>
                              <TableCell>{project.name}</TableCell>
                              {project.partners.length !== 0 ? (
                                <TableCell>
                                  {project.partners.map(partner => (
                                    <p>{partner.name}</p>
                                  ))}
                                </TableCell>
                              ) : (
                                <TableCell>{i18n.t('userMessages.none')}</TableCell>
                              )}
                              <TableCell>{i18n.t('userMessages.none')}</TableCell>
                              <TableCell>{i18n.t('userMessages.none')}</TableCell>
                              <TableCell>{i18n.t('userMessages.none')}</TableCell>
                              <TableCell>{i18n.t('userMessages.none')}</TableCell>
                              <TableCell>{project.tickets.length}</TableCell>
                              {isPortalAdminOrSupport() ? <TableCell style={{ width: '250px' }}>{project.notes}</TableCell> : null}
                              <TableCell>
                                <ProjectActionItems
                                  serviceUrl={this.props.serviceUrl}
                                  ticketingSystem={this.state.ticketingSystem}
                                  locale={this.props.locale}
                                  hasSubscription={false}
                                  project={project}
                                  allProjects={this.state.projects.data}
                                  handleDeleteProject={this.handleDeleteProject}
                                  updateProjectList={this.updateProjectList}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        } else {
                          //Note: this uses the last subscription which isn't necessarily the current active one
                          var sub = project.projectSubscriptions[project.projectSubscriptions.length - 1];
                          return (
                            <TableRow key={index}>
                              <TableCell>
                                <Link to={`/subscription-details/${sub.id}`}>{project.name}</Link>
                              </TableCell>
                              {project.partners.length !== 0 ? (
                                <TableCell>
                                  {project.partners.map(partner => (
                                    <p>{partner.name}</p>
                                  ))}
                                </TableCell>
                              ) : (
                                <TableCell>{i18n.t('userMessages.none')}</TableCell>
                              )}
                              {sub.entandoVersion ? (
                                <TableCell>{sub.entandoVersion.name}</TableCell>
                              ) : (
                                <TableCell>{i18n.t('userMessages.none')}</TableCell>
                              )}
                              <TableCell>{sub.status}</TableCell>
                              <TableCell>{String(new Date(sub.startDate).toDateString())}</TableCell>
                              <TableCell>
                                {String(
                                  new Date(
                                    new Date(sub.startDate).setMonth(new Date(sub.startDate).getMonth() + sub.lengthInMonths)
                                  ).toDateString()
                                )}
                              </TableCell>
                              <TableCell>{project.tickets.length}</TableCell>
                              {isPortalAdminOrSupport() ? <TableCell style={{ width: '250px' }}>{project.notes}</TableCell> : null}
                              <TableCell>
                                <ProjectActionItems
                                  serviceUrl={this.props.serviceUrl}
                                  ticketingSystem={this.state.ticketingSystem}
                                  locale={this.props.locale}
                                  sub={sub}
                                  hasSubscription={true}
                                  project={project}
                                  allProjects={this.state.projects.data}
                                  handleDeleteProject={this.handleDeleteProject}
                                  updateProjectList={this.updateProjectList}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        }
                      })
                    : null}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DataTable>
      </div>
    );
  }
}

const rowData = [
  {
    id: 'a',
    projectName: 'Supplier Portal',
    partnerName: 'Leonardo',
    entandoVersion: 5.2,
    startDate: 'October, 2019',
    endDate: 'October, 2022',
    openTickets: '5',
  },
  {
    id: 'b',
    projectName: 'Supplier Portal',
    partnerName: 'Veriday',
    entandoVersion: 5.2,
    startDate: 'July, 2019',
    endDate: 'July, 2022',
    openTickets: '2',
  },
  {
    id: 'c',
    projectName: 'Supplier Portal',
    partnerName: 'Accenture',
    entandoVersion: 6.2,
    startDate: 'September, 2019',
    endDate: 'September, 2022',
    openTickets: '2',
  },
  {
    id: 'd',
    projectName: 'Supplier Portal',
    partnerName: 'Veriday',
    entandoVersion: 5.2,
    startDate: 'October, 2019',
    endDate: 'October, 2022',
    openTickets: '1',
  },
];

export default withKeycloak(CustomerDataTable);
