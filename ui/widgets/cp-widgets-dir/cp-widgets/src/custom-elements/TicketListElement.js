import React from 'react';
import ReactDOM from 'react-dom';
import TicketList from '../components/SubscriptionDetails/TicketList';
import '../index.scss'

import KeycloakContext from '../auth/KeycloakContext';

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

const ATTRIBUTES = {
  hidden: 'hidden',
  locale: 'locale',
  paginationMode: 'pagination-mode',
  disableDefaultEventHandler: 'disable-default-event-handler', // custom element attribute names MUST be written in kebab-case
  serviceUrl: 'service-url',
};

class TicketListCustomerElement extends HTMLElement {
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
    const serviceUrl = this.getAttribute(ATTRIBUTES.serviceUrl) || '';

    ReactDOM.render(
      <KeycloakContext.Provider value={this.keycloak}>
        <TicketList serviceUrl={serviceUrl}/>
      </KeycloakContext.Provider>,
      this.mountPoint
    );
  }
}

customElements.define('ticket-list-widget', TicketListCustomerElement);
