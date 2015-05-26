angular.module('categories_index', ['ngRoute'])

.controller('categoriesController', function($scope, $location, $routeParams, gs1SchemasFactory) {
  $scope.getCategories = function (){
    gs1SchemasFactory.getCategories()
      .success(function(data){
        $scope.m.categories = data.categories;
      })
      .error(function(){
        $scope.error = "error retrieving data ...";
      });
  };

  $scope.$on('$routeChangeSuccess', function () {
    $scope.getCategories();
  });

});