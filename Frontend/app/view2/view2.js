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

      $scope.city = $routeParams.city

      $scope.issues = []
      $http.get(apiBase + "/issues/" + $scope.city).then(function(res,status,xhr) {
        $scope.issues = res.data.issues
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

      $scope.filterType = function (issue) {
        return $scope.filterTypeItems[issue.title];
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

      $scope.filterStatus = function (issue) {
        return $scope.filterStatusItems[issue.status];
      };

      $scope.filterDate = function (issue) {
          if(issue.date) var issueDate = new Date(issue.date);
          if($scope.startDate) var s = new Date($scope.startDate);
          if($scope.endDate) var e = new Date($scope.endDate);
          if ( issueDate === null ) return true;
          if ( s === undefined && e === undefined) return true;
          if ( s === undefined && e !== undefined){
            return issueDate <= e;
          }
          if ( s !== undefined && e === undefined){
            return issueDate >= s;
          }
          if (issueDate >= s && issueDate <= e) return true;
          return false;
      }

      $scope.save = function(issue) {
        $http.put(apiBase + "/issues/"+issue.id, {status: issue.status, comment: issue.comment} ).then(function(res, status, xhr) {
          if(res.status == 204)
            ngToast.success('Informations mises à jour avec succès.');
          else
            ngToast.error('Erreur lors de la sauvegarde des informations.');
        })
      }
    }
])