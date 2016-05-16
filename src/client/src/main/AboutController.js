(function () {

  angular
    .module('ha-remote')
    .controller('AboutController',
    [
      'aboutService',
      '$log',
      '$translate',
      AboutController
    ]);

  /**
   * Main Controller for the Angular Material Starter App
   */
  function AboutController(aboutService, $log, $translate) {
    var self = this;

    // Load about info from server

    aboutService.load()
      .then(function (about) {

        self.copyrightYear = about.copyrightYear;
        self.copyrightHolders = about.copyrightHolders;
        self.version = about.version;
        self.packageInfos = about.modules;
        
      }, function (error) {
        // TODO: Show toast fail message    

      });
  }
})();
