import React, {Component} from 'react';
import {BrowserRouter, Route, Switch, Link} from 'react-router-dom';
import App from '../components/App';
import withKeycloak from '../auth/withKeycloak';
import SubscriptionForm from '../components/Forms/SubscriptionForm';
import AdminConfiguration from '../components/Admin/Configuration/AdminConfiguration';
import OpenTicketForm from '../components/Forms/OpenTicketForm';
import ManageUser from '../components/Admin/ManageUser/ManageUser';
import ManageSubscriptions from '../components/Admin/ManageSubscriptions/ManageSubscriptions';
import {authenticationChanged, getPageUrl, isAuthenticated, isPortalAdmin} from '../api/helpers';
import {
  PAGE_ADMIN_CONFIG, PAGE_CUSTOMER_PORTAL, PAGE_MANAGE_SUBSCRIPTIONS,
  PAGE_MANAGE_USERS,
  PAGE_SUBSCRIPTION_FORM,
  PAGE_TICKET_FORM
} from "../api/constants";

class LocalApp extends Component {
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

  async logout() {
    await window.entando.keycloak.logout();
  }

  render() {
    if (!this.state.loading) {
      return (
        <div>
          <BrowserRouter forceRefresh={true}>
            {/*Simple Menu for switching to page-based elements*/}
            <div>
              <ul>
                <li>
                  <Link to='/'>Home</Link>
                </li>
                {isPortalAdmin() && (
                  <li>
                    <Link to={getPageUrl(PAGE_ADMIN_CONFIG, this.props.locale)}>Admin</Link>
                  </li>
                )}
                <li>
                  <a href="/" onClick={this.logout}>
                    Logout
                  </a>
                </li>
              </ul>
            </div>
            <Switch>
              <Route path={getPageUrl(PAGE_ADMIN_CONFIG, this.props.locale)}>
                <AdminConfiguration serviceUrl={this.props.serviceUrl} locale={this.props.locale}/>
              </Route>
              <Route path={getPageUrl(PAGE_MANAGE_SUBSCRIPTIONS, this.props.locale)}>
                <ManageSubscriptions serviceUrl={this.props.serviceUrl} locale={this.props.locale}/>
              </Route>
              <Route path={getPageUrl(PAGE_MANAGE_USERS, this.props.locale)}>
                <ManageUser serviceUrl={this.props.serviceUrl} locale={this.props.locale}/>
              </Route>
              <Route path={getPageUrl(PAGE_SUBSCRIPTION_FORM, this.props.locale)}>
                <SubscriptionForm serviceUrl={this.props.serviceUrl} locale={this.props.locale}/>
              </Route>
              <Route path={getPageUrl(PAGE_TICKET_FORM, this.props.locale)}>
                <OpenTicketForm serviceUrl={this.props.serviceUrl} locale={this.props.locale}/>
              </Route>
              <Route path={getPageUrl(PAGE_CUSTOMER_PORTAL, this.props.locale)}>
                <App serviceUrl={this.props.serviceUrl} locale={this.props.locale}/>
              </Route>
              <Route path="/" exact={true}>
                <App serviceUrl={this.props.serviceUrl} locale={this.props.locale}/>
              </Route>
            </Switch>
          </BrowserRouter>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default withKeycloak(LocalApp);
