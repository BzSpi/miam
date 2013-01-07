var miamApp = angular.module('miam', ['miamServices']).
  factory('navigator', ['$window', function($window) {
    return $window.navigator;
  }]);

/*.
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.
        when('/places', {templateUrl: 'views/places-list.html', controller: PhoneListCtrl}).
        when('/places/:placeId', {templateUrl: 'views/place-detail.html', controller: PhoneDetailCtrl}).
        otherwise({redirectTo: '/phones'});
}])*/;