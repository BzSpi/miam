'use strict';
 
/***********************
 * Main controller
 ***********************/
var MiamCtrl = ['$rootScope', 'Place',
function($rootScope, Place) {
  $rootScope.places = Place.query({}, function(places) {
    console.info('Place.query() success');
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

/***********************
 * Place list controller
 ***********************/
var PlacesListCtrl = ['$scope',
function($scope) {
  $scope.$on('placeSelected', function(e, place) {
    console.info('PlacesListCtrl - placeSelected');
  });
}];

/***********************
 * Search controller
 ***********************/
var SearchCtrl = ['$scope',
function($scope) {
  $scope.$watch('placeFilter', function(newPlaceFilter, oldPlaceFilter, $scope) {
    console.info('SearchCtrl - placeFilter changed');
    if(newPlaceFilter.type === null) {
      delete $scope.placeFilter.type;
    }
  }, true);
}];

/***********************
 * Edition controller
 ***********************/
var PlaceEditCtrl = ['$scope', '$element', '$rootScope',
function($scope, $element, $rootScope) {
  $scope.cancelFunc = function() { $scope.cancel(); };

  /***********************
   * Events
   ***********************/
  $scope.$on('placeEdit', function(e, place) {
    console.info('PlaceEditCtrl - placeEdit');
    $scope.editPlace = place;
    $scope.formPlace = angular.copy(place);
    $element.on('hide', $scope.cancelFunc);
    $element.modal('show');
  });

  /***********************
   * Functions
   ***********************/
  $scope.cancel = function() {
    console.info('PlaceEditCtrl - cancel()');
    $element.off('hide', $scope.cancelFunc);
    $rootScope.$broadcast('placeEditCancel', $scope.editPlace);
  };

  $scope.save = function() {
    console.info('PlaceEditCtrl - save()');
    angular.extend($scope.editPlace, $scope.formPlace);
    $element.off('hide', $scope.cancelFunc);
    $element.modal('hide');
    $rootScope.$broadcast('placeEdited', $scope.editPlace);
  };
}];

/***********************
 * Map Controller
 ***********************/
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

  $scope.markers = [];

  $scope.infoWindow = new google.maps.InfoWindow({
    content: angular.element($templateCache.get('infoWindow'))[0]
  });
  $scope.selectedPlace = null;

  /***********************
   * Events
   ***********************/
  $scope.$on('placeAdded', function(e, place) {
    console.info('MapCtrl - placeAdded');
    $scope.addPlaceMarker(place);
  });

  $scope.$on('placeEdited', function(e, place) {
    console.info('MapCtrl - placeEdited');
    var marker = $scope.findPlaceMarker(place);
    marker.setIcon('assets/img/icons/places/pointer/' + place.type + '.png');
    // Close and open infoWindow in order to readjust size
    $scope.infoWindow.close();
    $scope.infoWindow.open($scope.map);
  });
  
  $scope.$on('placeSelected', function(e, place) {
    console.info('MapCtrl - placeSelected');
    $scope.selectedPlace = place;

    if(!$scope.map)
      return;
    if($scope.infoWindow)
      $scope.infoWindow.close();

    $compile($scope.infoWindow.getContent())($scope);
    
    for(var i=0 ; i<$scope.markers.length ; i++) {
      if($scope.markers[i].place.id === place.id) {
        $scope.infoWindow.open($scope.map, $scope.findPlaceMarker(place));
        break;
      }
    }
  });

  /***********************
   * Functions
   ***********************/
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
    $scope.markers.push({place: place, marker: marker});
  };

  $scope.findPlaceMarker = function(place) {
    for(var i=0 ; i<$scope.markers.length ; i++)
      if($scope.markers[i].place.id === place.id)
        return $scope.markers[i].marker;
  };
}];