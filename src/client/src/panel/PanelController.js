(function () {

  angular
    .module('ha-remote.panel')
    .controller('PanelController',
    [
      'configService',
      'powerControlService',
      '$log',
      '$mdToast',
      '$translate',
      PanelController
    ]);

  /**
   * Main Controller for the Angular Material Starter App
   */
  function PanelController(configService, powerControlService, $log, $mdToast, $translate) {
    var self = this;

    self.controls = [];
    self.showControls = false;
    self.showProgress = true;
    self.powerOffAll = powerOffAll;
    self.powerOnAll = powerOnAll;

    // Load controls configuration

    configService.load()
      .then(function (controls) {
        self.controls = controls;
        self.showProgress = false;
        self.showControls = true;
      }, function (error) {
        self.showProgress = false;
        self.showControls = false;
        $translate('CONFIG_LOAD_FAILED').then(function (message) {
          showToast(message);
        });
      });

    // *********************************
    // Internal methods
    // *********************************

    /**
    * Power off all controls
    */
    function powerOffAll() {
      $log.debug("Power off all clicked.");
      self.showProgress = true;

      results = new MultiOperationResult(self.controls.length);

      self.controls.forEach(function (control) {
        powerControlService.powerOff(control.id)
          .then(function () {
            results.addSucess(control);
            powerOffAllCallback(results);
          }, function () {
            results.addFailure(control);
            powerOffAllCallback(results);
          })
      })
    }

    /**
    * Power on all controls
    */
    function powerOnAll() {
      $log.debug("Power on all clicked.");
      self.showProgress = true;

      results = new MultiOperationResult(self.controls.length);

      self.controls.forEach(function (control) {
        powerControlService.powerOn(control.id)
          .then(function () {
            results.addSucess(control);
            powerOnAllCallback(results);
          }, function () {
            results.addFailure(control);
            powerOnAllCallback(results);
          })
      })
    }


    /**
     * Show simple toast with a message.
     */
    function showToast(message) {
      $mdToast.show($mdToast.simple().textContent(message));
    }
    /**
      * Called when one of the calls to power on a single 
      * device has been completed regardless of sucess or failure.
      */

    function powerOffAllCallback(results) {
      if (results.isComplete()) {
        self.showProgress = false;
        if (results.failCount() == 0) {
          $translate('POWER_OFF_ALL_SUCCESS')
            .then(function (message) {
              showToast(message);
            });
        } else {
          $translate('POWER_OFF_ALL_FAILURE')
            .then(function (message) {
              showToast(message);
            });
        }
      }

    }

    /**
     * Called when one of the calls to power off a single 
     * device has been completed regardless of sucess or failure.
     */

    function powerOnAllCallback(results) {
      if (results.isComplete()) {
        self.showProgress = false;
        if (results.failCount() == 0) {
          $translate('POWER_ON_ALL_SUCCESS')
            .then(function (message) {
              showToast(message);
            });
        } else {
          $translate('POWER_ON_ALL_FAILURE')
            .then(function (message) {
              showToast(message);
            });
        }
      }
    }
  }


  /**
   * Class that can keep track of the number of controls
   * that has been called and categorizes them in sucess
   * or failures.
   */

  function MultiOperationResult(controlCount) {
    this.controlCount = controlCount;
    this.sucessed = [];
    this.failed = [];
  }

  MultiOperationResult.prototype.isComplete = function () {
    return this.sucessed.length + this.failed.length >= this.controlCount;
  };

  MultiOperationResult.prototype.failCount = function () {
    return this.failed.length;
  };

  MultiOperationResult.prototype.sucessCount = function () {
    return this.sucessed.length;
  };

  MultiOperationResult.prototype.addSucess = function (control) {
    this.sucessed.push(control);
  };

  MultiOperationResult.prototype.addFailure = function (control) {
    this.failed.push(control)
  };

})();
