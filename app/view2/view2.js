'use strict';

angular.module('myApp.view2', ['ngRoute', 'ngToast'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2/:city', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])

.controller('View2Ctrl', [  '$scope',
  '$routeParams',
  '$http',
  '$compile',
  'ngToast',
  function ($scope, $routeParams, $http, $compile, ngToast) {

  $scope.original_city = $routeParams.city

  // get cities list
  $http.get(apiBase + "/users").then(function(res,status,xhr) {
    $scope.cities = res.data
  })

  $scope.changeCity = function(city) {
      $scope.selectedCity = city;
  };

  $scope.qissues2 = {}
  // ec2-52-14-137-171.us-east-2.compute.amazonaws.com:3000/api/issues/
  $http.get(apiBase + "/issues/" + $scope.original_city).then(function(res,status,xhr) {
    console.log(res.data)
    $scope.qissues2 = res.data.issues
  })

}]);
