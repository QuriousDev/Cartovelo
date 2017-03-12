'use strict';

angular.module('myApp.view1', ['ngRoute', 'ngToast', 'ngMaterial'])

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
          styles: [
              {
                  "featureType": "administrative",
                  "elementType": "all",
                  "stylers": [
                      {
                          "visibility": "simplified"
                      }
                  ]
              },
              {
                  "featureType": "landscape",
                  "elementType": "geometry",
                  "stylers": [
                      {
                          "visibility": "simplified"
                      },
                      {
                          "color": "#fcfcfc"
                      }
                  ]
              },
              {
                  "featureType": "poi",
                  "elementType": "geometry",
                  "stylers": [
                      {
                          "visibility": "simplified"
                      },
                      {
                          "color": "#fcfcfc"
                      }
                  ]
              },
              {
                  "featureType": "road.highway",
                  "elementType": "geometry",
                  "stylers": [
                      {
                          "visibility": "simplified"
                      },
                      {
                          "color": "#dddddd"
                      }
                  ]
              },
              {
                  "featureType": "road.arterial",
                  "elementType": "geometry",
                  "stylers": [
                      {
                          "visibility": "simplified"
                      },
                      {
                          "color": "#dddddd"
                      }
                  ]
              },
              {
                  "featureType": "road.local",
                  "elementType": "geometry",
                  "stylers": [
                      {
                          "visibility": "simplified"
                      },
                      {
                          "color": "#eeeeee"
                      }
                  ]
              },
              {
                  "featureType": "water",
                  "elementType": "geometry",
                  "stylers": [
                      {
                          "visibility": "simplified"
                      },
                      {
                          "color": "#dddddd"
                      }
                  ]
              }
          ]
        };
        $scope.map = new google.maps.Map(document.getElementById("map_canvas"),
            mapOptions);

        var json;
        $http.get(apiBase + "/paths/get/"+$scope.city+"/bike").then(function(res,status,xhr) {
          json = res.data;
          $scope.map.data.addGeoJson(json);
        })

        console.log($scope.map.data)
        $scope.map.data.setStyle({
          strokeColor: 'green'
        });

        $scope.getIssues()
        console.log("init!")
        setMapOnAll($scope.map)
      }

      $scope.getIssues = function(type, startDate, endDate, status) {
        function dateFilter(data, startDate, endDate){
          if(!startDate)
            startDate = new Date("0001-01-01")
          if(!endDate)
            endDate = new Date("3000-01-01")
          return new Date(data.date) >= new Date(startDate) && new Date(data.date) <= new Date(endDate);
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
                      <p class="lead" style="margin:0;"><b>${data.description}</b></p>
                      <div style="margin-bottom:20px; margin-top:10px;">
                        <a href="${data.image}">
                          <img src="${data.image}" style="width:100%; max-width:200px; max-height:200px">
                        </a>
                      </div>
                      <div>
                        <b>État</b>
                        <select style="margin-bottom:20px;" ng-model="issue.status" class="form-control">
                          <option value="OPENED">Nouveau</option>
                          <option value="REVIEWING">En cours de révision</option>
                          <option value="REJECTED">Rejeté</option>
                          <option value="CLOSED">Résolu</option>
                        </select>
                      </div>
                      <p>
                        <b>Commentaire</b>
                        <textarea ng-model="issue.comment" class="form-control"></textarea>
                      </p>
                      <br>
                      <div ng-click="save('${data.id}');" class="pull-right btn btn-primary">Sauvegarder</div>
                  </div>
                `
                var compiledMarkerContent = $compile(markerContent)($scope)

                var pinIcon;
                if(data.status == "CLOSED")
                  pinIcon = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'

                var marker = new google.maps.Marker({
                  position: latLng,
                  type: data.title,
                  id: data.id,
                  icon: pinIcon,
                  status: data.status,
                  infoWindowContent: compiledMarkerContent[0]
                });

                bounds.extend(marker.position);

                marker.addListener('click', function() {
                  updateCurrentIssueScope(data)
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

      function updateCurrentIssueScope(data){
        $scope.issue = {}
        $scope.issue.id = data.id
        $scope.issue.comment = data.comment
        $scope.issue.title = data.title
        $scope.issue.description = data.description
        $scope.issue.status = data.status
        $scope.$apply()
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

      $scope.filterDate = function() {
          $scope.getIssues(null, $scope.dateStart, $scope.dateEnd)
      }

      $scope.save = function(id) {
        if($scope.issue.comment){
          $http.put(apiBase + "/issues/"+id, {status: $scope.issue.status, comment: $scope.issue.comment} ).then(function(res, status, xhr) {
            if(res.status == 204)
              ngToast.success('Commentaire sauvegardé avec succès.');
            else
              ngToast.error('Erreur lors de la sauvegarde.');
          });
        }
        if(infoWindow){
          infoWindow.close();
        }
        deleteMarkers()
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
