(function () {
    'use strict';

    angular.module('ha-remote.authn').factory('Intercept401', ['$log','$q', function ( $log, $q) {

        $log.debug('$log is here to show you that this is a regular factory with injection');

        return {

            response: function(response) {
                $log.debug("Intercepted response");
                var deferred = $q.defer();
                deferred.resolve(response); 
                return deferred.promise;           
            },
            responseError: function(response) {
                $log.debug("Intercepted response error");
                var deferred = $q.defer();
                deferred.reject(response);
                return deferred.promise;            
            }

        };
    }]);

    angular.module('ha-remote.authn').config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('Intercept401');
    }]);

})();