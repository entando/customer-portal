import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './components/App';

import './custom-elements/AdminDashboardElement';
import './custom-elements/AdminAddCustomerElement';
import './custom-elements/AdminRoleCheckElement';
import './custom-elements/CustomDataTableElement';
import './custom-elements/CustomerDetailsElement';
import './custom-elements/SubscriptionElement';
import './custom-elements/FormsSubscriptionElement';
import './custom-elements/FormsOpenTicketElement';
import './custom-elements/NavigationElement';
import './custom-elements/FormsEnhancementRequestElement';

ReactDOM.render(<App/>, document.getElementById('root'));