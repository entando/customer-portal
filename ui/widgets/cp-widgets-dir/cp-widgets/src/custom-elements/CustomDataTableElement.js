import React from 'react';
import ReactDOM from 'react-dom';
import CustomDataTable from '../components/Customer/customDataTable';

class CustomDataTableElement extends HTMLElement {
  connectedCallback() {
    this.mountPoint = document.createElement('div');
    this.appendChild(this.mountPoint);
    ReactDOM.render(<CustomDataTable />, this.mountPoint);
  }
}

customElements.define('custom-datatable-widget', CustomDataTableElement);

export default CustomDataTableElement;
