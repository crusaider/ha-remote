(function () {
    'use strict';

    angular.module('ha-remote.authn').factory('Intercept401', ['$log','$q', '$rootScope', function ( $log, $q, $rootScope) {

        return {
            responseError: function(response) {
                $log.debug("Intercepted response error");
                var deferred = $q.defer();
                $rootScope.$broadcast('authnFailed');
                $log.debug("Broadcasted authnFailed event");
                deferred.reject(response);
                return deferred.promise;            
            }
        };
    }]);

    angular.module('ha-remote.authn').config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('Intercept401');
    }]);

})();