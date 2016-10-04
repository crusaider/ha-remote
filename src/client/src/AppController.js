/**
 * Top Level controller for the app. 
 * 
 * @author Jonas <jonas.m.andreasson@gmail.com>
 * @license MIT
 */

(function () {
  'use strict';
  angular
    .module('ha-remote')
    .controller('AppController',
    [
      'authnService',
      '$mdSidenav',
      '$log',
      '$translate',
      '$scope',
      AppController
    ]);

  function AppController(authnService, $mdSidenav, $log, $translate, $scope) {
    var self = this;

    if (authnService.isAuthenticated()) {
      self.selected = 'panel';
    } else {
      self.selected = 'login';
    }
    self.toggleMenu = toggleMenu;
    self.select = select;
    self.password = '';
    self.submitPassword = submitPassword;
    self.loginDisabled = false;
    self.loginFailed = false;

    /**
     * Listen for authnFailed events to force a logon
     */
    $scope.$on('authnFailed', function () {
      $log.debug("Received authnFailed event");
      self.selected = 'login';
    });

    // *********************************
    // Internal methods
    // *********************************

    /**
     * Hide or Show the 'left' sideNav area
     */
    function toggleMenu() {
      $mdSidenav('left').toggle();
    }

    /**
     * Select a item from the menu, show the related main content
     */
    function select(selection) {

      if (selection == 'logout') {
        authnService.logout();
        self.selected = 'login';
      } else {
        self.selected = selection;
      }
    }

    /**
     * Handle login when password submitted
     */
    function submitPassword() {
      $log.debug("Password submitted: %s", self.password);
      self.loginDisabled = true;
      self.loginDisabled = false;

      authnService.login(self.password)
        .then(function () {
          $log.debug("Sucessfull login");
          self.password = "";
          self.loginDisabled = false;
          self.loginFailed = false;
          self.select('panel');
        }, function (error) {
          $log.debug("Login failed");
          self.password = "";
          self.loginFailed = true;
          self.loginDisabled = false;
        });

    }

  }
})();
