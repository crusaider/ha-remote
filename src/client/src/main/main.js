(function () {
  'use strict';
  angular.module('main', ['ngMaterial','pascalprecht.translate','LocalStorageModule']);

  /*
  ** Configure local storage
  */

  angular.module('main').config(['localStorageServiceProvider', function(localStorageServiceProvider ) {
  localStorageServiceProvider
    .setPrefix('HARemote')
    .setStorageType('localStorage')
    .setNotify(true, true)
  }]);


})();
