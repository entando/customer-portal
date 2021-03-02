import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import OpenTicket from './Forms/openTicket';
import EnhancementRequest from './Forms/enhancementRequest';
import SubscriptionForm from './Forms/SubscriptionForm';
import RoleCheck from './Admin/RoleCheck';
import Navigation from './Navigation/Navigation';
import { AuthenticatedView, UnauthenticatedView } from '../auth/KeycloakViews';
import withKeycloak from '../auth/withKeycloak';

import keycloakType from '../components/__types__/keycloak';
import { apiCustomersGet } from '../api/tickets';


class App extends Component {
    constructor() {
        super();
        this.state = {
            data: {}
        }
    }

    async fetchData() {
        const { t, keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;
        if (authenticated) {
            console.log('Authenticated')
            const tickets = await apiCustomersGet("http://localhost:8081/services/custportApp");
            this.setState({
                data: tickets
            });
        }
        else {
            console.log('Not authenticated')
        }
        this.render();
    }

    componentDidMount(){
        this.fetchData();
    }

    componentDidUpdate(prevProps) {
        const { keycloak } = this.props;
        const authenticated = keycloak.initialized && keycloak.authenticated;
    
        const changedAuth = prevProps.keycloak.authenticated !== authenticated;
    
        if (authenticated && changedAuth) {
          this.fetchData();
        }
      }

    render() {
        const { t, keycloak } = this.props;
        return (
            <div>  
                <UnauthenticatedView keycloak={keycloak}>
                    <p>User is not authenticated</p>
                </UnauthenticatedView>
                <AuthenticatedView keycloak={keycloak}>
                    <BrowserRouter>
                        <div id="dashboard-widget">
                            <Navigation/>
                            <Switch>
                                <Route path="/" component={RoleCheck} exact/>
                                <Route path="/subscription" component={SubscriptionForm}/>
                                <Route path="/service-ticket" component={OpenTicket} />
                                <Route path="/enhancement" component={EnhancementRequest}/>
                            </Switch>
                        </div>
                    </BrowserRouter>
                    <p>Tickets:</p>
                    <p>{JSON.stringify(this.state.data)}</p>
                </AuthenticatedView>
                
            </div>
        )
        
     }
  }

  App.propTypes = {
    keycloak: keycloakType.isRequired
}
  
export default withKeycloak(App);