import React from 'react';
import ReactDOM from 'react-dom';
import Navigation from '../components/Navigation/Navigation';

class NavigationElement extends HTMLElement {
  connectedCallback() {
    this.mountPoint = document.createElement('div');
    this.appendChild(this.mountPoint);
    ReactDOM.render(<Navigation />, this.mountPoint);
  }
}

customElements.define('navigation-widget', NavigationElement);

export default NavigationElement;
