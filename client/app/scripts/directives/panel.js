/**
 * 
 * Render the control panel
 * 
 * @author Jonas <jonas.m.andreasson@gmail.com>
 * @license MIT
 */
(function () {

  angular
    .module('ha-remote.panel')
    .directive('panelWidget', [function () {

      return {
        templateUrl: 'views/panel.html',
        restrict: 'AE'
      };

    }])

} ());