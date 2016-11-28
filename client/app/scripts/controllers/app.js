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
      'configService',
      'authnService',
      '$mdSidenav',
      '$log',
      '$translate',
      '$scope',
      '$location',
      AppController
    ]);

  function AppController(configService, authnService, $mdSidenav, $log, $translate, $scope, $location) {
    var self = this;



    if (authnService.isAuthenticated()) {
      self.selected = 'panel';
      select('panel');
    } else {
      self.selected = 'login';
      select('login');
    }
    self.toggleMenu = toggleMenu;
    self.select = select;
    self.groups = [];

    // Load controls configuration

    configService.load()
      .then(function (config) {
        self.groups = config.groups;
        self.showProgress = false;
        self.showControls = true;
      }, function (error) {
        self.showProgress = false;
        self.showControls = false;
        $translate('CONFIG_LOAD_FAILED').then(function (message) {
          showToast(message);
        });
      });

    /**
     * Listen for authnFailed events to force a logon
     */
    $scope.$on('authnFailed', function () {
      $log.debug("Received authnFailed event");
      self.selected = 'login';
    });

    /**
     * Listen to authn suceess events to navigate to
     * the panel.
     *
     */
    $scope.$on('authenSuceeded', function() {
      $log.debug("Received authenSuceeded event");
      self.selected = 'panel';
      self.select('panel');
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
        $location.path('/'.concat('login'));
      } else {
        $location.path('/'.concat(selection));
        self.selected = selection;
      }
    }

  }
})();

