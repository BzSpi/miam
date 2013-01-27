miamApp
/** Toogle button directive */
.directive('toggleButton', ['console', 
  function(console) {
    return function(scope, element, attrs) {
      console.info('toggleButton');

      scope.$watch(attrs.toggleButton, function(active) {
        console.info('toggleButton $watch');
        if(active)
          element.addClass('active');
        else
          element.removeClass('active');
      });

      element.bind('click', function() {
        console.log('toggleButton click');
        scope.$apply(function() {
          scope[attrs.toggleButton] = !element.hasClass('active');
        });
      });
    };
}])

/** Google Map directive */
.directive('googleMap', ['navigator', 'console', 
  function(navigator, console) {
    return function(scope, element, attrs) {
      console.info('googleMap');
      var mapOptions = {
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      if(attrs.mapCenterLat && attrs.mapCenterLng)
        mapOptions.center = new google.maps.LatLng(attrs.mapCenterLat, attrs.mapCenterLng);

      if(attrs.mapCenterZoom)
        mapOptions.zoom = parseInt(attrs.mapCenterZoom);

      scope.map = new google.maps.Map(element[0], mapOptions);

      if(attrs.mapCenterGeoloc && /true/i.test(attrs.mapCenterGeoloc)) {
        // Center on user location if available
        if(navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            scope.map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
          });
        }
      }
    };
}]);