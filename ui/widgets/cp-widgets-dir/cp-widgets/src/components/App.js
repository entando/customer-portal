import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import AdminDashboard from './Admin/AdminDashboard';
import Subscription from './SubscriptionDetails/subscription';
import withKeycloak from '../auth/withKeycloak';
import { AuthenticatedView, UnauthenticatedView } from '../auth/KeycloakViews';
import { apiKeycloakToken, apiKeycloakUserGet } from '../api/keycloak';
import { hasKeycloakClientRole } from '../api/helpers';

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
        
        /*
        var role = ''
        if (keycloak.realmAccess) {
            for (var i = 0; i < keycloak.tokenParsed.roles.length; i++) {
              if (keycloak.tokenParsed.roles[i] == "ROLE_ADMIN") {
                role = 'Admin'
                break;
              }
              else if (keycloak.tokenParsed.roles[i] == "ROLE_SUPPORT") {
                role = 'Support'
              }
              else if (keycloak.tokenParsed.roles[i] == "ROLE_PARTNER") {
                role = 'Partner'
              }
              else if (keycloak.tokenParsed.roles[i] == "ROLE_CUSTOMER") {
                role = 'Customer'
              }
            }
        }
        */

        const role = hasKeycloakClientRole('ROLE_ADMIN');
        
        if (hasKeycloakClientRole('ROLE_ADMIN') || hasKeycloakClientRole('ROLE_SUPPORT') || hasKeycloakClientRole('ROLE_PARTNER') || hasKeycloakClientRole("ROLE_CUSTOMER")) {
            return (
                <div id="entando-customer-portal">
                    <AuthenticatedView keycloak={keycloak}>
                        <BrowserRouter>
                            <Switch>
                                <Route exact path="/" render={(props) => (
                                    <AdminDashboard {...props} serviceUrl={this.props.serviceUrl} role={role} keycloakUrl={this.props.keycloakUrl}/>
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
                <div id="entando-customer-portal">
                    <BrowserRouter>
                        <Switch>
                            <Route path="/subscription-details/:id" render={(props) => (
                                <Subscription {...props} serviceUrl={this.props.serviceUrl} />
                            )}/>
                        </Switch>
                    </BrowserRouter>
                </div>    
            )
        }
     }
  }
  
export default withKeycloak(App);