import React, {Component} from 'react';
import {
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Button
} from 'carbon-components-react';
import withKeycloak from '../../../auth/withKeycloak';
import i18n from '../../../i18n';
import {isAuthenticated, authenticationChanged} from "../../../api/helpers";

// import {apiGetProjectUsers, apiDeleteUserFromProject} from "../../../api/projects";

class ManageSubscriptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectId: '',
    };
    this.headerData = [
      {
        header: i18n.t('manageUsers.delete.userName'),
        key: 'username',
      },
      {
        header: i18n.t('manageUsers.delete.userEmail'),
        key: 'email',
      },
      {
        header: i18n.t('manageUsers.delete.userAccess'),
        key: 'userAccess',
      },
    ];
  }

  componentDidMount() {
    if (isAuthenticated(this.props)) {
      this.fetchData();
    }
  }

  componentDidUpdate(prevProps) {
    if (authenticationChanged(this.props, prevProps)) {
      this.fetchData();
    }
  }

  async fetchData() {
    if (isAuthenticated(this.props)) {
      let search = window.location.search;
      const params = new URLSearchParams(search);
      const projectId = params.get('project');

      // let users = [];
      // if (projectId != null) {
      //   users = ((await apiGetProjectUsers(this.props.serviceUrl, projectId)).data);
      // }

      this.setState({
        //subscriptions,
        projectId: projectId
      });


      // this.handleUserDisplay();
    }
  }

  handleDisplay() {
    //TODO
    // const users = this.state.users;
    // const projectId = this.state.projectId;
    //
    // const displayUsers = users.map(user => ({
    //   id: user.username,
    //   username: user.username,
    //   email: user.email,
    //   userAccess: (
    //     <Button
    //       kind="ghost"
    //       onClick={event => this.handleRemoveUser(user.id, projectId, event)}
    //       style={{display: 'flex', width: '100%', color: 'red'}}
    //     >
    //       {i18n.t('manageUsers.delete.removeUser')}
    //     </Button>
    //   ),
    // }));
    //
    // this.setState({
    //   displayUsers,
    // });
  }

  // handleRemoveUser = (userId, projectId, event) => {
  //   event.preventDefault();
  //
  //   apiDeleteUserFromProject(this.props.serviceUrl, projectId, userId).then(res => {
  //     if (res.status === 201) {
  //       this.fetchData();
  //     } else {
  //       console.warn("Failed to delete user", res);
  //     }
  //   });
  // };

  render() {
    return (
      <DataTable rows={[{id: "1"}]} headers={this.headerData}>
        {({rows, headers, getHeaderProps, getTableProps}) => (
          <TableContainer>
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {headers.map(header => (
                    <TableHeader {...getHeaderProps({header})}>{header.header}</TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => (
                  <TableRow key={row.id}>
                    {row.cells.map(cell => (
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

const rowData = [
  {
    id: 'a',
    entandoVersion: 5.2,
    startDate: 'October, 2019',
    endDate: 'October, 2022',
  }
];

export default withKeycloak(ManageSubscriptions);
