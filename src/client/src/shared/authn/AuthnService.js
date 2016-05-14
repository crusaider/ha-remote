(function () {
  'use strict';

  angular.module('main')
    .service('authnService', ['localStorageService', '$q', '$http', '$log', AuthnService]);


  function AuthnService(localStorageService, $q, $http, $log) {


    // Promise-based API
    return {
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

      logout: function () {
        removeToken()
      },

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

  /**
   * $http interceptor that emits a event on the $rootScope 
   * on a 401 status code response.
   */

})();
