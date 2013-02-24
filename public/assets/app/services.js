angular.module('miamServices', ['ngResource']).
  factory('Place', ['$resource', function($resource) {
    return $resource('services/:placeId.php', {}, {
      query:  { method: 'GET', params:  { placeId: 'places' }, isArray: true },
      add:    { method: 'POST', params: { placeId: 'new' }},
      update: { method: 'POST', params: { placeId: 'update'}},
      types:  { method: 'GET', params:  { placeId: 'placeTypes' }, isArray: true }
    });
  }]);
