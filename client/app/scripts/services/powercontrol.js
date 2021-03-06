(function () {
  'use strict';

  angular.module('ha-remote.panel')
    .service('powerControlService', ['$q', '$http', '$log', PowerControlService]);


  function PowerControlService($q, $http, $log) {

    // Promise-based API
    return {
      powerOn: function (id) {

        return $http.post('/api/controls/' + id + '/poweron')
          .then(function (res) {
            $log.debug("Called powerOn API for control id:" + id);
            return res.data;
          }, function (res) {
            $log.info("Call to " + res.config.url + " failed with status " + res.status);
            return $q.reject(res.data)
          })
      },

      powerOff: function (id) {

        return $http.post('/api/controls/' + id + '/poweroff')
          .then(function (res) {
            $log.debug("Called powerOff API for control id:" + id);
            return res.data;
          }, function (res) {
            $log.info("Call to " + res.config.url + " failed with status " + res.status);
            return $q.reject(res.data)
          })
      },

      dim: function (id, level) {

        return $http.post('/api/controls/' + id + '/dim', { level: level})
          .then(function (res) {
            $log.debug("Called dim API for control id:" + id);
            return res.data;
          }, function (res) {
            $log.info("Call to " + res.config.url + " failed with status " + res.status);
            return $q.reject(res.data)
          })
      },

      getState: function (id) {

        return $http.get('/api/controls/' + id)
          .then(function (res) {
            $log.debug("Called getState API for control id:" + id);
            return res.data;
          }, function (res) {
            $log.info("Call to " + res.config.url + " failed with status " + res.status);
            return $q.reject(res.data)
          })
      }
    };
  }

})();
