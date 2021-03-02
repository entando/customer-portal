import React from 'react';
import ReactDOM from 'react-dom';
import retargetEvents from 'react-shadow-dom-retarget-events';

import KeycloakContext from '../auth/KeycloakContext';
import App from '../components/App';

import {
  subscribeToWidgetEvent
} from '../helpers/widgetEvents';
import {
  KEYCLOAK_EVENT_TYPE,
} from '../custom-elements/widgetEventTypes';

const getKeycloakInstance = () =>
  (window &&
    window.entando &&
    window.entando.keycloak && { ...window.entando.keycloak, initialized: true }) || {
    initialized: false,
  };


class AppElement extends HTMLElement {
  container;

  mountPoint;


  unsubscribeFromKeycloakEvent;


  keycloak = getKeycloakInstance();

  connectedCallback() {
    this.mountPoint = document.createElement('div');
    this.keycloak = { ...getKeycloakInstance(), initialized: true };

    
    this.unsubscribeFromKeycloakEvent = subscribeToWidgetEvent(KEYCLOAK_EVENT_TYPE, () => {
      this.keycloak = { ...getKeycloakInstance(), initialized: true };
      this.render();
    });

    this.render();

    //retargetEvents(shadowRoot);
    this.appendChild(this.mountPoint);
  }

  render() {
    ReactDOM.render(
      <KeycloakContext.Provider value={this.keycloak}>
        <App />
      </KeycloakContext.Provider>,
      this.mountPoint
    );
  }
}

customElements.define('app-element', AppElement);