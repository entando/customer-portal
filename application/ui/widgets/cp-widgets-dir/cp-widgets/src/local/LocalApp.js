import React, {Component} from 'react';
import {BrowserRouter, Route, Switch, Link} from 'react-router-dom';
import App from '../components/App';
import withKeycloak from '../auth/withKeycloak';
import AdminConfiguration from '../components/Admin/Configuration/AdminConfiguration';
import ManageUsers from '../components/Admin/ManageUsers/ManageUsers';
import {authenticationChanged, getPageUrl, isAuthenticated, isPortalAdmin} from '../api/helpers';
import {
  PAGE_ADMIN_CONFIG,
  PAGE_CUSTOMER_PORTAL,
  PAGE_MANAGE_USERS,
} from "../api/constants";
import Login from "../components/Login/Login";

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

  render() {
    const {locale, serviceUrl} = this.props;
    if (!this.state.loading) {
      return (
        <div>
          <BrowserRouter forceRefresh={true}>
            <Login locale={locale}/>
            <div>
              <ul>
                {isPortalAdmin() && (
                  <li>
                    <Link to={getPageUrl(PAGE_ADMIN_CONFIG, locale)}>Admin</Link>
                  </li>
                )}
              </ul>
            </div>
            <Switch>
              <Route path={getPageUrl(PAGE_ADMIN_CONFIG, locale)}>
                <AdminConfiguration serviceUrl={serviceUrl} locale={locale}/>
              </Route>
              <Route path={getPageUrl(PAGE_MANAGE_USERS, locale)}>
                <ManageUsers serviceUrl={serviceUrl} locale={locale}/>
              </Route>
              <Route path={getPageUrl(PAGE_CUSTOMER_PORTAL, locale)}>
                <App serviceUrl={serviceUrl} locale={locale}/>
              </Route>
              <Route path="/" exact={true}>
                <App serviceUrl={serviceUrl} locale={locale}/>
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
