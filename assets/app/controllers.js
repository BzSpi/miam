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
  $rootScope.addPlace = function() {
    this.places.push({
      id: 42,
      name: 'Test',
      description: 'Test',
      type: 'fastfood'
    });
  };

  $rootScope.editPlace = function(place) {
    console.info('$rootScope - editPlace()');
    $rootScope.editedPlace = place;
    $rootScope.formPlace = {
      id: place.id,
      name: place.name,
      description : place.description,
      link: place.link,
      type: place.type
    };
    //$rootScope.formPlace = place;
    jQuery('#editModal').modal('show');
  };

  $rootScope.selectPlace = function(place) {
    console.info('$rootScope - selectPlace()');
    $rootScope.$broadcast('placeSelected', place);
  };

  $rootScope.savePlace = function(place) {
    console.info('$rootScope - savePlace()');
    //$rootScope.editedPlace = place;
    $rootScope.editedPlace.name = place.name;
    $rootScope.editedPlace.description = place.description;
    $rootScope.editedPlace.link = place.link;
    $rootScope.editedPlace.type = place.type;
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

var SearchCtrl = ['$scope', '$rootScope',
function($scope, $rootScope) {
  
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
  console.info('MapCtrl - $scope.$on(placeAdded)');
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
          title: place.name
    });
    google.maps.event.addListener(marker, 'click', function() {
      $scope.selectPlace(place);
      $scope.$apply();
    });
    place.marker = marker;
  };
}];