import React from 'react';
import ReactDOM from 'react-dom';
import CustomerDetails from '../components/Customer/customerDetails';

class CustomerDetailsElement extends HTMLElement {
  connectedCallback() {
    this.mountPoint = document.createElement('div');
    this.appendChild(this.mountPoint);
    ReactDOM.render(<CustomerDetails />, this.mountPoint);
  }
}

customElements.define('customer-details-widget', CustomerDetailsElement);

export default CustomerDetailsElement;
