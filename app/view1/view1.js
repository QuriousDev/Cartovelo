'use strict';

angular.module('myApp.view1', ['ngRoute', 'ngToast'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1/:city', {
    templateUrl: 'view1/view1.ng.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl',
  [
    '$scope',
    '$routeParams',
    '$http',
    '$compile',
    'ngToast',
    function ($scope, $routeParams, $http, $compile, ngToast) {
      $scope.markers = [];
      $scope.city = $routeParams.city;
      $scope.original_city = $routeParams.city
      var bounds = new google.maps.LatLngBounds();
      var infoWindow = new google.maps.InfoWindow();

      $http.get(apiBase + "/users").then(function(res,status,xhr) {
        $scope.cities = res.data
      })

      $scope.initMap = function() {
        var mapCenter = {
          "latitude": 35,
          "longitude": 0
        }
        var mapOptions = {

          center: new google.maps.LatLng(mapCenter.latitude, mapCenter.longitude),
          zoom: 2,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          maxZoom: 18,
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
          $.getJSON(apiBase + "/issues/"+$scope.city, function(json1) {
            $.each(json1.issues, function(key, data) {
              if(dateFilter(data, startDate, endDate)){
                var latLng = new google.maps.LatLng(data.latitude, data.longitude);

                var markerContent = `
                  <div>
                    <div>
                      <a href="${data.image}">
                        <img src="${data.image}" style="width:100%; max-width:200px; max-height:200px">
                      </a>
                      <hr>
                      <p><b>${data.title}</b></p>
                      <p>
                        <label class="label label-default">
                          ${data.status}
                        </label>
                      </p>
                      <p>${data.description}</p>
                      <p><b>Commentaire</b>
                        <div>
                          <textarea ng-model="issue.comment" class="form-control"></textarea>
                          <div ng-click="saveComment('${data.id}')" class="btn btn-primary">Sauvegarder</div>
                        </div>
                      </p>
                      <div ng-click="markResolved('${data.id}')" class="btn btn-success">
                        Marquer comme résolu
                      </div>
                  </div>
                `
                var compiledMarkerContent = $compile(markerContent)($scope)

                var pinIcon;
                if(data.status == "CLOSED")
                  pinIcon = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'

                var marker = new google.maps.Marker({
                  position: latLng,
                  title: data.title,
                  id: data.id,
                  icon: pinIcon,
                  infoWindowContent: compiledMarkerContent[0]
                });

                bounds.extend(marker.position);

                marker.addListener('click', function() {
                  $scope.issue = {}
                  $scope.issue.id = data.id
                  $scope.issue.comment = data.comment
                  $scope.issue.title = data.title
                  $scope.issue.description = data.description
                  $scope.issue.status = data.status
                  $scope.$apply()
                  infoWindow.setContent(this.infoWindowContent);
                  infoWindow.open($scope.map, marker);
                });
                marker.setMap($scope.map);
                $scope.map.fitBounds(bounds);
                $scope.markers.push(marker);
              }
            });
          });
        }
        else{
        }
      }

      function deleteMarker(markerId) {
        for (var i=0; i<$scope.markers.length; i++) {
          if($scope.markers[i].id == markerId){
            $scope.markers[i].setMap(null);
          }
        }
      }

      $scope.changeCity = function(city) {
          $scope.selectedCity = city;
      };

      $scope.markResolved = function(id){
        if(id){
          $http.put(apiBase + "/issues/"+id, {status: "CLOSED"} ).then(function(res, status, xhr) {
            if(res.status == 204)
              ngToast.success('Marqué comme résolu avec succès.');
            else
              ngToast.error('Erreur!');
            console.log(id)
            deleteMarker(id)
          });
        }
      }

      $scope.filterDate = function() {
          $scope.getIssues(null, $scope.dateStart, $scope.dateEnd)
      }

      $scope.saveComment = function(id) {
        console.log($scope.issue.comment)
        if($scope.issue.comment){
          $http.put(apiBase + "/issues/"+id, {comment: $scope.issue.comment} ).then(function(res, status, xhr) {
            if(res.status == 204)
              ngToast.success('Commentaire sauvegardé avec succès.');
            else
              ngToast.error('Erreur lors de la sauvegarde.');
          });
        }
        if(infoWindow){
          infoWindow.close();
        }
        $scope.getIssues()
      }

      function setMapOnAll(map) {
        for (var i = 0; i < $scope.markers.length; i++) {
          $scope.markers[i].setMap(map);
        }
      }

      // Removes the $scope.markers from the map, but keeps them in the array.
      function clearMarkers() {
        setMapOnAll(null);
      }

      // Shows any $scope.markers currently in the array.
      function showMarkers() {
        setMapOnAll(map);
      }

      // Deletes all $scope.markers in the array by removing references to them.
      function deleteMarkers() {
        for (var i = 0; i < $scope.markers.length; i++) {
          $scope.markers[i].setMap(null);
          $scope.markers[i] = null
        }
        $scope.markers = [];
      }

    }
]);
