import React from 'react';
import ReactDOM from 'react-dom';
import EnhancementRequest from '../components/Forms/enhancementRequest';

class FormsEnhancementRequestElement extends HTMLElement {
  connectedCallback() {
    this.mountPoint = document.createElement('div');
    this.appendChild(this.mountPoint);
    ReactDOM.render(<EnhancementRequest />, this.mountPoint);
  }
}

customElements.define('forms-enhancement-request-widget', FormsEnhancementRequestElement);

export default FormsEnhancementRequestElement;
