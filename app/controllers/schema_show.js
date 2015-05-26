angular.module('schema_show', ['ngRoute'])

.controller('schemaShowController', function($scope,$routeParams, gs1SchemasFactory) {

  $scope.$on('$routeChangeSuccess', function () {
    $scope.m.selected_schema = {};
    $scope.m.selected_schema = $scope.getSchema($routeParams.category);
  });

});