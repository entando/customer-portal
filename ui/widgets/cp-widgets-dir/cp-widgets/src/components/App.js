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
            loading: true
        }
    }

    componentDidMount() {
        const { t, keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;

        if (authenticated) {
            this.setState({
                loading: false
            })
        }
    }

    componentDidUpdate(prevProps) {
        const { t, keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;
      
        const changedAuth = prevProps.keycloak.authenticated !== authenticated;

        if (authenticated && changedAuth) {
            this.setState({
                loading: false
            })
        }
    }

    render() {
        var { t, keycloak } = this.props;
        var authenticated = keycloak.initialized && keycloak.authenticated;
        
        if (!this.state.loading) {
            if (hasKeycloakClientRole('ROLE_ADMIN') || hasKeycloakClientRole('ROLE_SUPPORT') || hasKeycloakClientRole('ROLE_PARTNER') || hasKeycloakClientRole("ROLE_CUSTOMER")) {
                return (
                    <div id="entando-customer-portal">
                        <AuthenticatedView keycloak={keycloak}>
                            <BrowserRouter>
                                <Switch>
                                    <Route path="**/subscription-details/:id" render={(props) => (
                                        <Subscription {...props} serviceUrl={this.props.serviceUrl} />
                                    )}/>
                                    <Route path="**/" render={(props) => (
                                        <AdminDashboard {...props} serviceUrl={this.props.serviceUrl} />
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
                return (<p>Unathorized</p>)
            }
        }
        else {
            return(null)
        }
     }
  }
  
export default withKeycloak(App);