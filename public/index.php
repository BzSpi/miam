<?php

require_once(__DIR__.'/../config/config.php');

$mapConfig  = $config['map'];

?><!DOCTYPE html>
<html lang="en" data-ng-app="miam">
  <head>
    <meta charset="utf-8">
    <title>Miam!</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">

    <!-- Le styles -->
    <link href="assets/bootstrap/css/bootstrap.css" rel="stylesheet">
    <link href="assets/bootstrap/css/bootstrap-responsive.css" rel="stylesheet">
    <link href="assets/css/style.css" rel="stylesheet">

    <!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
      <script src="//html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->
  </head>

  <body data-ng-controller="MiamCtrl">

    <div id="navbar" class="navbar navbar-fixed-top">
      <div class="navbar-inner">
        <div class="container-fluid">
          <!--a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </a-->
          <a class="brand" href="#">Miam!</a>
          <p class="navbar-text pull-right">
            <input type="button" data-toggle-button="addMode" class="btn btn-primary" value="Add a new place" data-popover-placement="left" data-popover-content="Click on the map to add a new place" />
          </p>
            <!--ul class="nav">
              <li class="active"><a href="#">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul-->
        </div>
      </div>
    </div>

    <div id="container" class="container-fluid">
      <div class="row-fluid">
        <div id="list" class="span3">
          <div class="sidebar-nav">
            <fieldset class="form-inline" data-ng-controller="SearchCtrl">
              <div class="control-group">
                <label class="control-label" for="searchFilter">Search:</label>
                <input id="searchFilter" type="text" class="input-large" data-ng-model="placeFilter.$" placeholder="Search in the list" />
              </div>
              <div class="control-group">
                <label class="control-label" for="placeTypeFilter">Type:</label>
                <select id="placeTypeFilter" class="input-large" data-ng-model="placeFilter.type" data-ng-options="placeType.id as placeType.name for placeType in placeTypes">
                  <option value="">-- filter by place type --</option>
                </select>
              </div>
              <!--div class="control-group">
                <input type="checkbox" id="placeVisibilityFilter" data-ng-model="placeFilter.onlyVisible" value="1" />
                <label class="control-label" for="placeVisibilityFilter">List only visible places</label>
              </div-->
            </fieldset>
            <ul class="nav nav-list" data-ng-controller="PlacesListCtrl">
              <li data-ng-repeat="place in places | filter:placeFilter" data-ng-class-even="'even'" data-ng-class-odd="'odd'" data-ng-class="{ active: place.id == selectedPlaceId }">
                <a class="clearfix" href="#/places/{{place.id}}" data-ng-click="selectPlace(place)">
                  <img src="assets/img/blank.gif" width="32" height="37" data-ng-src="assets/img/icons/places/classic/{{place.type.label}}.png" alt="{{ place.type.name }}" />
                  <span class="text">
                    <span data-ng-bind="place.name"></span>
                    <small data-ng-bind="place.type.name"></small>
                  </span>
                </a>
              </li>
            </ul>
          </div><!--/.sidebar-nav -->
        </div><!--/span-->
        <div id="map" class="span9" data-ng-controller="MapCtrl">
          <div class="map" data-google-map="map" data-map-center-lat="<?php echo $mapConfig['center']['lat'] ?>" data-map-center-lng="<?php echo $mapConfig['center']['lng'] ?>" data-map-center-zoom="14" data-map-center-geoloc="true"></div>
          <script type="text/ng-template" id="infoWindow">
            <div class="infoWindow">
              <div class="modal-header">
                <h3>
                  <img ng-src="assets/img/icons/places/classic/{{selectedPlace.type.label}}.png" alt="{{ selectedPlace.type.name }}" />
                  {{ selectedPlace.name }}
                </h3>
              </div>
              <div class="modal-body">
                <p>{{ selectedPlace.description }}</p>
                <a ng-show="selectedPlace.link != ''" href="{{ selectedPlace.link }}" target="_blank">{{ selectedPlace.link }}</a>
              </div>
              <div class="modal-footer">
                <a href="#" class="btn btn-primary" ng-click="editPlace(selectedPlace)">Edit</a>
              </div>
            </div>
          </script>
        </div><!--/span-->
      </div><!--/row-->
    </div><!--/.fluid-container-->

    <div id="footer" class="navbar navbar-fixed-bottom">
      <div class="navbar-inner">
        <div class="pull-right">
          <a class="copyright" href="https://github.com/BzSpi/miam">Clone me on GitHub</a>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <form name="editForm" data-ng-controller="PlaceEditCtrl" class="modal hide fade form-horizontal" action="" method="POST" tabindex="-1" role="dialog">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
        <h3 id="myModalLabel">Edit</h3>
      </div>
      <div class="modal-body">
        <fieldset>
          <div class="control-group">
            <!-- Name -->
            <label class="control-label" for="name">Name</label>
            <div class="controls">
              <input type="text" id="name" name="name" required placeholder="" class="input-xlarge" data-ng-model="formPlace.name">
            </div>
          </div>

          <div class="control-group">
            <!-- Description -->
            <label class="control-label" for="description">Description</label>
            <div class="controls">
              <textarea id="description" name="description" required placeholder="" class="input-xlarge" rows="5" data-ng-model="formPlace.description"></textarea>
            </div>
          </div>

          <div class="control-group">
            <!-- Link -->
            <label class="control-label" for="link">Link</label>
            <div class="controls">
              <input type="text" id="link" name="link" placeholder="" class="input-xlarge" data-ng-model="formPlace.link">
            </div>
          </div>

          <div class="control-group">
            <!-- Type -->
            <label class="control-label" for="type">Type</label>
            <div class="controls">
              <select id="type" name="type" class="input-xlarge" data-ng-model="formPlace.placeTypeId" data-ng-options="placeType.id as placeType.name for placeType in placeTypes"></select>
            </div>
          </div>
        </fieldset>
      </div>
      <div class="modal-footer">
        <button class="btn" data-dismiss="modal">Close</button>
        <button class="btn btn-primary" data-ng-disabled="editForm.$invalid" data-ng-click="save()">Save changes</button>
      </div>
    </form>
    <!-- Le javascript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
    <script src="assets/bootstrap/js/bootstrap.min.js"></script>
    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.0.3/angular.min.js"></script>
    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.0.3/angular-resource.min.js"></script>
    <script src="//maps.googleapis.com/maps/api/js?sensor=true"></script>
    <script src="assets/js/skin.js"></script>
    <script src="assets/app/app.js"></script>
    <script src="assets/app/services.js"></script>
    <script src="assets/app/directives.js"></script>
    <script src="assets/app/controllers.js"></script>
  </body>
</html>
