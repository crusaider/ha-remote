(function () {

  angular
    .module('main')
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
    self.powerOn = powerOn;
    self.powerOff = powerOff;
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
    * Power off all controls
    */
    function powerOffAll() {
      $log.debug("Power off all clicked.");
      self.showProgress = true;

      results = new MultiOperationResult();

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
    * Power off all controls
    */
    function powerOnAll() {
      $log.debug("Power on all clicked.");
      self.showProgress = true;

      results = new MultiOperationResult();

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

    function powerOffAllCallback(results) {
      if (results.isComplete(self.controls.length)) {
        self.showProgress = false;
        if (results.failCount() == 0) {
          showToast("Powered off everyting.");
        } else {
          showToast("Could not power off everything.");
        }
      }

    }
    
    function powerOnAllCallback(results) {
      if (results.isComplete(self.controls.length)) {
        self.showProgress = false;
        if (results.failCount() == 0) {
          showToast("Powered on everyting.");
        } else {
          showToast("Could not power on everything.");
        }
      }

    }

  }


  function MultiOperationResult() {
    this.sucessed = [];
    this.failed = [];
  }

  MultiOperationResult.prototype.isComplete = function (controlCount) {
    return this.sucessed.length + this.failed.length == controlCount;
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
