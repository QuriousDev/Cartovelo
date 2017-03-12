'use strict';

angular.module('myApp.view2', ['ngRoute', 'ngToast'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2/:city', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])

.controller('View2Ctrl', 
  [
    '$scope',
    '$routeParams',
    '$http',
    '$compile',
    'ngToast',
    function ($scope, $routeParams, $http, $compile, ngToast) {
      $scope.issues = [];
      $scope.city = $routeParams.city;

      $scope.original_city = $routeParams.city

      // get cities list
      $http.get(apiBase + "/users").then(function(res,status,xhr) {
        $scope.cities = res.data
      })


      $scope.qissues2 = {}
      // ec2-52-14-137-171.us-east-2.compute.amazonaws.com:3000/api/issues/
      $http.get(apiBase + "/issues/" + $scope.original_city).then(function(res,status,xhr) {
        console.log(res.data)
        $scope.qissues2 = res.data.issues
      })

      var bounds = new google.maps.LatLngBounds();
      var infoWindow = new google.maps.InfoWindow();

      $http.get(apiBase + "/users").then(function(res,status,xhr) {
        $scope.cities = res.data
      })

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

                marker.setMap($scope.map);
                $scope.map.fitBounds(bounds);
                $scope.issues.push(marker);
              }
            });
          });
        }
        else{
        }
        console.log("get issues")
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
        for (var i=0; i<$scope.issues.length; i++) {
          if($scope.issues[i].id == markerId){
            $scope.issues[i].setMap(null);
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
        console.log($scope.issues)
        $scope.getIssues()
      }

      function setMapOnAll(map) {
        for (var i = 0; i < $scope.issues.length; i++) {
          $scope.issues[i].setMap(map);
        }
      }

      // Removes the $scope.issues from the map, but keeps them in the array.
      function clearMarkers() {
        setMapOnAll(null);
      }

      // Shows any $scope.issues currently in the array.
      function showMarkers() {
        setMapOnAll(map);
      }

      // Deletes all $scope.issues in the array by removing references to them.
      function deleteMarkers() {
        for (var i = 0; i < $scope.issues.length; i++) {
          $scope.issues[i].setMap(null);
          $scope.issues[i] = null
        }
        $scope.issues = [];
      }

    }
]);