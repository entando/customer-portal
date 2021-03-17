import React, { Component } from 'react';
import { DataTable, TableContainer, Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from 'carbon-components-react';
import { SubtractAlt16 } from '@carbon/icons-react';
import { apiUsersGet, apiUserDelete } from '../../../api/portalusers';
import withKeycloak from '../../../auth/withKeycloak';
import { apiKeycloakUserGet } from '../../../api/keycloak';
import i18n from '../../../i18n';

const headerData = [
    {
        header: i18n.t('manageUsers.delete.userName'),
        key: 'username',
    },
    {
        header: i18n.t('manageUsers.delete.userEmail'),
        key: 'email',
    },
    {
        header: i18n.t('manageUsers.delete.dateAdded'),
        key: 'dateAdded',
    },
    {
        header: i18n.t('manageUsers.delete.userAccess'),
        key: 'userAccess',
    }
];

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
                id:  keycloakUser.username,
                username: keycloakUser.username,
                email: keycloakUser.email,
                dateAdded: `${new Date(keycloakUser.createdTimestamp).toLocaleString('default', { month: 'long'})} ${new Date(keycloakUser.createdTimestamp).getFullYear()}`,
                userAccess: portalUsernames.includes(keycloakUser.username) ? <a onClick={event => this.handleRemoveUser(keycloakUser.username, event)} href=""><SubtractAlt16 fill="red" />{i18n.t('manageUsers.delete.removeUser')}</a> : ''
            }
        ));

        this.setState({
            displayUsers
        });
    }

    handleRemoveUser = (username, event) => {
        event.preventDefault();
        const userId = this.state.portalUsers.get(username).id;
        apiUserDelete(this.props.serviceUrl, userId).then(res => {
            if (res.status === 204) {
                const updatedPortalUsers = this.state.portalUsers;
                updatedPortalUsers.delete(username);
                this.setState({
                    portalUsers: updatedPortalUsers
                });
                this.handleUserDisplay();
            } else {
                // TODO: Error message
            }
        });
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

export default withKeycloak(DeleteUser);