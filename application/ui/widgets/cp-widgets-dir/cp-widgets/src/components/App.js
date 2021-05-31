import React, {Component} from 'react';
import {HashRouter, Route, Switch} from 'react-router-dom';
import AdminDashboard from './Admin/AdminDashboard';
import Subscription from './SubscriptionDetails/Subscription';
import withKeycloak from '../auth/withKeycloak';
import {AuthenticatedView, UnauthenticatedView} from '../auth/KeycloakViews';
import {authenticationChanged, isAuthenticated, isPortalUser} from '../api/helpers';
import CustomerProjectList from './Customer/CustomerProjectList';
import i18n from '../i18n';
import ManageSubscriptions from './Admin/ManageSubscriptions/ManageSubscriptions';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    if (isAuthenticated(this.props)) {
      this.setState({
        loading: false,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (authenticationChanged(this.props, prevProps)) {
      this.setState({
        loading: false,
      });
    }
  }

  render() {
    var { keycloak } = this.props;

    if (!this.state.loading) {
      if (isPortalUser()) {
        return (
          <div id="entando-customer-portal">
            <AuthenticatedView keycloak={keycloak}>
              <HashRouter>
                <Switch>
                  <Route
                    path={'**/customer-details/:id'}
                    render={props => <CustomerProjectList {...props} serviceUrl={this.props.serviceUrl}
                                                          locale={this.props.locale}/>}
                  />
                  <Route
                    path={'**/manage-subscriptions/:id'}
                    render={props => <ManageSubscriptions {...props} serviceUrl={this.props.serviceUrl}
                                                          locale={this.props.locale}/>}
                  />
                  <Route
                    path={'**/subscription-details/:id'}
                    render={props => <Subscription {...props} serviceUrl={this.props.serviceUrl}
                                                   locale={this.props.locale}/>}
                  />
                  <Route
                    path="**/"
                    render={props => <AdminDashboard {...props} serviceUrl={this.props.serviceUrl}
                                                     locale={this.props.locale}/>}
                  />
                </Switch>
              </HashRouter>
            </AuthenticatedView>
            <UnauthenticatedView keycloak={keycloak}>
              <p>{i18n.t('userMessages.unauthorized')}</p>
            </UnauthenticatedView>
          </div>
        );
      } else {
        return <p>{i18n.t('userMessages.unauthorized')}</p>;
      }
    } else {
      return null;
    }
  }
}

export default withKeycloak(App);
