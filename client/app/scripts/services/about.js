/**
 * Retrives version information from the backend.
 *
 * @author Jonas <jonas.m.andreasson@gmail.com>
 * @license MIT
 */
(function () {
  'use strict';

  angular.module('ha-remote.about')
    .service('aboutService', ['$q', '$http', '$log', AboutService]);


  function AboutService($q, $http, $log) {

    // Promise-based API
    return {
      load: function () {

        // TODO: Cache this data to save a server roundtrip

        return $http.get('/api')
          .then(function (res) {
            $log.debug("Fetched about info from server");
            return res.data;
          }, function (res) {
            $log.info("Call to " + res.config.url + " failed with status " + res.status);
            return $q.reject(res.data)
          })
      }
    };
  }

})();
