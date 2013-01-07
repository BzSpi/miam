angular.directive('myDirective',function($compile) {
  return {
    templateUrl : 'templates/infowindow.html', //(optional) the contents of this template can be downloaded and constructed into the element
    replace : true, //whether or not to replace the inner data within the element
    link : function($scope, $element, attributes) { //this is where your magic happens
      
    }
  };
});

