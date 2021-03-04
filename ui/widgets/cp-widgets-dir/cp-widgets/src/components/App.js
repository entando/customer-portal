import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import OpenTicket from './Forms/openTicket';
import EnhancementRequest from './Forms/enhancementRequest';
import SubscriptionForm from './Forms/SubscriptionForm';
import Subscription from './SubscriptionDetails/subscription';
import ManageUser from './Admin/ManageUser/ManageUser';
import AdminConfiguration from './Admin/Configuration/AdminConfiguration';
import RoleCheck from './Admin/RoleCheck';
import Navigation from './Navigation/Navigation';
import { AuthenticatedView, UnauthenticatedView } from '../auth/KeycloakViews';
import withKeycloak from '../auth/withKeycloak';

import keycloakType from '../components/__types__/keycloak';
import { apiProjectsGet } from '../api/projects';


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
            //console.log('Authenticated')
            const projects = await apiProjectsGet("http://localhost:8081/services/custportApp");
            this.setState({
                data: projects
            });
        }
        else {
            //console.log('Not authenticated')
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
        //console.log(keycloak)
        return (
            <div>  
                <UnauthenticatedView keycloak={keycloak}>
                    <p>User is not authenticated</p>
                </UnauthenticatedView>
                <AuthenticatedView keycloak={keycloak}>
                    <BrowserRouter>
                        <div id="dashboard-widget">
                            <Navigation/>
                            <div style={{marginTop: '100px'}}>
                                <Switch>
                                    <Route path="/" component={RoleCheck} exact />
                                    <Route path="/subscription-details" component={Subscription}/>
                                    <Route path="/subscription" component={SubscriptionForm}/>
                                    <Route path="/service-ticket" component={OpenTicket} />
                                    <Route path="/enhancement" component={EnhancementRequest} />
                                    <Route path="/manage-users" component={ManageUser} />
                                    <Route path="/configuration-settings" component={AdminConfiguration} />
                                </Switch>
                            </div>
                        </div>
                    </BrowserRouter>
                </AuthenticatedView>
                
            </div>
        )
        
     }
  }

  App.propTypes = {
    keycloak: keycloakType.isRequired
}
  
export default withKeycloak(App);