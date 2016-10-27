/**
 * Encapsluates authentication operations
 * 
 * @author Jonas <jonas.m.andreasson@gmail.com>
 * @license MIT
 */

(function () {
  'use strict';

  angular.module('ha-remote.authn')
    .service('authnService', ['localStorageService', '$q', '$http', '$log', '$rootScope',
      AuthnService]);


  function AuthnService(localStorageService, $q, $http, $log, $rootScope) {


    // Promise-based API
    return {
      /**
       * Authenticate the user against the backend. On sucessfull authentication
       * adds the returned token to the $http configuration to be attached
       * to all future requests. The token will also be stored in local 
       * storage to be able to survive sessions.
       * 
       * @param password The password to be 
       * @returns A promise that will be recjected with err 401 if 
       * the authentication failed.
       */
      login: function (password) {

        return $http.post('/api/authn', { password: password })
          .then(function (res) {
            $log.debug("Sucessfully logged in");
            setToken(res.data.token);
            $rootScope.$broadcast('authenSuceeded');
            $log.debug("Broadcasted authenSuceeded event");
            return;
          }, function (res) {
            if (res.status == 401) {
              $log.info("Login attempted with invalid credentials");
              removeToken();
              return $q.reject(401);
            }
            $log.info("Call to " + res.config.url + " failed with status " + res.status);
            return $q.reject(res.data)
          })
      },

      /**
       * Logs out the user by removing the token from the $http service 
       * and local storage.
       */
      logout: function () {
        invalidateToken()
      },

      /**
       * Checks if the user has been authenticated
       * 
       * @returns True if authenticated
       */
      isAuthenticated: function () {
        var token = loadToken();

        if (token) {
          addTokenToHttp(token);
          return true;
        } else {
          return false;
        }
      }
    };

    function setToken(token) {
      storeToken(token);
      addTokenToHttp(token);
    }

    function storeToken(token) {
      localStorageService.set('AuthToken', token);
      $log.debug("Token stored in local storage");
    }

    function loadToken() {
      return localStorageService.get('AuthToken');
    }

    function addTokenToHttp(token) {
      $http.defaults.headers.common.Authorization = "Bearer: ".concat(token);
      $log.debug("Token attached to $http");
    }

    function invalidateToken() {
      localStorageService.remove('AuthToken');
      $log.debug("Token removed");
    }
  }
})();
