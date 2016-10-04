/**
* @module window-events
* 
* Directives to attach expressions to browser window events.
* 
* Stolen with pride from: http://www.bennadel.com/blog/2934-handling-window-blur-and-focus-events-in-angularjs.htm
* 
* @author Jonas <jonas.m.andreasson@gmail.com>
* @license MIT
*/


(function () {
  angular.module("window-events", [])
    .directive(
    "bnWindowBlur",
    function bnWindowBlurDirective($window, $log) {
      // Return the directive configuration object.
      return ({
        link: link,
        restrict: "A"
      });
      // I bind the JavaScript events to the view-model.
      function link(scope, element, attributes) {
        // Hook up blur-handler.
        var win = angular.element($window).on("blur", handleBlur);
        // When the scope is destroyed, we have to make sure to teardown
        // the event binding so we don't get a leak.
        scope.$on("$destroy", handleDestroy);
        // ---
        // PRIVATE METHODS.
        // ---
        // I handle the blur event on the Window.
        function handleBlur(event) {
          scope.$apply(attributes.bnWindowBlur);
          $log.debug("Window blurred.");
        }
        // I teardown the directive.
        function handleDestroy() {
          win.off("blur", handleBlur);
        }
      }
    }
    )
    .directive(
    "bnWindowFocus",
    function bnWindowFocusDirective($window, $log) {
      // Return the directive configuration object.
      return ({
        link: link,
        restrict: "A"
      });
      // I bind the JavaScript events to the view-model.
      function link(scope, element, attributes) {
        // Hook up focus-handler.
        var win = angular.element($window).on("focus", handleFocus);
        // When the scope is destroyed, we have to make sure to teardown
        // the event binding so we don't get a leak.
        scope.$on("$destroy", handleDestroy);
        // ---
        // PRIVATE METHODS.
        // ---
        // I teardown the directive.
        function handleDestroy() {
          win.off("focus", handleFocus);
        }
        // I handle the focus event on the Window.
        function handleFocus(event) {
          scope.$apply(attributes.bnWindowFocus);
          $log.debug("Window focused.");
        }
      }
    }
    )
    ;
})();