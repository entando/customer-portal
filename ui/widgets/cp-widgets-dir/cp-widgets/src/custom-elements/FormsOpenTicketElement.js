import React from 'react';
import ReactDOM from 'react-dom';
import OpenTicket from '../components/Forms/openTicket';

class FormsOpenTicketElement extends HTMLElement {
  connectedCallback() {
    this.mountPoint = document.createElement('div');
    this.appendChild(this.mountPoint);
    ReactDOM.render(<OpenTicket />, this.mountPoint);
  }
}

customElements.define('forms-openticket-widget', FormsOpenTicketElement);

export default FormsOpenTicketElement;
