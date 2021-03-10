import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import OpenTicket from './Forms/openTicket';
import EnhancementRequest from './Forms/enhancementRequest';
import SubscriptionForm from './Forms/SubscriptionForm';
import RoleCheck from './Admin/RoleCheck';
import ManageUser from './Admin/ManageUser/ManageUser';
import Navigation from './Navigation/Navigation';
import AdminConfiguration from './Admin/Configuration/AdminConfiguration';
import Routes from './Customer/Routes';
import AdminDashboard from './Admin/AdminDashboard';
import Subscription from './SubscriptionDetails/subscription';
import withKeycloak from '../auth/withKeycloak';
import { AuthenticatedView, UnauthenticatedView } from '../auth/KeycloakViews';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            role: 'admin'
        }
    }

    componentDidMount() {
        const { t, keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;
    }

    componentDidUpdate(prevProps) {
        const { t, keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;
      
        const changedAuth = prevProps.keycloak.authenticated !== authenticated;
    }

    render() {
        var { t, keycloak } = this.props;
        var authenticated = keycloak.initialized && keycloak.authenticated;
        var role = ''
        if (keycloak.realmAccess) {
            for (var i = 0; i < keycloak.tokenParsed.roles.length; i++) {
              if (keycloak.tokenParsed.roles[i] == "ROLE_ADMIN") {
                role = 'admin'
                break;
              }
              else if (keycloak.tokenParsed.roles[i] == "ROLE_SUPPORT") {
                role = 'support'
              }
              else if (keycloak.tokenParsed.roles[i] == "ROLE_PARTNER") {
                role = 'partner'
              }
              else if (keycloak.tokenParsed.roles[i] == "ROLE_CUSTOMER") {
                role = 'customer'
              }
            }
        }
        
        if (role === 'admin' || role === 'support' || role === 'partner') {
            return (
                <div>
                    <AuthenticatedView keycloak={keycloak}>
                        <BrowserRouter>
                            <Switch>
                                <Route exact path="/" render={(props) => (
                                    <AdminDashboard {...props} serviceUrl={this.props.serviceUrl} />
                                )}/>
                                <Route path="/subscription-details/:id" render={(props) => (
                                    <Subscription {...props} serviceUrl={this.props.serviceUrl} />
                                )}/>
                            </Switch>
                        </BrowserRouter>
                    </AuthenticatedView>
                    <UnauthenticatedView keycloak={keycloak}>
                        <p>Unauthenticated</p>
                    </UnauthenticatedView>
                </div>
            )
        }
        else {
            return (
                <BrowserRouter>
                    <Switch>
                        <Route path="/subscription-details/:id" render={(props) => (
                            <Subscription {...props} serviceUrl={this.props.serviceUrl} />
                        )}/>
                    </Switch>
                </BrowserRouter>
            )
        }
     }
  }
  
export default withKeycloak(App);