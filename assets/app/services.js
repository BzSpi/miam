angular.module('miamServices', ['ngResource']).
  factory('Place', ['$resource', function($resource) {
    return $resource('services/:placeId.php', {}, {
      query: { method: 'GET', params:{ placeId: 'places' }, isArray: true },
      types: { method: 'GET', params:{ placeId: 'placeTypes' }, isArray: true }
    });
  }]);
