'use strict';
 
/***********************
 * Main controller
 ***********************/
var MiamCtrl = ['$rootScope', 'Place', '$scope', 'console',
function($rootScope, Place, $scope, console) {
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

  /***********************
   * Events
   ***********************/
  $scope.$watch('addMode', function(newValue) {
    console.log('$scope - addMode '+newValue);
    $rootScope.$broadcast('addMode', newValue);
  });

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
var PlacesListCtrl = ['$scope', 'console',
function($scope, console) {
  $scope.selectedPlaceId = null;
  
  $scope.$on('placeSelected', function(e, place) {
    console.info('PlacesListCtrl - placeSelected');
    $scope.selectedPlaceId = place !== null ? place.id : null;
  });
}];

/***********************
 * Search controller
 ***********************/
var SearchCtrl = ['$scope', '$rootScope', 'console',
function($scope, $rootScope, console) {
  $scope.$watch('placeFilter', function(newPlaceFilter, oldPlaceFilter, $scope) {
    console.info('SearchCtrl - placeFilter changed');
    if(newPlaceFilter.type === null) {
      delete $scope.placeFilter.type;
    }
    $rootScope.$broadcast('placeFilterChanged', newPlaceFilter);
  }, true);
  $scope.$watch('placeFilter.$', function(newPlaceFilter, oldPlaceFilter, $scope) {
    console.info('SearchCtrl - placeFilter.$');
    $rootScope.$broadcast('placeFilterChanged', $scope.placeFilter);
  }, true);
}];

/***********************
 * Edition controller
 ***********************/
var PlaceEditCtrl = ['$scope', '$element', '$rootScope', 'console',
function($scope, $element, $rootScope, console) {
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
var MapCtrl = ['$scope', '$compile', '$templateCache', '$filter', 'console',
function($scope, $compile, $templateCache, $filter, console) {
  $scope.markers = [];
  $scope.selectedPlace = null;

  $scope.infoWindow = new google.maps.InfoWindow({
    content: angular.element($templateCache.get('infoWindow'))[0]
  });
  google.maps.event.addListener($scope.infoWindow, 'closeclick', function() {
    $scope.selectPlace(null);
    $scope.$apply();
  });

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
    // Close and open infoWindow in order to readjust its size
    $scope.infoWindow.close();
    $scope.infoWindow.open($scope.map, marker);
  });
  
  $scope.$on('placeSelected', function(e, place) {
    console.info('MapCtrl - placeSelected');

    $scope.selectedPlace = place;

    if(!$scope.map)
      return;
    if($scope.infoWindow)
      $scope.infoWindow.close();

    if(place === null)
      return;

    $compile($scope.infoWindow.getContent())($scope);
    
    for(var i=0 ; i<$scope.markers.length ; i++) {
      if($scope.markers[i].place.id === place.id) {
        $scope.infoWindow.open($scope.map, $scope.findPlaceMarker(place));
        break;
      }
    }
  });

  $scope.$on('placeFilterChanged', function(e, placeFilter) {
    console.info('MapCtrl - placeFilterChanged');
    for(var i=0 ; i<$scope.markers.length ; i++) {
      if($filter('filter')([$scope.markers[i].place], placeFilter).length > 0) {
        // If place should appear
        $scope.markers[i].marker.setVisible(true);
        if($scope.selectedPlace && $scope.infoWindow && $scope.markers[i].place.id === $scope.selectedPlace.id) {
          if(!$scope.infoWindow.getMap()) { // Check if infoWindow is opened
            $scope.infoWindow.open($scope.map, $scope.markers[i].marker);
          }
        }
      } else {
        // If place should not appear
        $scope.markers[i].marker.setVisible(false);
        if($scope.selectedPlace && $scope.infoWindow && $scope.markers[i].place.id === $scope.selectedPlace.id) {
          $scope.infoWindow.close();
        }
      }
    };
  });

  $scope.$on('addMode', function(e, addMode) {
    console.info('MapCtrl - addMode');
  });

  /***********************
   * Functions
   ***********************/
  /**
   * Adds a marker on the map
   * 
   * @param Place place the place to add
   */
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

  /**
   * Finds a marker on the map from a place
   * 
   * @param Place place the place from which retrieve the map marker
   */
  $scope.findPlaceMarker = function(place) {
    for(var i=0 ; i<$scope.markers.length ; i++)
      if($scope.markers[i].place.id === place.id)
        return $scope.markers[i].marker;
  };
}];