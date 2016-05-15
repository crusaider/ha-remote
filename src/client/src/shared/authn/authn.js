/**
 * @module ha-remote.authn
 * 
 * Manages the athentication and authorization of the user.
 * 
 * @author Jonas <jonas.m.andreasson@gmail.com>
 * @license MIT
 */

(function () {
  'use strict';
  angular.module('ha-remote.authn', ['LocalStorageModule']);

  /*
  ** Configure local storage to store the authn token between sessions
  */
  angular.module('ha-remote.authn').config(['localStorageServiceProvider', function(localStorageServiceProvider ) {
  localStorageServiceProvider
    .setPrefix('HARemote')
    .setStorageType('localStorage')
    .setNotify(true, true)
  }]);


})();