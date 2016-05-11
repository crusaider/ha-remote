(function () {
  'use strict';

  angular.module('main')
    .service('configService', ['$q', '$http', '$log', ConfigService]);

  /**
   * Users DataService
   * Uses embedded, hard-coded data model; acts asynchronously to simulate
   * remote data service call(s).
   *
   * @returns {{load: Function}}
   * @constructor
   */
  function ConfigService($q, $http, $log) {

    // Promise-based API
    return {
      load: function () {

        return $http.get('/api/config')
        .then(function (res) {
          $log.debug("Fetched configuration from server");
          return res.data;
        }, function (res) {
          $log.info("Call to " + res.config.url + " failed with status " + res.status);
          return $q.reject(res.data)
        })
      }
    };
  }

})();
