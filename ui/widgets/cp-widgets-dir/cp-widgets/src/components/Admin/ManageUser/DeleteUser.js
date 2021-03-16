import React, { Component } from 'react';
import { DataTable, TableContainer, Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from 'carbon-components-react';
import { SubtractAlt16 } from '@carbon/icons-react';
import { apiUsersGet, apiUserDelete } from '../../../api/portalusers';
import withKeycloak from '../../../auth/withKeycloak';
import { apiKeycloakUserGet } from '../../../api/keycloak';

class DeleteUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            portalUsers: new Map(),
            keycloakUsers: new Map(),
            displayUsers: [],
            filterText: ''
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    async fetchData() {
        const { keycloak } = this.props;

        const authenticated = keycloak.initialized && keycloak.authenticated;
        if (authenticated) {
            const portalUsers = this.handleMapFormatting((await apiUsersGet(this.props.serviceUrl)).data);
            const keycloakUsers = this.handleMapFormatting((await apiKeycloakUserGet(this.props.keycloakUrl)).data);

            console.log(portalUsers, keycloakUsers);

            this.setState({
                portalUsers,
                keycloakUsers
            });

            this.handleUserDisplay();
        }
    }

    /**
     * Turns the list of user objects into a map where the key is the unique username.
     */
    handleMapFormatting(users) {
        return new Map(users.map(user => [user.username, user]));
    }

    handleUserDisplay() {
        const { portalUsers, keycloakUsers } = this.state;
        const portalUsernames = [...portalUsers.keys()];
        const keycloakUserObjects = [...keycloakUsers.values()];

        const displayUsers = keycloakUserObjects.map(keycloakUser => (
            {
                username: keycloakUser.username,
                email: keycloakUser.email,
                dateAdded: `${new Date(keycloakUser.createdTimestamp).toLocaleString('default', { month: 'long'})} ${new Date(keycloakUser.createdTimestamp).getFullYear()}`,
                userAccess: portalUsernames.includes(keycloakUser.username) ? <a onClick={this.deleteUser}><SubtractAlt16 fill="red" />Remove User</a> : ''
            }
        ));

        this.setState({
            displayUsers
        });

        console.log(this.state.displayUsers);
    }

    deleteUser(e) {
        console.log(e);
    }

    render() {
        return (
            <DataTable rows={this.state.displayUsers} headers={headerData}>
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
        key: 'username',
    },
    {
        header: 'User Email',
        key: 'email',
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