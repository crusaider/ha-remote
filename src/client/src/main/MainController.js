(function () {
  'use strict';
  angular
    .module('ha-remote')
    .controller('MainController',
    [
      'authnService',
      '$mdSidenav',
      '$log',
      '$translate',
      MainController
    ]);

  /**
   * Main Controller for the Angular Material Starter App
   */
  function MainController(authnService, $mdSidenav, $log, $translate ) {
    var self = this;

    if ( authnService.isAuthenticated() ) {
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
      
      if( selection == 'logout' ){
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
