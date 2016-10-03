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
      '$timeout',
      ControlController
    ]);

  function ControlController(powerControlService, $log, $mdToast, $translate, $scope, $timeout) {
    var self = this;

    // TODO: Is this a hack? Any other way to get a reference to it?
    self.control = $scope.$parent.control;

    self.powerOn = powerOn;
    self.powerOff = powerOff;
    self.state = 'state-unknown';

    updateState();

    /**
     * Listen for events to update state
     */

    $scope.$on('updateState', updateState);


    // *********************************
    // Internal methods
    // *********************************

    /**
     * Power on a control
     */
    function powerOn(control) {
      $log.debug("Power on for id: " + control.id + " clicked.");
      showProgress();

      powerControlService.powerOn(control.id)
        .then(function () {
          self.showProgress = false;
          $translate('POWER_ON_SUCCESS', { control_caption: control.caption })
            .then(function (message) {
              showToast(message);
            });
          updateState();
          hideProgress();
        }, function () {
          self.showProgress = false;
          $translate('POWER_ON_FAILURE', { control_caption: control.caption })
            .then(function (message) {
              showToast(message);
            });
          updateState();
          hideProgress();
        })
    }

    /**
     * Power off a control
     */
    function powerOff(control) {
      $log.debug("Power off for id: " + control.id + " clicked.");
      showProgress();

      powerControlService.powerOff(control.id)
        .then(function () {
          $translate('POWER_OFF_SUCCESS', { control_caption: control.caption })
            .then(function (message) {
              showToast(message);
            });
          updateState();
          hideProgress();
        }, function () {
          $translate('POWER_OFF_FAILURE', { control_caption: control.caption })
            .then(function (message) {
              showToast(message);
            });
          updateState();
          hideProgress();
        })
    }

    function updateState(final) {

      powerControlService.getState(self.control.id)
        .then(function (data) {

          switch (data.state) {
            case "on":
              self.state = "state-on";
              break;
            case "off":
              self.state = "state-off";
              break;
            default:
              self.state = "state-unknown";
          }
          $log.debug("Set device state of device %s to %s", self.control.caption, self.state);
          rescheduleUpdateState(final);
        }, function () {
          self.state = "unknown";
          $log.debug("Could not get state of device %s setting it to %s", self.control.caption, self.state);
          rescheduleUpdateState(final);
        })
    }

    function rescheduleUpdateState(final) {
      if (!final) {
        $log.debug("Rescheduling update state of %s", self.control.caption );
        $timeout(function () { updateState(true) }, 500);
      }
    }

    function showProgress() {
      $scope.$emit('showProgress');
      $log.debug("Emitted showProgress");
    }

    function hideProgress() {
      $scope.$emit('hideProgress');
      $log.debug("Emitted hideProgress");
    }

    /**
     * Show simple toast with a message.
     */
    function showToast(message) {
      $mdToast.show($mdToast.simple().textContent(message));
    }

  }
})();
