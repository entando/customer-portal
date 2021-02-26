import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import OpenTicket from './Forms/openTicket';
import EnhancementRequest from './Forms/enhancementRequest';
import SubscriptionForm from './Forms/SubscriptionForm';
import RoleCheck from './Admin/RoleCheck';
import Navigation from './Navigation/Navigation';

class App extends Component {
    render() {
        return (
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
        )
     }
  }
  
export default App;