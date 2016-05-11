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


    // Load controls configuration

    configService.load()
      .then(function (controls) {
        self.controls = controls;
        self.showProgress = false;
        self.showControls = true;
      }, function (error) {
        self.showProgress = false;
        self.showControls = false;
        $translate('CONFIG_LOAD_FAILED').then(function(message){
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
      .then(function(){
        self.showProgress = false;
        $translate( 'POWER_ON_SUCCESS', { control_caption: control.caption } )
          .then( function(message){
           showToast( message );
        });
      }, function(){
        self.showProgress = false;
        $translate( 'POWER_ON_FAILURE', { control_caption: control.caption } )
          .then( function(message){
           showToast( message );
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
      .then(function(){
        self.showProgress = false;
        $translate( 'POWER_OFF_SUCCESS', { control_caption: control.caption } )
          .then( function(message){
           showToast( message );
        });
      }, function(){
        self.showProgress = false;
        $translate( 'POWER_OFF_FAILURE', { control_caption: control.caption } )
          .then( function(message){
           showToast( message );
        });
      })
    }

    /**
    * Power off all controls
    */
    function powerOffAll() {
      $log.debug("Power off all clicked.");
      self.showProgress = true;

      var results = {
        sucessed: [],
        failed: [],

        isComplete: function (controlCount) {
          return sucessed + failed == controlCount;
        },

        failCount: function () {
          return failed.length;
        },

        sucessCount: function () {
          return sucessed.length;
        },

        addSucess: function (control) {
          sucessed.push(control);
        },

        addFailure: function (control) {
          failed.push(control)
        }
      }


      self.controls.forEach(function (control, id) {
        powerControlService.powerOff(control.id)
          .then(function () {
            if (id == self.controls.length - 1) {
              self.showProgress = false;
              showToast(control.caption + " powered off.");
            }
          }, function () {
            if (id == self.controls.length - 1) {
              self.showProgress = false;
            }
            showToast("Failed to power off " + control.caption + ".");
          })

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
