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
    self.onSliderChange = onSliderChange;
    self.state = 'state-unknown';
    self.dimmerValue = -1;

    updateState();
    updateSlider();

    /**
     * Listen for events to update state
     */

    $scope.$on('updateState', updateState);


    // *********************************
    // Internal methods
    // *********************************

    /**
     * Called by the slider when the value chnages, calls the backend
     * so set the new dim level after a delay. If a new call
     * is recieved before the end of the delay, the precious call
     * is canceled and a new is scheduled.
     */
    self.dimTimeout;

    function onSliderChange(control) {
      $log.debug("Slider changed %s", self.dimmerValue);

      if (self.dimTimeout) {
        $log.debug('Cancel dimmer timeout');
        $timeout.cancel(self.dimTimeout);
      }

      self.dimTimeout = $timeout(function () {
        $log.debug('Dimer timeout fire');

        powerControlService.dim(control.id, self.dimmerValue)
          .then(function () {
            // updateState();
            self.dimTimeout = null;
          }, function () {
          })

      }, 50)

    }

    /**
     * Power on a control
     */
    function powerOn(control) {
      $log.debug("Power on for id: " + control.id + " clicked.");
      showProgress();

      powerControlService.powerOn(control.id)
        .then(function () {
          self.showProgress = false;
          $translate('POWER_ON_SUCCESS', {control_caption: control.caption})
            .then(function (message) {
              showToast(message);
            });
          updateState();
          hideProgress();
        }, function () {
          self.showProgress = false;
          $translate('POWER_ON_FAILURE', {control_caption: control.caption})
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
          $translate('POWER_OFF_SUCCESS', {control_caption: control.caption})
            .then(function (message) {
              showToast(message);
            });
          updateState();
          hideProgress();
        }, function () {
          $translate('POWER_OFF_FAILURE', {control_caption: control.caption})
            .then(function (message) {
              showToast(message);
            });
          updateState();
          hideProgress();
        })
    }

    /**
     * Calls the backend to check the state of the control and
     * update the indicators on screen
     *
     * @param {boolean} final - If true, only one call will be executed,
     * if falsy a second call to update state will be done after a delay.
     */
    function updateState(final) {

      powerControlService.getState(self.control.id)
        .then(function (data) {

          $log.debug("Backend device state of device %s is %s", self.control.caption, data.state);
          switch (data.state) {
            case "on":
            case "dim":
              self.state = "state-on";
              break;
            case "off":
              self.state = "state-off";
              break;
            default:
              self.state = "state-unknown";
              $log.debug('Unknown state %s', data.state);
          }
          $log.debug("Set device state of device %s to %s", self.control.caption, self.state);

          rescheduleUpdateState(final);
        }, function () {
          self.state = "unknown";
          $log.debug("Could not get state of device %s setting it to %s", self.control.caption, self.state);
          rescheduleUpdateState(final);
        })
    }

    /**
     * Gets the dimmer value from the backend if the device is a dimmer and updates the slider
     */
    function updateSlider() {

      if (self.control.type === 'dimmer') {
        powerControlService.getState(self.control.id)
          .then(function (data) {
            if (self.control.type === 'dimmer') {
              self.dimmerValue = parseInt(data.value, 10);
              $log.debug("Set device dimmer value of device %s to %s", self.control.caption, self.dimmerValue);
            }
          }, function () {
            self.state = "unknown";
            $log.debug("Could not get dimmer value of device %s setting it to -1", self.control.caption);
          })
      }
    }

    /**
     * Shedules a call to updateState(true) after a delay
     *
     * @param {boolean} final - If falsy the call will be scheduled,
     * otherwise not.
     */
    function rescheduleUpdateState(final) {
      if (!final) {
        $log.debug("Rescheduling update state of %s", self.control.caption);
        $timeout(function () {
          updateState(true)
        }, self.control.type === 'dimmer' ? 1000 : 500);
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
