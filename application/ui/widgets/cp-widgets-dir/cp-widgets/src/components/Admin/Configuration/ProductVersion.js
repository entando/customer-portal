import React, { Component } from 'react';
import i18n from '../../../i18n';
import {
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Toggle,
  Button,
} from 'carbon-components-react';
import { apiProductVersionDelete, apiProductVersionsGet, apiUpdateProductVersionsStatus } from '../../../api/productVersion';
import withKeycloak from '../../../auth/withKeycloak';
import AddProductVersionModal from '../AddProductVersionModal';
import {authenticationChanged, isAuthenticated, isPortalAdminOrSupport} from '../../../api/helpers';
import EditVersionModal from '../EditVersionModal';

class ProductVersion extends Component {
  constructor() {
    super();
    this.state = {
      versions: '',
    };
  }

  componentDidMount() {
    if (isPortalAdminOrSupport()) {
      this.getProductVersions();
    }
  }

  componentDidUpdate(prevProps) {
    if (authenticationChanged(this.props, prevProps)) {
      if (isPortalAdminOrSupport()) {
        this.getProductVersions();
      }
    }
  }

  async getProductVersions() {
    if (isAuthenticated(this.props)) {
      const productVersions = await apiProductVersionsGet(this.props.serviceUrl);

      this.setState({
        versions: productVersions.data,
      });
    }
  }

  async deleteVersion(id) {
    if (isAuthenticated(this.props)) {
      return await apiProductVersionDelete(this.props.serviceUrl, id);
    }
  }

  handleDeleteVersion = (e, id) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to delete this Entando version?')) {
      this.deleteVersion(id)
        .then(() => {
          this.setState({
            submitMsg: i18n.t('submitMessages.deleted'),
            submitColour: '#24a148',
          });
          this.updateProductVersions();
        })
        .catch(() => {
          this.setState({
            submitMsg: i18n.t('submitMessages.error'),
            submitColour: '#da1e28',
          });
        });
    }
  };

  updateProductVersions = () => {
    this.getProductVersions();
  };

  async handleToggleChange(id) {
    return await apiUpdateProductVersionsStatus(this.props.serviceUrl, id);
  }

  render() {
    if (isPortalAdminOrSupport()) {
      return (
        <div>
          <DataTable rows={rowData} headers={headerData}>
            {({rows, headers, getHeaderProps, getTableProps}) => (
              <TableContainer>
                <Table {...getTableProps()}>
                  <TableHead>
                    <TableRow>
                      {headers.map(header => (
                        <TableHeader {...getHeaderProps({ header })}>{header.key === 'entVersion' ? `${this.props.productName} Version` : header.header}</TableHeader>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.keys(this.state.versions).length !== 0
                      ? this.state.versions.map((productVersion, index) => (
                        <TableRow key={index}>
                          <TableCell>{productVersion.name}</TableCell>
                          <TableCell>
                            <Toggle
                              size="sm"
                              onClick={() => this.handleToggleChange(productVersion.id)}
                              aria-label="toggle button"
                              id={'toggle' + productVersion.id}
                              defaultToggled={productVersion.status}
                            />
                          </TableCell>
                          <TableCell>{productVersion.startDate}</TableCell>
                          <TableCell>{productVersion.endDate}</TableCell>
                          <TableCell>
                            <div style={{display: 'flex'}}>
                              <EditVersionModal
                                key={productVersion.id}
                                version={productVersion}
                                serviceUrl={this.props.serviceUrl}
                                updateProductVersions={this.updateProductVersions}
                              />
                                <Button
                                  kind="ghost"
                                  onClick={e => this.handleDeleteVersion(e, productVersion.id)}
                                  style={{ display: 'flex', width: '100%', color: 'red' }}
                                >
                                  {i18n.t('buttons.delete')}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      : null}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </DataTable>
          <br />
          <AddProductVersionModal serviceUrl={this.props.serviceUrl} updateProductVersions={this.updateProductVersions} />
        </div>
      );
    } else {
      return <p>{i18n.t('userMessages.unauthorized')}</p>;
    }
  }
}

const headerData = [
  {
    header: i18n.t('adminConfig.manageProductVersion.entandoVersion'),
    key: 'entVersion',
  },
  {
    header: i18n.t('adminConfig.manageProductVersion.status'),
    key: 'status',
  },
  {
    header: i18n.t('adminConfig.manageProductVersion.startDate'),
    key: 'startDate',
  },
  {
    header: i18n.t('adminConfig.manageProductVersion.supportEndDate'),
    key: 'endDate',
  },
  {
    header: i18n.t('customerDashboard.action'),
    key: 'action',
  },
];

const rowData = [
  {
    id: 'a',
    entVersion: '5.2',
    status: <Toggle size="sm" aria-label="toggle button" defaultToggled id="status-1" />,
    startDate: 'April, 2018',
    endDate: 'April, 2022',
  },
  {
    id: 'b',
    entVersion: '6.3',
    status: <Toggle size="sm" aria-label="toggle button" id="status-2"/>,
    startDate: 'Jile, 2019',
    endDate: 'April, 2023',
  },
  {
    id: 'c',
    entVersion: '6.2',
    status: <Toggle size="sm" aria-label="toggle button" defaultToggled id="status-3"/>,
    startDate: 'September, 2020',
    endDate: 'April, 2024',
  },
];

export default withKeycloak(ProductVersion);
