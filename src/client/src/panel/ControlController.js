(function () {

  angular
    .module('ha-remote.panel')
    .controller('ControlController',
    [
      'powerControlService',
      '$log',
      '$mdToast',
      '$translate',
      ControlController
    ]);

  /**
   * Main Controller for the Angular Material Starter App
   */
  function ControlController(powerControlService, $log, $mdToast, $translate) {
    var self = this;

    self.powerOn = powerOn;
    self.powerOff = powerOff;

    // *********************************
    // Internal methods
    // *********************************

    /**
     * Power on a control
     */
    function powerOn(control) {
      $log.debug("Power on for id: " + control.id + " clicked.");
      self.showProgress = true;

      powerControlService.powerOn(control.id)
        .then(function () {
          self.showProgress = false;
          $translate('POWER_ON_SUCCESS', { control_caption: control.caption })
            .then(function (message) {
              showToast(message);
            });
        }, function () {
          self.showProgress = false;
          $translate('POWER_ON_FAILURE', { control_caption: control.caption })
            .then(function (message) {
              showToast(message);
            });
        })
    }

    /**
     * Power off a control
     */
    function powerOff(control) {
      $log.debug("Power off for id: " + control.id + " clicked.");
      self.showProgress = true;

      powerControlService.powerOff(control.id)
        .then(function () {
          self.showProgress = false;
          $translate('POWER_OFF_SUCCESS', { control_caption: control.caption })
            .then(function (message) {
              showToast(message);
            });
        }, function () {
          self.showProgress = false;
          $translate('POWER_OFF_FAILURE', { control_caption: control.caption })
            .then(function (message) {
              showToast(message);
            });
        })
    }

    /**
     * Show simple toast with a message.
     */
    function showToast(message) {
      $mdToast.show($mdToast.simple().textContent(message));
    }

  }
})();
