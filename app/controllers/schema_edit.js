angular.module('schema_edit', ['ngRoute'])

.controller('schemaEditController', function($scope, $location, $routeParams, gs1SchemasFactory) {
  $scope.updateSchema = function (schema){
    gs1SchemasFactory.updateSchema(schema)
      .success(function(data){
        $scope.m.selected_schema = data.schema;
      })
      .error(function(error){
        $scope.error = "error retrieving data ...";
      });
      $location.path("schemas/"+$scope.m.selected_schema.category);
  };

  $scope.$on('$routeChangeSuccess', function () {
    $scope.m.selected_schema = {};
    $scope.m.selected_schema = $scope.getSchema($routeParams.category);
  });

});