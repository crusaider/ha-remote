/**
 * Encapsluates authentication operations
 * 
 * @author Jonas <jonas.m.andreasson@gmail.com>
 * @license MIT
 */

(function () {
  'use strict';

  angular.module('ha-remote.authn')
    .service('authnService', ['localStorageService', '$q', '$http', '$log',
    AuthnService]);


  function AuthnService(localStorageService, $q, $http, $log) {


    // Promise-based API
    return {
      /**
       * Authenticate the user against the backend. On sucessfull authentication
       * add the returned token to the $http configuration to be attached
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
        removeToken()
      },

      /**
       * Checks if the user has been authenticated
       * 
       * @returns True if authenticated
       */
      isAuthenticated: function () {
        var token = localStorageService.get('AuthToken');

        if (token) {
          $http.defaults.headers.common.Authorization = token;
          return true;
        } else {
          return false;
        }
      }
    };

    function setToken(newToken) {
      localStorageService.set('AuthToken', newToken);
      $http.defaults.headers.common.Authorization = newToken;
      $log.debug("New token stored");
    }

    function removeToken() {
      localStorageService.remove('AuthToken');
      $log.debug("Token removed");
    }
  }
})();
