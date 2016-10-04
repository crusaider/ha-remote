/**
 * Installs a $http interceptor that will broadcast a event on the 
 * $rootScope when a request is rejected by the backend with a 
 * 401 (Unauthorized) response code.
 * 
 * @author Jonas <jonas.m.andreasson@gmail.com>
 * @license MIT
 */

(function () {
  'use strict';

  angular
    .module('ha-remote.authn')
    .factory('Intercept401', ['$log', '$q', '$rootScope',
      function ($log, $q, $rootScope) {

        return {
          responseError: function (response) {
            $log.debug("Intercepted response error");
            var deferred = $q.defer();

            if (response.status == 401) {
              $rootScope.$broadcast('authnFailed');
              $log.debug("Broadcasted authnFailed event");
            }

            deferred.reject(response);
            return deferred.promise;
          }
        };
      }]);

  angular.
    module('ha-remote.authn')
    .config(['$httpProvider', function ($httpProvider) {
      $httpProvider.interceptors.push('Intercept401');
    }]);

})();