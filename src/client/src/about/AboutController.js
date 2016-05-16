/**
 * Controller backs the ABOUT-WIDGET directive and renders the about
 * page. 
 * 
 * @author Jonas <jonas.m.andreasson@gmail.com>
 * @license MIT
 */

(function () {
  'use strict';
  
  angular
    .module('ha-remote.about')
    .controller('AboutController',
    [
      'aboutService',
      '$log',
      '$translate',
      AboutController
    ]);

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
