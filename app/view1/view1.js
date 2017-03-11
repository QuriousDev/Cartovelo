'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1/:city', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', 
  [
    '$scope',
    '$routeParams',
    '$http',
    '$compile',
    function ($scope, $routeParams, $http, $compile) {
      var map;
      var markers = [];
      var infoWindow;
      $scope.city = $routeParams.city;

      $scope.initMap = function() {
        var mapCenter = {
          "latitude": 45.381162,
          "longitude": -71.932712,
        }
        var mapOptions = {

          center: new google.maps.LatLng(mapCenter.latitude, mapCenter.longitude),
          zoom: 12,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("map_canvas"),
            mapOptions);

        var json;
        $http.get("http://ec2-52-14-137-171.us-east-2.compute.amazonaws.com:3000/api/paths/"+$scope.city+"/bike").then(function(res,status,xhr) {
          json = res.data;
          console.log(json)
          map.data.addGeoJson(json);
        })

        map.data.setStyle({
          strokeColor: 'green'
        });

        $scope.getIssues()
        setMapOnAll(map)
      }

      $scope.getIssues = function(type) {
        deleteMarkers()
        if(!type){
          console.log("fetching all issues")
          $.getJSON(apiBase + "/issues", function(json1) {
            $.each(json1.issues, function(key, data) {
              if(data.status != "CLOSED"){
                var latLng = new google.maps.LatLng(data.latitude, data.longitude);
                var marker = new google.maps.Marker({
                  position: latLng,
                  title: data.title,
                });
                var markerContent = `
                  <div ng-controller="View1Ctrl">
                    <a href="${data.image}">
                      <img src="${data.image}" style="width:100%; max-width:200px; max-height:200px">
                    </a>
                    <p>
                      <label>
                        Problème : 
                      </label>
                      ${data.title}
                    </p>
                    <p>
                      <label>
                        Description : 
                      </label>
                      ${data.description}
                    </p>
                    <p>
                      <label>
                        État : 
                      </label>
                      ${data.status}
                    </p>
                    <div ng-click="markResolved('${data.id}')" class="btn btn-primary">
                      Marquer comme résolu
                    </div>
                  </div>
                `
                var compiledMarkerContent = $compile(markerContent)($scope)

                infoWindow = new google.maps.InfoWindow({
                  content: compiledMarkerContent[0]
                });
                marker.addListener('click', function() {
                  infoWindow.open(map, marker);
                });
                marker.setMap(map);
                markers.push(marker);
              }
            });
          });
        }
        else{
          console.log(type)
        }
      }

      $scope.markResolved = function(id){
        if(id){
          $http.put(apiBase + "/issues/"+id, {status: "CLOSED"} ).then(function(res, status, xhr) {
            console.log("Issue " + id + " is now closed.")
            $scope.getIssues()
          });
        }
        else{

        }
      }

      function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
        }
      }

      // Removes the markers from the map, but keeps them in the array.
      function clearMarkers() {
        setMapOnAll(null);
      }

      // Shows any markers currently in the array.
      function showMarkers() {
        setMapOnAll(map);
      }

      // Deletes all markers in the array by removing references to them.
      function deleteMarkers() {
        clearMarkers();
        markers = [];
      }

    }
]);