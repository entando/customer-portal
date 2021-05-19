import React from 'react';
import Subscription from '../SubscriptionDetails/Subscription';
import {Route, Switch} from 'react-router-dom';

const Routes = props => {
  return (
    <Switch>
      <Route path="/project-details/:id" component={Subscription} />
    </Switch>
  );
};

export default Routes;
