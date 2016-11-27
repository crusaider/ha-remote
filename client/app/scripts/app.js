(function () {
  'use strict';
  angular.module('ha-remote', [
    'ngMaterial',
    'ngRoute',
    'ha-remote.panel',
    'ha-remote.translations',
    'ha-remote.authn',
    'ha-remote.about']);


  /**
   * Configure theme and icons
   */

  angular.module('ha-remote').config(
          function ($mdThemingProvider, $mdIconProvider, $routeProvider) {

    $mdIconProvider
      .defaultIconSet('./images/svg/mdi.svg')
      .icon("menu", "./images/svg/menu.svg", 24)
      .icon("power-on", "./images/svg/power-on.svg", 24)
      .icon("power-off", "./images/svg/power-off.svg", 24)
      .icon("logo", "./images/svg/remote-control.svg", 12);

    $mdThemingProvider.theme('default')
      .primaryPalette('blue')
      .accentPalette('red');

    $routeProvider
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginController',
            controllerAs: 'ctrl'
        })
        .when( '/about', {
            templateUrl: 'views/about.html',
            controller: 'AboutController'  
        })
        .when('/panel', {
            templateUrl: 'views/panel.html',
            controller: 'PanelController',
            controllerAs: 'ctrl'
        })
            .otherwise({
                redirectTo: '/panel'
        });
  });

})();