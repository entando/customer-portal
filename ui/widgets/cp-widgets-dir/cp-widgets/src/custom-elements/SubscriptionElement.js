import React from 'react';
import ReactDOM from 'react-dom';
import Subscription from '../components/SubscriptionDetails/subscription';

class SubscriptionElement extends HTMLElement {
  connectedCallback() {
    this.mountPoint = document.createElement('div');
    this.appendChild(this.mountPoint);
    ReactDOM.render(<Subscription />, this.mountPoint);
  }
}

customElements.define('subscription-widget', SubscriptionElement);

export default SubscriptionElement;
