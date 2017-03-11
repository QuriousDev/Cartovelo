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
      var markers = [];
      $scope.city = $routeParams.city;
      var bounds = new google.maps.LatLngBounds();

      console.log("1")
      $http.get(apiBase + "/paths/list/city").then(function(res,status,xhr) {
        $scope.cities = res.data
      })

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
        $scope.map = new google.maps.Map(document.getElementById("map_canvas"),
            mapOptions);

        var json;
        $http.get(apiBase + "/paths/get/"+$scope.city+"/bike").then(function(res,status,xhr) {
          json = res.data;
          $scope.map.data.addGeoJson(json);
        })

        $scope.map.data.setStyle({
          strokeColor: 'green'
        });

        $scope.getIssues()
        setMapOnAll($scope.map)
      }

      $scope.getIssues = function(type, startDate, endDate) {
        function dateFilter(data, startDate, endDate){
          if(!startDate || !endDate){
            return true;
          }
          else{
            console.log(data)
            return new Date(data.date) >= new Date(startDate) && new Date(data.date) <= new Date(endDate);
          }
        }
        deleteMarkers()
        if(!type){
          $.getJSON(apiBase + "/issues", function(json1) {
            $.each(json1.issues, function(key, data) {
              if(data.status != "CLOSED" && dateFilter(data, startDate, endDate)){
                var latLng = new google.maps.LatLng(data.latitude, data.longitude);
                var marker = new google.maps.Marker({
                  position: latLng,
                  title: data.title,
                  id: data.id,
                });
                bounds.extend(marker.position);
                var markerContent = `
                  <div ng-controller="View1Ctrl">
                    <div>
                      <div class="col-md-6">
                        <a href="${data.image}">
                          <img src="${data.image}" style="width:100%; max-width:200px; max-height:200px">
                        </a>
                      </div>
                      <div class="col-md-6">
                        <p><b>${data.title}</b></p>
                        <p>
                          <label>
                            État : 
                          </label>
                          ${data.status}
                        </p>
                        <p>${data.description}</p>
                        <p><b>Commentaire</b>
                          <div>
                            <textarea ng-model="commentTextbox" class="form-control">${data.comment}</textarea>
                            <div ng-click="saveComment('${data.id}')" class="btn btn-primary">Sauvegarder</div>
                          </div>
                        </p>
                        <div ng-click="markResolved('${data.id}')" class="btn btn-success">
                          Marquer comme résolu
                        </div>
                      </div>
                  </div>
                `
                var compiledMarkerContent = $compile(markerContent)($scope)

                var infoWindow = new google.maps.InfoWindow({
                  content: compiledMarkerContent[0]
                });
                marker.addListener('click', function() {
                  infoWindow.open($scope.map, marker);
                });
                marker.setMap($scope.map);
                $scope.map.fitBounds(bounds);
                markers.push(marker);
              }
            });
          });
        }
        else{
        }
      }

      function deleteMarker(markerId) {
        for (var i=0; i<markers.length; i++) {
          if (markers[i].id.toString() === markerId.toString()) {
            markers[i].setMap(null);
          }
        }
      }

      $scope.markResolved = function(id){
        if(id){
          $http.put(apiBase + "/issues/"+id, {status: "CLOSED"} ).then(function(res, status, xhr) {
            deleteMarker(id)
            $scope.getIssues()
          });
        }
        else{

        }
      }

      $scope.filterDate = function() {
          $scope.getIssues(null, $scope.dateStart, $scope.dateEnd)
      }

      $scope.saveComment = function(id) {
        console.log($scope.commentTextbox)
        if($scope.commentTextbox){
          $http.put(apiBase + "/issues/"+id, {comment: $scope.commentTextbox} ).then(function(res, status, xhr) {
            $scope.getIssues()
          });
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
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
          markers[i] = null
        }
        markers = [];
      }

    }
]);