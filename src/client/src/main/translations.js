(function () {
    'use strict';

    var en = {
        APPNAME: "HA Remote",
        TITLE: 'Home Remote',
        HEADLINE: 'Home Remote',
        MENU_PANEL: 'Buttons',
        MENU_ABOUT: 'About this App',
        MENU_LOGIN: 'Log in',
        MENU_LOGOUT: 'Log out',
        ALL_CONTROLS: "All at once",
        POWER_ON_SUCCESS: '{{control_caption}} powered on',
        POWER_ON_FAILURE: 'Failed to power on {{control_caption}}',
        POWER_OFF_SUCCESS: '{{control_caption}} powered off',
        POWER_OFF_FAILURE: 'Failed to power off {{control_caption}}',
        POWER_ON_ALL_SUCCESS: 'Everything powered on',
        POWER_ON_ALL_FAILURE: 'Could not power everything on',
        POWER_OFF_ALL_SUCCESS: 'Everything powered off',
        POWER_OFF_ALL_FAILURE: 'Could not power everything off',
        CONFIG_LOAD_FAILED: "Could not load configuration",
        W_SERVER_VERSION: "Server version",
        W_CLIENT_VERSION: "Client version",
        W_MODULES: "Modules",
        W_PASSWORD: "Password",
        W_LOGIN: "Login",
        WRONG_PASSWORD: "Login failed, please try again",
};

    var sv = {
        APPNAME: "HA Remote",
        TITLE: 'Hemma fjärr',
        HEADLINE: 'Hemma fjärr',
        MENU_PANEL: 'Knappar',
        MENU_ABOUT: 'Om appen',
        MENU_LOGIN: 'Logga in',
        MENU_LOGOUT: 'Logga ut',
        ALL_CONTROLS: "Alla samtidigt",
        POWER_ON_SUCCESS: 'Tände {{control_caption}}',
        POWER_ON_FAILURE: 'Kunde inte tända {{control_caption}}',
        POWER_OFF_SUCCESS: 'Släckte {{control_caption}}',
        POWER_OFF_FAILURE: 'Kunde inte släcka {{control_caption}}',
        POWER_ON_ALL_SUCCESS: 'Tände alla',
        POWER_ON_ALL_FAILURE: 'Kunde inte tända alla',
        POWER_OFF_ALL_SUCCESS: 'SLäckte alla',
        POWER_OFF_ALL_FAILURE: 'Kunde inte släcka alla',
        CONFIG_LOAD_FAILED: "Kunde inte hämta konfigurationen",
        W_SERVER_VERSION: "Server version",
        W_CLIENT_VERSION: "Klient version",
        W_MODULES: "Moduler",   
        W_PASSWORD: "Lösenord",
        W_LOGIN: "Logga in",
        WRONG_PASSWORD: "Misslyckad inloggning, försök igen.",
    };

    angular.module('main').config(['$translateProvider', function ($translateProvider) {
        // add translation table
        $translateProvider
            .translations('en', en)
            .translations('sv', sv)
            .fallbackLanguage('en')
            .preferredLanguage('sv');
        $translateProvider.useSanitizeValueStrategy('escape');
    }]);
})();