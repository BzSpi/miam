'use strict';
 
/**
 * Controller for places list
 */
var MiamCtrl = ['$rootScope', 'Place',
function($rootScope, Place) {
  $rootScope.places = Place.query({}, function(places) {
    console.info('Place.query success');
    angular.forEach(places, function(place) { 
      $rootScope.$broadcast('placeAdded', place);
    });
  });
  $rootScope.placeTypes = Place.types();
  $rootScope.addMode = false;
  $rootScope.placeFilter = {};
  
  /***********************
   * Functions
   ***********************/
  /*$rootScope.addPlace = function() {
    this.places.push({
      id: 42,
      name: 'Test',
      description: 'Test',
      type: 'fastfood'
    });
  };*/

  $rootScope.addPlace = function() {
    console.info('$rootScope - addPlace()');
    $rootScope.$broadcast('placeAdd');
  };

  $rootScope.editPlace = function(place) {
    console.info('$rootScope - editPlace()');
    $rootScope.$broadcast('placeEdit', place);
  };

  $rootScope.selectPlace = function(place) {
    console.info('$rootScope - selectPlace()');
    $rootScope.$broadcast('placeSelected', place);
  };

  /*$rootScope.$safeApply = function($scope, fn) {
    console.info('$rootScope - $safeApply()');
    $scope = $scope || $rootScope;
    fn = fn || function() {};
    if($scope.$$phase) {
      fn();
    }
    else {
      $scope.apply(fn);
    }
  };*/
}];

var PlacesListCtrl = ['$scope',
function($scope) {
  $scope.$on('placeSelected', function(e, place) {
    console.info('PlacesListCtrl - placeSelected');
  });
}];

var SearchCtrl = ['$scope',
function($scope) {
  $scope.$watch('placeFilter', function(newPlaceFilter, oldPlaceFilter, $scope) {
    console.info('SearchCtrl - placeFilter changed');
    if(newPlaceFilter.type === null) {
      delete $scope.placeFilter.type;
    }
  }, true);
}];

var PlaceEditCtrl = ['$scope', '$element',
function($scope, $element) {
  $element.on('hidden', function() { $scope.cancel(); });

  $scope.$on('placeEdit', function(e, place) {
    console.info('PlaceEditCtrl - placeEdit');
    // We don't use angular.copy, because of marker object
    $scope.editPlace = place;
    $scope.formPlace = {
      id: place.id,
      name: place.name,
      description : place.description,
      link: place.link,
      type: place.type
    };
    $element.modal('show');
  });

  $scope.cancel = function() {
    console.info('PlaceEditCtrl - cancel()');
    $scope.$broadcast('placeEditCancel', $scope.editPlace);
  };

  $scope.save = function() {
    console.info('PlaceEditCtrl - save()');
    angular.extend($scope.editPlace, $scope.formPlace);
    // TODO : manage icon change in map
    $element.modal('hide');
    $scope.$broadcast('placeEdited', $scope.editPlace);
  };
}];

var MapCtrl = ['$scope', '$element', '$compile', '$templateCache', 'navigator',
function($scope, $element, $compile, $templateCache, navigator) {
  var mapElt = $element.find('.map')[0];
  var mapOptions = {
    center: new google.maps.LatLng(-34.397, 150.644),
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  $scope.map = new google.maps.Map(mapElt, mapOptions); 

  // Center on user location if available
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      $scope.map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
    });
  }

  $scope.infoWindow = new google.maps.InfoWindow({
    content: angular.element($templateCache.get('infoWindow'))[0]
  });
  $scope.selectedPlace = null;

  // Initializing communication
  $scope.$on('placeAdded', function(e, place) {
    console.info('MapCtrl - placeAdded');
    $scope.addPlaceMarker(place);
  });
  
  $scope.$on('placeSelected', function(e, place) {
    console.info('MapCtrl - placeSelected');
    $scope.selectedPlace = place;

    if(!$scope.map)
      return;
    if($scope.infoWindow)
      $scope.infoWindow.close();

    $compile($scope.infoWindow.getContent())($scope);
    $scope.infoWindow.open($scope.map, place.marker);
  });

  $scope.addPlaceMarker = function(place) {
    console.info('MapCtrl - addPlaceMarker()');
    var marker = new google.maps.Marker({
          position: new google.maps.LatLng(place.lat, place.lng),
          map: $scope.map,
          title: place.name,
          icon: 'assets/img/icons/places/pointer/' + place.type + '.png',
          shadow: 'assets/img/icons/places/pointer/shadow.png'
    });
    google.maps.event.addListener(marker, 'click', function() {
      $scope.selectPlace(place);
      $scope.$apply();
    });
    place.marker = marker;
  };
}];