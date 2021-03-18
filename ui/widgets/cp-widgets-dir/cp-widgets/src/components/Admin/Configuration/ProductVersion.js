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
  ToggleSmall,
  Button
} from 'carbon-components-react';
import { SubtractAlt16 } from '@carbon/icons-react';
import { apiProductVersionsGet, apiUpdateProductVersionsStatus } from '../../../api/productVersion';
import withKeycloak from '../../../auth/withKeycloak';
import AddProductVersionModal from '../AddProductVersionModal';
import { hasKeycloakClientRole } from '../../../api/helpers';

class ProductVersion extends Component {
  constructor() {
    super();
    this.state = {
      data: ''
    };
  }

  componentDidMount() {
    this.getProductVersions();
  }

  componentDidUpdate(prevProps) {
    const { keycloak } = this.props;
    const authenticated = keycloak.initialized && keycloak.authenticated;

    const changedAuth = prevProps.keycloak.authenticated !== authenticated;

    if (authenticated && changedAuth) {
      this.getProductVersions();
    }
  }

  async getProductVersions() {
    const { t, keycloak } = this.props;
    const authenticated = keycloak.initialized && keycloak.authenticated;
    if (authenticated) {
      const productVersions = await apiProductVersionsGet(this.props.serviceUrl);

      this.setState({
        data: productVersions
      });
    }
  }

  async handleToggleChange(id) {
    await apiUpdateProductVersionsStatus(this.props.serviceUrl, id);
  }

  render() {
    if (hasKeycloakClientRole('ROLE_ADMIN') || hasKeycloakClientRole('ROLE_SUPPORT')) {
      return (
        <div>
          <DataTable rows={rowData} headers={headerData}>
            {({ rows, headers, getHeaderProps, getTableProps }) => (
              <TableContainer>
                <Table {...getTableProps()}>
                  <TableHead>
                    <TableRow>
                      {headers.map(header => (
                        <TableHeader {...getHeaderProps({ header })}>{header.header}</TableHeader>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.keys(this.state.data).length !== 0
                      ? this.state.data.data.map((productVersion, index) => (
                          <TableRow key={index}>
                            <TableCell>{productVersion.name}</TableCell>
                            <TableCell>
                              <ToggleSmall
                                onClick={() => this.handleToggleChange(productVersion.id)}
                                aria-label="toggle button"
                                id={productVersion.id}
                                defaultToggled={productVersion.status ? true : false}
                              />
                            </TableCell>
                            <TableCell>{productVersion.startDate}</TableCell>
                            <TableCell>{productVersion.endDate}</TableCell>
                          </TableRow>
                        ))
                      : null}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </DataTable>
          <br />
          <AddProductVersionModal serviceUrl={this.props.serviceUrl} />
        </div>
      );
    }
    else {
      return(<p>You are not authorized to view this</p>)
    }
  }
}

const headerData = [
  {
    header: i18n.t('adminConfig.manageProductVersion.entandoVersion'),
    key: 'entVersion'
  },
  {
    header: i18n.t('adminConfig.manageProductVersion.status'),
    key: 'status'
  },
  {
    header: i18n.t('adminConfig.manageProductVersion.startDate'),
    key: 'startDate'
  },
  {
    header: i18n.t('adminConfig.manageProductVersion.supportEndDate'),
    key: 'endDate'
  }
];

const rowData = [
  {
    id: 'a',
    entVersion: '5.2',
    status: <ToggleSmall aria-label="toggle button" defaultToggled id="status-1" />,
    startDate: 'April, 2018',
    endDate: 'April, 2022'
  },
  {
    id: 'b',
    entVersion: '6.3',
    status: <ToggleSmall aria-label="toggle button" id="status-2" />,
    startDate: 'Jile, 2019',
    endDate: 'April, 2023'
  },
  {
    id: 'c',
    entVersion: '6.2',
    status: <ToggleSmall aria-label="toggle button" defaultToggled id="status-3" />,
    startDate: 'September, 2020',
    endDate: 'April, 2024'
  }
];

export default withKeycloak(ProductVersion);
