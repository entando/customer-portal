import React from 'react';
import ReactDOM from 'react-dom';
import DashboardView from '../components/DashboardView';

class CustomerWidgetElement extends HTMLElement {
  connectedCallback() {
    this.mountPoint = document.createElement('div');
    this.appendChild(this.mountPoint);
    ReactDOM.render(<DashboardView />, this.mountPoint);
  }
}

customElements.define('customer-dashboard-widget', CustomerWidgetElement);

export default CustomerWidgetElement;
