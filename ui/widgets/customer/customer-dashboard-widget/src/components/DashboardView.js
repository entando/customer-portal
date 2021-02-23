import React, { Component } from 'react';
import CustomerDetails from './customerDetails';
import CustomTable from './customDataTable';

import OpenTicket from './Forms/openTicket';
import Subscription from './SubscriptionDetails/subscription';

class DashboardView extends Component {
  render() {
    return (
      <div id="dashboard-widget">
        <h3>Welcome to Entando Customer Portal</h3>
        <CustomerDetails />
        <CustomTable />

        {/* <OpenTicket />  
                 <Subscription/> */}
      </div>
    );
  }
}

export default DashboardView;
