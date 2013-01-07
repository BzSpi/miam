'use strict';
 
/**
 * Controller for places list
 */
var MiamCtrl = ['$scope', '$element', 'navigator', 'Place',
function($scope, $element, navigator, Place) {
  /***********************
   * Init
   ***********************/
  
  // Getting places
  $scope.places = Place.query();

  // Getting place types
  $scope.placeTypes = Place.types();

  // Initializing map
  $scope.addMode = false;
  $scope.currentPlace = { data: {} };
  
  var mapElt = $element.find('#map')[0];
  var mapOptions = {
    center: new google.maps.LatLng(-34.397, 150.644),
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  var initMap = function() { 
    $scope.map = new google.maps.Map(mapElt, mapOptions); 
    angular.forEach($scope.places, function(place) {
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
    });
  };

  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) { // Success
      mapOptions.center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      initMap();
    }, function() { // Error
      initMap();
    });
  }
  else {
    initMap();
  }

  $scope.infoWindow = null;
  // Initializing communication
  $scope.$watch('currentPlace.data', function(newPlace, oldPlace) {
    if(!$scope.map)
      return;
    if($scope.infoWindow)
      $scope.infoWindow.close();
    $scope.$evalAsync(function($scope) {
      $scope.infoWindow = new google.maps.InfoWindow({
          content: $element.find('#infoWindow').html()
      });
      $scope.infoWindow.open($scope.map, newPlace.marker);
    });
  });  
  
  /***********************
   * Functions
   ***********************/
  $scope.addPlace = function() {
    this.places.push({
      id: 42,
      name: 'Test',
      description: 'Test',
      type: 'fastfood'
    });
  };

  $scope.selectPlace = function(place) {
    this.currentPlace.data = place;
  };
}];
