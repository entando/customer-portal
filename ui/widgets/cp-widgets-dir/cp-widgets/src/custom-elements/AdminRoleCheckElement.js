import React from 'react';
import ReactDOM from 'react-dom';
import RoleCheck from '../components/Admin/RoleCheck';

class AdminRoleCheckElement extends HTMLElement {
  connectedCallback() {
    this.mountPoint = document.createElement('div');
    this.appendChild(this.mountPoint);
    ReactDOM.render(<RoleCheck />, this.mountPoint);
  }
}

customElements.define('admin-rolecheck-widget', AdminRoleCheckElement);

export default AdminRoleCheckElement;
