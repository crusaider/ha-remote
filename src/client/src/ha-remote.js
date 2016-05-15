(function () {
  'use strict';
  angular.module('ha-remote', [
    'ngMaterial',
    'ha-remote.panel',
    'ha-remote.translations',
    'ha-remote.authn']);


  /**
   * Configure theme and icons
   */

  angular.module('ha-remote').config(function ($mdThemingProvider, $mdIconProvider) {

    $mdIconProvider
      .defaultIconSet('./assets/svg/mdi.svg')
      .icon("menu", "./assets/svg/menu.svg", 24)
      .icon("power-on", "./assets/svg/power-on.svg", 24)
      .icon("power-off", "./assets/svg/power-off.svg", 24)
      .icon("logo", "./assets/svg/remote-control.svg", 12);

    $mdThemingProvider.theme('default')
      .primaryPalette('blue')
      .accentPalette('red');

  });

})();
