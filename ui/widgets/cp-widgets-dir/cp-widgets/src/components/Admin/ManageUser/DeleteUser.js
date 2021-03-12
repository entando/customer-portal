import React, { Component } from 'react';
import { DataTable, TableContainer, Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from 'carbon-components-react';
import { SubtractAlt16 } from '@carbon/icons-react';
import { apiUsersGet } from '../../../api/portalusers';
import withKeycloak from '../../../auth/withKeycloak';

class DeleteUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    };
    this.state.filterText = "";
  }

  componentDidMount() {
    this.fetchData();
  }

  async fetchData() {
    const { keycloak } = this.props;

    const authenticated = keycloak.initialized && keycloak.authenticated;
    if (authenticated) {
      const users = await apiUsersGet(this.props.serviceUrl);

      this.setState({
        users
      });

      console.log(users);
    }
  }

  render() {
    return (
      <DataTable rows={rowData} headers={headerData}>
        {({ rows, headers, getHeaderProps, getTableProps }) => (
          <TableContainer>
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
                  <TableRow key={row.id}>
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id}>{cell.value}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>
    );
  }
}

const headerData = [
  {
    header: 'User Name',
    key: 'userName',
  },
  {
    header: 'User Role',
    key: 'userRole',
  },
  {
    header: 'Date Added',
    key: 'dateAdded',
  },
  {
    header: 'User Access',
    key: 'userAccess',
  }
];

const rowData = [
  {
    id: 'a',
    userName: 'User1',
    userRole: 'Role1',
    dateAdded: 'April, 2019',
    userAccess: <a onClick=''><SubtractAlt16 fill="red" /> Remove User</a>,
  },
  {
    id: 'b',
    userName: 'User2',
    userRole: 'Role2',
    dateAdded: 'October, 2018',
    userAccess: <a onClick=""><SubtractAlt16 fill="red" /> Remove User</a>
  },
  {
    id: 'c',
    userName: 'User3',
    userRole: 'Role3',
    dateAdded: 'August, 2017',
    userAccess: <a onClick=""><SubtractAlt16 fill="red" /> Remove User</a>
  },
  {
    id: 'd',
    userName: 'User4',
    userRole: 'Role4',
    dateAdded: 'October, 2019',
    userAccess: <a onClick=""><SubtractAlt16 fill="red" /> Remove User</a>
  }
];

export default withKeycloak(DeleteUser);