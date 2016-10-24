/**
 * A element directive that renders the about page.
 *
 * @author Jonas <jonas.m.andreasson@gmail.com>
 * @license MIT
 */
(function () {

  angular
    .module('ha-remote.about')
    .directive('aboutWidget', [function () {

      return {
        templateUrl: 'views/about.html',
        restrict: 'E'
      };

    }])

} ());
