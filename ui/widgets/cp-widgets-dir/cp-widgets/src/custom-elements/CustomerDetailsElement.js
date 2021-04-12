import React from 'react';
import ReactDOM from 'react-dom';
import CustomerDetails from '../components/Customer/customerDetails';
import KeycloakContext from '../auth/KeycloakContext';
import './dashboard.css';

import { subscribeToWidgetEvent } from '../helpers/widgetEvents';
import { KEYCLOAK_EVENT_TYPE } from '../custom-elements/widgetEventTypes';

const getKeycloakInstance = () =>
  (window && window.entando && window.entando.keycloak && { ...window.entando.keycloak, initialized: true }) || {
    initialized: false,
  };

const ATTRIBUTES = {
  hidden: 'hidden',
  locale: 'locale',
  paginationMode: 'pagination-mode',
  disableDefaultEventHandler: 'disable-default-event-handler', // custom element attribute names MUST be written in kebab-case
  serviceUrl: 'service-url',
};

class CustomerDetailsElement extends HTMLElement {
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

    this.appendChild(this.mountPoint);
  }

  render() {
    const serviceUrl = this.getAttribute(ATTRIBUTES.serviceUrl) || '';

    ReactDOM.render(
      <KeycloakContext.Provider value={this.keycloak}>
        <CustomerDetails serviceUrl={serviceUrl} />
      </KeycloakContext.Provider>,
      this.mountPoint
    );
  }
}
customElements.define('customer-details-widget', CustomerDetailsElement);
