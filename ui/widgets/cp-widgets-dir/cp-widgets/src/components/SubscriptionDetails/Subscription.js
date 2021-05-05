import React from 'react';
import TicketList from './TicketList';
import {Tile} from 'carbon-components-react';
import {apiSubscriptionGet, formatStartDate, formatEndDate} from '../../api/subscriptions';
import withKeycloak from '../../auth/withKeycloak';
import {apiGetProjectUsers, apiProjectGet} from '../../api/projects';
import {
  isPortalAdminOrSupport,
  isPortalUser,
  isPortalAdmin,
  authenticationChanged,
} from '../../api/helpers';
import EditSubscriptionModal from '../Admin/EditSubscriptionModal';
import i18n from '../../i18n';

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
          return (
            <div className="subscription-details">
              <div>
                <Tile>
                  <div className="bx--grid">
                    <div className="bx--row">
                      <div className="bx--col">
                        <div>
                          <strong>{i18n.t('customerDashboard.customerName')}:</strong> {this.state.project.data.customer.name}
                        </div>
                        <div>
                          <strong>{i18n.t('customerDashboard.projectName')}:</strong> {this.state.project.data.name}
                        </div>
                        <div>
                          <strong>{i18n.t('subscriptionDetails.description')}:</strong> {this.state.subscription.data.project.description}
                        </div>
                        <div>
                          <strong>{i18n.t('subscriptionDetails.partners')}:</strong>
                          {this.state.project.data !== '' && Object.keys(this.state.project.data.partners).length !== 0 ? (
                            <>
                              {this.state.project.data.partners.map((partner, index) => (
                                <div
                                  key={index}> {index === this.state.project.data.partners.length - 1 ? partner.name : partner.name + ', '} </div>
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
                            <strong>{i18n.t('subscriptionDetails.notes')}:</strong> {this.state.subscription.data.notes}
                          </div>
                        ) : null}
                      </div>
                      <div className="bx--col">
                        <div>
                          <strong>{i18n.t('subscriptionDetails.status')}:</strong> {this.state.subscription.data.status}
                        </div>
                        <div>
                          <strong>{i18n.t('subscriptionDetails.level')}:</strong> {this.state.subscription.data.level}
                        </div>
                        <div>
                          <strong>{i18n.t('subscriptionDetails.startDate')}:</strong>{' '}
                          {formatStartDate(this.state.subscription.data.startDate)}
                        </div>
                        <div>
                          <strong>{i18n.t('subscriptionDetails.endDate')}:</strong>{' '}
                          {formatEndDate(this.state.subscription.data.startDate, this.state.subscription.data.lengthInMonths)}
                        </div>
                        <div>
                          <strong>{i18n.t('subscriptionDetails.license')}:</strong> {license}
                        </div>
                        <div>
                          <strong>{i18n.t('subscriptionDetails.assignedUsers')}:</strong>
                          {this.state.project.data !== '' && Object.keys(this.state.users.data).length !== 0 ? (
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
                  {isPortalAdmin() ? (
                    <EditSubscriptionModal
                      project={this.state.project.data}
                      subscription={this.state.subscription.data}
                      serviceUrl={this.props.serviceUrl}
                      updateSubscription={this.updateSubscription}
                    />
                  ) : null}
                </Tile>
                <br />
                <TicketList projectId={this.state.project.data.id} serviceUrl={this.props.serviceUrl} />
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
