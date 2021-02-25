import React from 'react';
import ReactDOM from 'react-dom';
import SubscriptionForm from '../components/Forms/SubscriptionForm';

class FormsSubscriptionElement extends HTMLElement {
  connectedCallback() {
    this.mountPoint = document.createElement('div');
    this.appendChild(this.mountPoint);
    ReactDOM.render(<SubscriptionForm />, this.mountPoint);
  }
}

customElements.define('subscription-form-widget', FormsSubscriptionElement);

export default FormsSubscriptionElement;
