angular.module('show', ['ngRoute'])

.controller('productShowController', function($scope,$routeParams, gs1Factory) {

  $scope.$on('$routeChangeSuccess', function () {
    $scope.m.selected_product = {};
    $scope.m.selected_product = $scope.getProduct($routeParams.gtin);
  });

});