/**
 *
 * Render and manage a control panel control
 *
 * @author Jonas <jonas.m.andreasson@gmail.com>
 * @license MIT
 */
(function () {

  angular
    .module('ha-remote.panel')
    .directive('controlWidget', [function () {

      return {
        templateUrl: 'src/panel/views/control.html',
        restrict: 'AE',

        scope: {
          control: '='
        },

      };

    }])

} ());
