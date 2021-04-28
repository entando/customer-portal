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
import {apiGetProjectSubscriptions, apiProjectGet} from "../../../api/projects";
import {formatEndDate, formatStartDate} from "../../../api/subscriptions";

class ManageSubscriptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectId: '',
      project: {},
      subscriptions: []
    }
    ;
    this.headerData = [
      {
        header: i18n.t('projectDetails.id'),
        key: 'id',
      },
      {
        header: i18n.t('projectDetails.status'),
        key: 'status',
      },
      {
        header: i18n.t('projectDetails.entandoVersion'),
        key: 'entandoVersion',
      },
      {
        header: i18n.t('projectDetails.level'),
        key: 'level',
      },
      {
        header: i18n.t('projectDetails.startDate'),
        key: 'startDate',
      },
      {
        header: i18n.t('projectDetails.endDate'),
        key: 'endDate',
      },
      {
        header: i18n.t('customerDashboard.action'),
        key: 'action',
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

      let project = {};
      let subscriptions = {};
      if (projectId != null) {
        project = ((await apiProjectGet(this.props.serviceUrl, projectId)).data);
        subscriptions = ((await apiGetProjectSubscriptions(this.props.serviceUrl, projectId)).data);
      }

      this.setState({
        projectId: projectId,
        project: project,
        subscriptions: subscriptions
      });
    }
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
      <div>
        <h5>{(this.state.project !== null) && this.state.project.name}</h5>
        <DataTable rows={[{id: "1"}]} headers={this.headerData}>
          {({headers, getHeaderProps, getTableProps}) => (
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
                  {(Object.keys(this.state.subscriptions).length !== 0) &&
                  this.state.subscriptions.map((subscription, index) => (
                    <TableRow key={index}>
                      <TableCell>{subscription.id}</TableCell>
                      <TableCell>{subscription.status}</TableCell>
                      <TableCell>{subscription.entandoVersion.name}</TableCell>
                      <TableCell>{subscription.level}</TableCell>
                      <TableCell>{formatStartDate(subscription.startDate)}</TableCell>
                      <TableCell>{formatEndDate(subscription.startDate, subscription.lengthInMonths)}</TableCell>
                      <TableCell>Edit Delete</TableCell>
                    </TableRow>
                  ))}
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
    entandoVersion: 5.2,
    startDate: 'October, 2019',
    endDate: 'October, 2022',
  }
];

export default withKeycloak(ManageSubscriptions);
