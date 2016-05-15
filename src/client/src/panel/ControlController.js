/**
 * Controller that manages a single set of on and off buttons in the 
 * control panel.
 * 
 * @author Jonas <jonas.m.andreasson@gmail.com>
 * @license MIT
 */

(function () {

  angular
    .module('ha-remote.panel')
    .controller('ControlController',
    [
      'powerControlService',
      '$log',
      '$mdToast',
      '$translate',
      '$scope',
      ControlController
    ]);

  function ControlController(powerControlService, $log, $mdToast, $translate, $scope) {
    var self = this;

    // TODO: Is this a hack? Any other way to get a reference to it?
    self.control = $scope.$parent.control;

    self.powerOn = powerOn;
    self.powerOff = powerOff;
    self.state = 'unknown';

    updateState();


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
          updateState();
        }, function () {
          self.showProgress = false;
          $translate('POWER_ON_FAILURE', { control_caption: control.caption })
            .then(function (message) {
              showToast(message);
            });
          updateState();
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
          updateState();
        }, function () {
          self.showProgress = false;
          $translate('POWER_OFF_FAILURE', { control_caption: control.caption })
            .then(function (message) {
              showToast(message);
            });
          updateState();
        })
    }

    function updateState() {

      powerControlService.getState(self.control.id)
        .then(function (data) {

          switch (data.state) {
            case "on":
              self.state = "on";
              break;
            case "off":
              self.state = "off";
              break;
            default:
              self.state = "unknown";
          }

          $log.debug("Set device state of device %s to %s", self.control.caption, self.state);

        }, function () {
          self.state = "unknown";
          $log.debug("Could not get state of device %s setting it to %s", self.control.caption, self.state);
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
