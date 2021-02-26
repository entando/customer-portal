import React from 'react';
import { NavLink } from 'react-router-dom';
 
const Navigation = () => {
    return (
       <ul id='navigation'>
          <li><NavLink to="/">Home</NavLink></li>
          <li><NavLink to="/subscription">New or Renew Subscription</NavLink></li>
          <li><NavLink to="/service-ticket">Open Service Ticket</NavLink></li>
          <li><NavLink to="/enhancement">Request for Enhancement Process</NavLink></li>
       </ul>
    );
}
 
export default Navigation;