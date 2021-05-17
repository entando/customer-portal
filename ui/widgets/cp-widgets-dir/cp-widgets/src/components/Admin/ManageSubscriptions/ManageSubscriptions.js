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
import '../../../index.scss';
import withKeycloak from '../../../auth/withKeycloak';
import i18n from '../../../i18n';
import {isAuthenticated, authenticationChanged, getPageUrl} from '../../../api/helpers';
import {apiDeleteSubscriptionFromProject, apiGetProjectSubscriptions, apiProjectGet} from '../../../api/projects';
import {formatEndDate, formatStartDate} from '../../../api/subscriptions';
import {PAGE_SUBSCRIPTION_FORM} from "../../../api/constants";
import Breadcrumbs from "../../Breadcrumbs/Breadcrumbs";

class ManageSubscriptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectId: '',
      project: {},
      subscriptions: [],
    };
    this.headerData = [
      {
        header: i18n.t('projectDetails.id'),
        key: 'id',
      },
      {
        header: i18n.t('subscriptionDetails.status'),
        key: 'status',
      },
      {
        header: i18n.t('projectDetails.entandoVersion'),
        key: 'entandoVersion',
      },
      {
        header: i18n.t('subscriptionDetails.level'),
        key: 'level',
      },
      {
        header: i18n.t('subscriptionDetails.startDate'),
        key: 'startDate',
      },
      {
        header: i18n.t('subscriptionDetails.endDate'),
        key: 'endDate',
      },
      {
        header: i18n.t('subscriptionDetails.lengthInMonths'),
        key: 'lengthInMonths',
      },
      {
        header: i18n.t('subscriptionDetails.notes'),
        key: 'notes',
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
        project = (await apiProjectGet(this.props.serviceUrl, projectId)).data;
        subscriptions = (await apiGetProjectSubscriptions(this.props.serviceUrl, projectId)).data;
      }

      this.setState({
        projectId: projectId,
        project: project,
        subscriptions: subscriptions,
      });
    }
  }

  async deleteSubscription(subscriptionId) {
    if (isAuthenticated(this.props)) {
      return await apiDeleteSubscriptionFromProject(this.props.serviceUrl, this.state.projectId, subscriptionId);
    }
  }

  handleDeleteSubscription = (e, id) => {
    e.preventDefault();
    if (window.confirm(i18n.t('submitMessages.confirmDelete'))) {
      console.log('confirmed to delete', id);
      this.deleteSubscription(id)
        .then(() => {
          this.setState({
            submitMsg: i18n.t('submitMessages.deleted'),
            submitColour: '#24a148',
          });
          this.fetchData();
        })
        .catch(() => {
          this.setState({
            submitMsg: i18n.t('submitMessages.error'),
            submitColour: '#da1e28',
          });
        });
    }
  };

  render() {
    const project = this.state.project;
    return (
      <div>
        <Breadcrumbs project={project} locale={this.props.locale}/>
        <h5>{project.name}</h5>
        <a
          href={`${getPageUrl(PAGE_SUBSCRIPTION_FORM, this.props.locale)}?project=${this.state.projectId}`}
          style={{textDecoration: 'none'}}
        >
          <Button kind="ghost" style={{display: 'block', width: '100%'}} value="Add Subscription">
            {i18n.t('buttons.addSubscription')}
          </Button>
        </a>

        <DataTable rows={[{id: '1'}]} headers={this.headerData}>
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
                  {Object.keys(this.state.subscriptions).length !== 0 &&
                  this.state.subscriptions.map((subscription, index) => (
                    <TableRow key={index}>
                      <TableCell>{subscription.id}</TableCell>
                      <TableCell>{subscription.status}</TableCell>
                      <TableCell>{subscription.entandoVersion.name}</TableCell>
                      <TableCell>{subscription.level}</TableCell>
                      <TableCell>{formatStartDate(subscription.startDate)}</TableCell>
                      <TableCell>{formatEndDate(subscription.startDate, subscription.lengthInMonths)}</TableCell>
                      <TableCell>{subscription.lengthInMonths}</TableCell>
                      <TableCell>{subscription.notes}</TableCell>
                      <TableCell>
                        <a
                          href={`${getPageUrl(PAGE_SUBSCRIPTION_FORM, this.props.locale)}?project=${this.state.projectId}&subscription=${subscription.id}`}
                          style={{textDecoration: 'none'}}
                        >
                          <Button kind="ghost" style={{display: 'block', width: '100%'}} value="Edit">
                            {i18n.t('buttons.edit')}
                          </Button>
                        </a>
                        <Button
                          kind="ghost"
                          onClick={event => this.handleDeleteSubscription(event, subscription.id)}
                          className="button-warning"
                        >
                          {i18n.t('buttons.delete')}
                        </Button>
                      </TableCell>
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

export default withKeycloak(ManageSubscriptions);
