import React from 'react';
import TicketList from './TicketList';
import {Tile} from 'carbon-components-react';
import {apiSubscriptionGet, formatStartDate, formatEndDate} from '../../api/subscriptions';
import withKeycloak from '../../auth/withKeycloak';
import {apiGetProjectUsers, apiProjectGet} from '../../api/projects';
import {isPortalAdminOrSupport, isPortalUser, authenticationChanged} from '../../api/helpers';
import i18n from '../../i18n';
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";

const subscriptionData = {
  type: 'Product Support Subscription Entando Platform',
  license: 'Free Commercial Open Source',
};

class Subscription extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      subscription: {},
      users: {},
      project: {},
      customer: {},
    };
  }

  async fetchData() {
    if (isPortalUser()) {
      try {
        let users = {};
        let project = {};
        const subscription = await apiSubscriptionGet(this.props.serviceUrl, this.props.match.params.id);
        if (subscription.data.project) {
          project = await apiProjectGet(this.props.serviceUrl, subscription.data.project.id);
          users = await apiGetProjectUsers(this.props.serviceUrl, project.data.id);
        }
        this.setState({
          subscription: subscription,
          project: project,
          customer: project.customer,
          users: users,
          loading: false,
        });
      } catch (err) {
        console.log(err);
      }
    }
  }

  updateSubscription = () => {
    this.fetchData();
  };

  componentDidMount() {
    if (isPortalUser()) {
      this.fetchData();
    }
  }

  componentDidUpdate(prevProps) {
    if (authenticationChanged(this.props, prevProps) && isPortalUser()) {
      this.fetchData();
    }
  }

  render() {
    const { type, license } = subscriptionData;

    if (!this.state.loading) {
      if (isPortalUser()) {
        if (Object.keys(this.state.subscription).length !== 0 && Object.keys(this.state.project).length !== 0) {
          const project = this.state.project.data;
          const subscription = this.state.subscription.data;
          return (
            <div className="subscription-details">
              <div>
                <Breadcrumbs project={project} subscription={subscription} locale={this.props.locale}/>
                <Tile>
                  <div className="bx--grid">
                    <div className="bx--row">
                      <div className="bx--col">
                        <div>
                          <strong>{i18n.t('customerDashboard.customerName')}:</strong> {project.customer.name}
                        </div>
                        <div>
                          <strong>{i18n.t('customerDashboard.projectName')}:</strong> {project.name}
                        </div>
                        <div>
                          <strong>{i18n.t('subscriptionDetails.description')}:</strong> {subscription.project.description}
                        </div>
                        <div>
                          <strong>{i18n.t('subscriptionDetails.partners')}:</strong>
                          {project !== '' && Object.keys(project.partners).length !== 0 ? (
                            <>
                              {project.partners.map((partner, index) => (
                                <div key={index}>
                                  {' '}
                                  {index === project.partners.length - 1 ? partner.name : partner.name + ', '}{' '}
                                </div>
                              ))}
                            </>
                          ) : (
                            <> {i18n.t('userMessages.none')} </>
                          )}
                        </div>
                        <div>
                          <strong>{i18n.t('subscriptionDetails.type')}:</strong> {type}
                        </div>
                        {isPortalAdminOrSupport() ? (
                          <div>
                            <strong>{i18n.t('subscriptionDetails.notes')}:</strong> {subscription.notes}
                          </div>
                        ) : null}
                      </div>
                      <div className="bx--col">
                        <div>
                          <strong>{i18n.t('subscriptionDetails.status')}:</strong> {subscription.status}
                        </div>
                        <div>
                          <strong>{i18n.t('subscriptionDetails.level')}:</strong> {subscription.level}
                        </div>
                        <div>
                          <strong>{i18n.t('subscriptionDetails.startDate')}:</strong>{' '}
                          {formatStartDate(subscription.startDate)}
                        </div>
                        <div>
                          <strong>{i18n.t('subscriptionDetails.endDate')}:</strong>{' '}
                          {formatEndDate(subscription.startDate, subscription.lengthInMonths)}
                        </div>
                        <div>
                          <strong>{i18n.t('subscriptionDetails.license')}:</strong> {license}
                        </div>
                        <div>
                          <strong>{i18n.t('subscriptionDetails.assignedUsers')}:</strong>
                          {this.state.users.data !== '' && Object.keys(this.state.users.data).length !== 0 ? (
                            <>
                              {this.state.users.data.map((user, index) => (
                                <div
                                  key={index}> {index === this.state.users.data.length - 1 ? user.username : user.username + ', '} </div>
                              ))}
                            </>
                          ) : (
                            <> {i18n.t('userMessages.none')} </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Tile>
                <br/>
                <TicketList projectId={project.id} serviceUrl={this.props.serviceUrl} locale={this.props.locale}/>
              </div>
            </div>
          );
        } else {
          return <div>{i18n.t('userMessages.unauthorized')}</div>;
        }
      } else {
        return <div>{i18n.t('userMessages.unauthorized')}</div>;
      }
    } else {
      return null;
    }
  }
}

export default withKeycloak(Subscription);
