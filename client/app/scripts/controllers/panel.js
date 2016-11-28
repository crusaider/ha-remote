(function () {

  angular
    .module('ha-remote.panel')
    .controller('PanelController',
    [
      'configService',
      'powerControlService',
      '$routeParams',
      '$log',
      '$mdToast',
      '$translate',
      '$scope',
      PanelController
    ]);

  /**
   * Main Controller for the Angular Material Starter App
   */
  function PanelController(configService, powerControlService, $routeParams, $log, $mdToast, $translate, $scope) {
    var self = this;

    self.controls = [];
    self.showControls = false;
    self.showProgress = true;
    self.powerOffAll = powerOffAll;
    self.powerOnAll = powerOnAll;
    self.onWindowFocus = onWindowFocus;

    // Load controls configuration

    configService.load()
      .then(function (config) {
        self.controls = config.groups[$routeParams.group].controls;
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
    *
    * Listen for events to hide or show the progress bar
    *
    */
    var progressCount = 0;
    $scope.$on('showProgress', function () {
      self.showProgress = true;
      progressCount++;
    });

    $scope.$on('hideProgress', function () {
      progressCount--;
      if (progressCount < 0) {
        progressCount = 0;
      }

      if (progressCount == 0) {
        self.showProgress = false;
      }
    });

    /**
     * Exported functions
     */


    /**
    * Power off all controls
    */
    function powerOffAll() {
      $log.debug("Power off all clicked.");
      showProgress();

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
      showProgress();

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
     * Update state of all child controls when the window has
     * gotten focus.
     */
    function onWindowFocus() {
      $log.debug("PanelController#onWindowFocus");
      initUpdateState();
    }

    /**
     * Internal functions
     */

    function showProgress() {
      $scope.$emit('showProgress');
      $log.debug("Emitted showProgress");
    }

    function hideProgress() {
      $scope.$emit('hideProgress');
      $log.debug("Emitted hideProgress");
    }

    function initUpdateState() {
      $log.debug("PanelController#initUpdateState");
      $scope.$broadcast('updateState');
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
        hideProgress();
        if (results.failCount() == 0) {
          $translate('POWER_OFF_ALL_SUCCESS')
            .then(function (message) {
              showToast(message);
            });
          initUpdateState();
        } else {
          $translate('POWER_OFF_ALL_FAILURE')
            .then(function (message) {
              showToast(message);
            });
          initUpdateState();
        }
      }

    }

    /**
     * Called when one of the calls to power off a single
     * device has been completed regardless of sucess or failure.
     */

    function powerOnAllCallback(results) {
      if (results.isComplete()) {
        hideProgress();
        if (results.failCount() == 0) {
          $translate('POWER_ON_ALL_SUCCESS')
            .then(function (message) {
              showToast(message);
            });
          initUpdateState();
        } else {
          $translate('POWER_ON_ALL_FAILURE')
            .then(function (message) {
              showToast(message);
            });
          initUpdateState();
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
