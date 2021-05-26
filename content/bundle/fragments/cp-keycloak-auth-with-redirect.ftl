<#assign wp=JspTaglibs["/aps-core"]>
<script nonce="<@wp.cspNonce />">
    (function () {
        const consolePrefix = '[ENTANDO-KEYCLOAK]';
        const keycloakConfigEndpoint = '<@wp.info key="systemParam" paramName="applicationBaseURL" />keycloak.json';
        let keycloakConfig;

        function dispatchKeycloakEvent(eventType) {
            console.info(consolePrefix, 'Dispatching', eventType, 'custom event');
            return window.dispatchEvent(new CustomEvent('keycloak', {detail: {eventType}}));
        };

        function initKeycloak() {
            const keycloak = new Keycloak(keycloakConfig);
            keycloak.onReady = function () {
                dispatchKeycloakEvent('onReady');
            };
            keycloak.onAuthSuccess = function () {
                dispatchKeycloakEvent('onAuthSuccess');
            };
            keycloak.onAuthError = function () {
                dispatchKeycloakEvent('onAuthError');
            };
            keycloak.onAuthRefreshSuccess = function () {
                dispatchKeycloakEvent('onAuthRefreshSuccess');
            };
            keycloak.onAuthRefreshError = function () {
                dispatchKeycloakEvent('onAuthRefreshError');
            };
            keycloak.onAuthLogout = function () {
                dispatchKeycloakEvent('onAuthLogout');
            };
            keycloak.onTokenExpired = function () {
                dispatchKeycloakEvent('onTokenExpired');
            };
            window.entando = {
                ...(window.entando || {}),
                keycloak,
            };
            const silentRedirectUri = window.location.origin + '/en/cp_keycloak_silent_check_sso.page';
            const initOptions = {
                onLoad: 'login-required',
                silentCheckSsoRedirectUri: silentRedirectUri,
                enableLogging: true
            };
            window.entando.keycloak
                .init(initOptions)
                .catch(function (e) {
                    console.error(e);
                    console.error(consolePrefix, 'Failed to initialize Keycloak');
                });
        };

        function onKeycloakScriptError(e) {
            console.error(e);
            console.error(consolePrefix, 'Failed to load keycloak.js script');
        };

        function addKeycloakScript(keycloakConfig) {
            const script = document.createElement('script');
            script.src = keycloakConfig['auth-server-url'] + '/js/keycloak.js';
            script.async = true;
            script.addEventListener('load', initKeycloak);
            script.addEventListener('error', onKeycloakScriptError);
            document.body.appendChild(script);
        };
        fetch(keycloakConfigEndpoint)
            .then(function (response) {
                return response.json();
            })
            .then(function (config) {
                keycloakConfig = config;
                if (!keycloakConfig.clientId) {
                    keycloakConfig.clientId = keycloakConfig.resource;
                }
                addKeycloakScript(keycloakConfig);
            })
            .catch(function (e) {
                console.error(e);
                console.error(consolePrefix, 'Failed to fetch Keycloak configuration');
            });
    })();</script>