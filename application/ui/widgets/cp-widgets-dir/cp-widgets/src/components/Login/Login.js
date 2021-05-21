import React, {Component} from 'react';
import {getPageUrl, isAuthenticated, isPortalUser} from "../../api/helpers";
import i18n from "../../i18n";
import withKeycloak from "../../auth/withKeycloak";
import {PAGE_CUSTOMER_PORTAL} from '../../api/constants';

const KEYCLOAK_EVENT_ID = 'keycloak';

class Login extends Component {

  constructor(props) {
    super(props)
    this.state = {
      username: null
    };
    this.keycloakEventHandler = this.keycloakEventHandler.bind(this);
  }

  keycloakEventHandler(event) {
    const keycloakEvent = event.detail.eventType;
    const {keycloak} = this.props;
    switch (keycloakEvent) {
      case 'onAuthRefreshError':
        keycloak.logout();
        break;
      default:
        break;
    }
  }

  componentDidMount() {
    window.addEventListener(KEYCLOAK_EVENT_ID, this.keycloakEventHandler);
  }

  componentWillUnmount() {
    window.removeEventListener(KEYCLOAK_EVENT_ID, this.keycloakEventHandler);
  }

  render() {
    const {keycloak} = this.props;
    const loginUrl = window.location;
    const handleLogin = () => keycloak.login({redirectUri: loginUrl});
    const handleLogout = () => keycloak.logout({redirectUri: window.location.origin});

    return (
      <span className="entando-login">
        {!isAuthenticated(this.props) ? (
          <>
            <a className="log-in" href="#entando-customer-portal" onClick={handleLogin}
               title={i18n.t('userMessages.login')}>
              {i18n.t('userMessages.login')}<i className="fas fa-sign-in-alt"/>
            </a>
          </>
        ) : (
          <>
            {isPortalUser() && (
              <>
                <a
                  href={getPageUrl(PAGE_CUSTOMER_PORTAL, this.props.locale)}>{i18n.t('customerDashboard.customerPortal')}</a>
                <span className="divider">&nbsp;|&nbsp;</span>
              </>
            )}
            <a className="log-out" href="#entando-customer-portal" onClick={handleLogout}
               title={i18n.t('userMessages.logout')}>
              {i18n.t('userMessages.logout')}<i className="fas fa-sign-out-alt"/>
            </a>
          </>
        )}
      </span>
    )
  }
}

export default withKeycloak(Login);
