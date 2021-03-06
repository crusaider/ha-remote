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
      self.selected = 0;
      loadGroups();
    } else {
      doLogout();
    }
    self.toggleMenu = toggleMenu;
    self.doLogout = doLogout;
    self.groups = [];
    self.title = 'Title';

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
    $scope.$on('authenSuceeded', function () {
      $log.debug("Received authenSuceeded event");
      loadGroups();
      self.selected = 0;
      $location.path('/'.concat('panel/0'));
    });

    /**
     * Listen for route changes to update state of menu items and
     * toolbar title text.
     */
    $scope.$on('$routeChangeSuccess', function (event, current, previous) {
      switch (current.$$route.controller) {
        case 'AboutController':
          $translate('MENU_ABOUT')
            .then(function (message) {
              self.title = message;
            });
          return self.selected = 'about';
        case 'PanelController':
          self.title = self.groups[current.params.group].caption;
          return self.selected = current.params.group;
        case 'LoginController':
          return $translate('MENU_LOGIN')
            .then(function (message) {
              self.title = message;
            });
        default:
          $log.error('Invalid/unknown route');
      }
    });

    // *********************************
    // Internal methods
    // *********************************

    /**
     * Load configuration to render groups in the menu.
     */
    function loadGroups() {
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
    }

    /**
     * Hide or Show the 'left' sideNav area
     */
    function toggleMenu() {
      $mdSidenav('left').toggle();
    }

    /**
     * Force invalidation of credentials and
     * route to login view.
     */
    function doLogout() {
      authnService.logout();
      self.selected = 'login';
      $location.path('/'.concat('login'));
    }
  }
})();

