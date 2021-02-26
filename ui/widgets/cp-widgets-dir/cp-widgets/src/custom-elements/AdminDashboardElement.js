import React from 'react';
import ReactDOM from 'react-dom';
import AdminDashboard from '../components/Admin/AdminDashboard';

class AdminDashboardElement extends HTMLElement {
  connectedCallback() {
    this.mountPoint = document.createElement('div');
    this.appendChild(this.mountPoint);
    ReactDOM.render(<AdminDashboard />, this.mountPoint);
  }
}

customElements.define('admin-dashboard-widget', AdminDashboardElement);

export default AdminDashboardElement;
