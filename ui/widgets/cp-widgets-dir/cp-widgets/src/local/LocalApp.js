import React, {Component} from 'react';
import {BrowserRouter, Route, Switch, Link} from 'react-router-dom';
import App from '../components/App';
import withKeycloak from '../auth/withKeycloak';
import SubscriptionForm from "../components/Forms/SubscriptionForm";
import AdminConfiguration from "../components/Admin/Configuration/AdminConfiguration";
import OpenTicket from "../components/Forms/openTicket";
import ManageUser from "../components/Admin/ManageUser/ManageUser";
import ManageSubscriptions from "../components/Admin/ManageSubscriptions/ManageSubscriptions";

class LocalApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    const {keycloak} = this.props;
    const authenticated = keycloak.initialized && keycloak.authenticated;

    if (authenticated) {
      this.setState({
        loading: false,
      });
    }
  }

  componentDidUpdate(prevProps) {
    const {keycloak} = this.props;
    const authenticated = keycloak.initialized && keycloak.authenticated;

    const changedAuth = prevProps.keycloak.authenticated !== authenticated;

    if (authenticated && changedAuth) {
      this.setState({
        loading: false,
      });
    }
  }

  render() {
    if (!this.state.loading) {
      return (
        <div>
          <BrowserRouter>
            {/*Simple Menu for switching to page-based elements*/}
            <div>
              <ul>
                <li><Link to={'/'}>Home</Link></li>
                {/*TODO: rework the entando-de-app-based paths so the application name and locale are more general*/}
                <li><Link to={'/entando-de-app/en/admin.page'}>Admin</Link></li>
              </ul>
            </div>
            <Switch>
              <Route path="/entando-de-app/en/admin.page">
                <AdminConfiguration serviceUrl={this.props.serviceUrl} locale={this.props.locale}/>
              </Route>
              <Route path="/entando-de-app/en/manage_subscriptions.page">
                <ManageSubscriptions serviceUrl={this.props.serviceUrl} locale={this.props.locale}/>
              </Route>
              <Route path="/entando-de-app/en/manage_users.page">
                <ManageUser serviceUrl={this.props.serviceUrl} locale={this.props.locale}/>
              </Route>
              <Route path="/entando-de-app/en/new_or_renew_subscription.page.page">
                <SubscriptionForm serviceUrl={this.props.serviceUrl} locale={this.props.locale}/>
              </Route>
              <Route path="/entando-de-app/en/open_service_ticket.page">
                <OpenTicket serviceUrl={this.props.serviceUrl} locale={this.props.locale}/>
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
