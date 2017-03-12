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

      $scope.city = $routeParams.city

      $scope.issues = []
      $scope.googleMarkers = []
      $scope.bounds = new google.maps.LatLngBounds();
      $scope.infowindow = new google.maps.InfoWindow({
          content: ''
      });

      $.getJSON(apiBase + "/issues/" + $scope.city, function(json) {
        $.each(json.issues, function(key, data) {
          var marker = new google.maps.Marker({
              title: data.title,
              position: new google.maps.LatLng(data.latitude, data.longitude),
              type: data.title,
              status: data.status,
              date: data.date,
              description: data.description
          });
          var markerContent = `
            <div>
              <div>
                <p class="lead" style="margin:0;"><b>${data.description}</b></p>
                <div style="margin-bottom:20px; margin-top:10px;">
                  <a href="${data.image}">
                    <img src="${data.image}" style="width:100%; max-width:200px; max-height:200px">
                  </a>
                </div>
            </div>
          `
          marker.setMap($scope.map);
          bounds.extend(marker.position);
          $scope.map.fitBounds(bounds);
          $scope.googleMarkers.push(marker);

          var compiled = $compile(markerContent)($scope);

          // Marker click listener
          google.maps.event.addListener(marker, 'click', (function (marker, compiled) {
              return function () {
                  $scope.infowindow.setContent(compiled);
                  $scope.infowindow.open($scope.map, marker);
              }
          })(marker, compiled[0]));
        })
      })

      $http.get(apiBase + "/users").then(function(res,status,xhr) {
        $scope.cities = res.data
      })

      $scope.filterTypeItems = {
        'circulation': true,
        'embuche': true,
        'signalisation': true,
        'bris': true
      };

      $scope.typeItems = [
        {name:'circulation', label: "Circulation"}, 
        {name:'embuche', label: "Embuche"}, 
        {name:'signalisation', label: "Signalisation"},
        {name:'bris', label: "Bris"},
      ];

      $scope.filterType = function () {
        var vals = Object.keys($scope.filterTypeItems).map(function(key) {
            return $scope.filterTypeItems[key];
        });
        for(var i=0; i < $scope.googleMarkers.length; i++){
          $scope.googleMarkers[i].setVisible(true);
          for(var j=0; j< vals.length; j++){
            if($scope.googleMarkers[i].type == Object.keys($scope.filterTypeItems)[j] && vals[j] == false){
              $scope.googleMarkers[i].setVisible(false);
            }
          }
        }
      };

      $scope.filterStatusItems = {
        'OPENED': true,
        'REVIEWING': true,
        'REJECTED': true,
        'CLOSED': true
      };
      $scope.statusItems = [
        {name:'REVIEWING', label: "Révision en cours"},
        {name:'OPENED', label: "Nouveau"}, 
        {name:'REJECTED', label: "Rejeté"},
        {name:'CLOSED', label: "Résolu"}
      ];

      $scope.filterStatus = function () {
        var vals = Object.keys($scope.filterStatusItems).map(function(key) {
            return $scope.filterStatusItems[key];
        });
        for(var i=0; i < $scope.googleMarkers.length; i++){
          $scope.googleMarkers[i].setVisible(true);
          for(var j=0; j< vals.length; j++){
            if($scope.googleMarkers[i].status == Object.keys($scope.filterStatusItems)[j] && vals[j] == false){
              $scope.googleMarkers[i].setVisible(false);
            }
          }
        }
      };

      $scope.filterDate = function () {
        if($scope.startDate) var s = new Date($scope.startDate);
        if($scope.endDate) var e = new Date($scope.endDate);

        for(var i=0; i < $scope.googleMarkers.length; i++){
          
          if($scope.googleMarkers[i].date) var markerDate = new Date($scope.googleMarkers[i].date);

          console.log("****************")
          console.log(markerDate)
          console.log(s)
          console.log(e)

          if ( markerDate === null ){
            console.log("1")
            $scope.googleMarkers[i].setVisible(true);
            return
          }

          if ( s === undefined && e === undefined){
            console.log("2")
            $scope.googleMarkers[i].setVisible(true);
            return
          }

          if ( s === undefined && e !== undefined){
            console.log("3")
            if(markerDate <= e){
              $scope.googleMarkers[i].setVisible(true);
              return
            }
          }
          if ( s !== undefined && e === undefined){
            console.log("4")
            if(markerDate >= s){
              $scope.googleMarkers[i].setVisible(true);
              return
            }
          }

          if (markerDate >= s && markerDate <= e){
            console.log("5")
            $scope.googleMarkers[i].setVisible(true);
            return
          }

          console.log("6")
          $scope.googleMarkers[i].setVisible(false);
        
        }
      }

      $scope.save = function(marker) {
        $http.put(apiBase + "/issues/"+marker.id, {status: marker.status, comment: marker.comment} ).then(function(res, status, xhr) {
          if(res.status == 204)
            ngToast.success('Informations mises à jour avec succès.');
          else
            ngToast.error('Erreur lors de la sauvegarde des informations.');
        })
      }

      // GOOGLE MAPS
      var bounds = new google.maps.LatLngBounds();
      var infoWindow = new google.maps.InfoWindow();

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

        $scope.map.data.setStyle({
          strokeColor: 'green'
        });
      }
    }

]);