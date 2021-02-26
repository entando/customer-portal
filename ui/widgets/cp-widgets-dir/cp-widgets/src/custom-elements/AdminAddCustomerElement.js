import React from 'react';
import ReactDOM from 'react-dom';
import AddCustomerModal from '../components/Admin/AddCustomerModal';

class AdminAddCustomerElement extends HTMLElement {
  connectedCallback() {
    this.mountPoint = document.createElement('div');
    this.appendChild(this.mountPoint);
    ReactDOM.render(<AddCustomerModal />, this.mountPoint);
  }
}

customElements.define('admin-add-customer-widget', AdminAddCustomerElement);

export default AdminAddCustomerElement;
