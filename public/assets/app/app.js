var miamApp = angular.module('miam', ['miamServices']).
  factory('navigator', ['$window', function($window) {
    return $window.navigator;
  }]).
  factory('console', ['$window', function($window) {
      return {
        log: function(m) {
          this._log('log', m);
        },
        info: function(m) {
          this._log('info', m);
        },
        debug: function(m) {
          this._log('debug', m);
        },
        error: function(m) {
          this._log('error', m);
        },
        warn: function(m) {
          this._log('warn', m);
        },
        _log: function(method, message) {
          if($window.console && typeof($window.console[method]) === 'function')
            $window.console[method](message);
        }
      };
}]);

/*.
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.
        when('/places', {templateUrl: 'views/places-list.html', controller: PhoneListCtrl}).
        when('/places/:placeId', {templateUrl: 'views/place-detail.html', controller: PhoneDetailCtrl}).
        otherwise({redirectTo: '/phones'});
}])*/;