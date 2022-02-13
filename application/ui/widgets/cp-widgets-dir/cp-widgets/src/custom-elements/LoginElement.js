import React from 'react';
import ReactDOM from 'react-dom';
import '../index.scss';

import KeycloakContext from '../auth/KeycloakContext';

import {subscribeToWidgetEvent} from '../helpers/widgetEvents';
import {KEYCLOAK_EVENT_TYPE} from './widgetEventTypes';
import * as Locale from '../i18n';
import Login from '../components/Login/Login';
import {setAppContext} from '../api/helpers';

const getKeycloakInstance = () =>
  (window && window.entando && window.entando.keycloak && {...window.entando.keycloak, initialized: true}) || {
    initialized: false,
  };

const ATTRIBUTES = {
  hidden: 'hidden',
  locale: 'locale',
  paginationMode: 'pagination-mode',
  disableDefaultEventHandler: 'disable-default-event-handler', // custom element attribute names MUST be written in kebab-case
  serviceUrl: 'service-url',
  baseUrl: 'base-url',
};

class LoginElement extends HTMLElement {
  container;

  mountPoint;

  unsubscribeFromKeycloakEvent;

  keycloak = getKeycloakInstance();

  connectedCallback() {
    this.mountPoint = document.createElement('span');
    this.keycloak = {...getKeycloakInstance(), initialized: true};

    this.unsubscribeFromKeycloakEvent = subscribeToWidgetEvent(KEYCLOAK_EVENT_TYPE, () => {
      this.keycloak = {...getKeycloakInstance(), initialized: true};
      this.render();
    });

    this.render();

    //retargetEvents(shadowRoot);
    this.appendChild(this.mountPoint);
  }

  render() {
    const baseUrl = this.getAttribute(ATTRIBUTES.baseUrl) || '';
    const serviceUrl = this.getAttribute(ATTRIBUTES.serviceUrl) || '';
    const locale = this.getAttribute(ATTRIBUTES.locale) || '';
    Locale.setLocale(locale);
    setAppContext(baseUrl);

    ReactDOM.render(
      <KeycloakContext.Provider value={this.keycloak}>
        <Login serviceUrl={serviceUrl} locale={locale}/>
      </KeycloakContext.Provider>,
      this.mountPoint
    );
  }
}

customElements.get('cp-login') || customElements.define('cp-login', LoginElement);
