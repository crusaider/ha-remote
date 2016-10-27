/**
 * @ngdoc function
 * @name ha-remote.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the ha-remote
 */

(function() {
'use strict';
        angular
        .module('ha-remote')
        .controller('LoginController',
        [
                'authnService',
                '$log',
                LoginController
        ]);

    function LoginController(authnService,$log) {
        var self = this;
        self.password = '';
        self.submitPassword = submitPassword;
        self.loginDisabled = false;
        self.loginFailed = false;

        /**
        * Handle login when password submitted
        */
        function submitPassword() {
            $log.debug("Password submitted: %s", self.password);
            self.loginDisabled = true;
            authnService.login(self.password)
                .then(function () {
                    $log.debug("Sucessfull login");
                    self.password = "";
                    self.loginDisabled = false;
                    self.loginFailed = false;
                }, function (error) {
                    $log.debug("Login failed");
                    self.password = "";
                    self.loginFailed = true;
                    self.loginDisabled = false;
                });
            };
        };
})();
