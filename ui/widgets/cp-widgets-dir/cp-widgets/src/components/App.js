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
import Subscription from './SubscriptionDetails/Subscription';

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" render={(props) => (
                        <AdminDashboard {...props} serviceUrl={this.props.serviceUrl} />
                    )}/>
                    <Route path="/project-details/:id" render={(props) => (
                        <Subscription {...props} serviceUrl={this.props.serviceUrl} />
                    )}/>
                </Switch>
            </BrowserRouter>
        )
     }
  }
  
export default App;