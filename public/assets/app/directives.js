miamApp
/** Toogle button directive */
.directive('toggleButton', ['console',
  function(console) {
    return function(scope, element, attrs) {
      console.info('toggleButton');
      if(element.data('popover-title'))
        element.popover({animation:true, placement:'bottom', trigger:'manual', title: element.data('popover-title')});

      scope.$watch(attrs.toggleButton, function(active) {
        console.info('toggleButton $watch');
        if(active) {
          element.addClass('active');
          element.popover('show');
        }
        else {
          element.removeClass('active');
          element.popover('hide');
        }
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

      var map = new google.maps.Map(element[0], mapOptions);

      if(attrs.mapCenterGeoloc && /true/i.test(attrs.mapCenterGeoloc)) {
        // Center on user location if available
        if(navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
          });
        }
      }

      scope.$broadcast('mapInitialized', map);
    };
}]);