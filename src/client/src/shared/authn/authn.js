(function () {
  'use strict';
  angular.module('ha-remote.authn', ['LocalStorageModule']);

  /*
  ** Configure local storage to store the authn token
  */

  angular.module('ha-remote.authn').config(['localStorageServiceProvider', function(localStorageServiceProvider ) {
  localStorageServiceProvider
    .setPrefix('HARemote')
    .setStorageType('localStorage')
    .setNotify(true, true)
  }]);


})();