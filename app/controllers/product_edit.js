angular.module('edit', ['ngRoute'])

.controller('productEditController', function($scope, $location, $routeParams, gs1Factory) {
  $scope.updateProduct = function (product){
    gs1Factory.updateProduct(product)
      .success(function(data){
        $scope.m.selected_product = data.product;
      })
      .error(function(error){
        $scope.error = "error retrieving data ...";
      });
      $location.path("products/"+$scope.m.selected_product.gtin);
  };

  $scope.uploadImageToProduct = function() {
    var file = $scope.m.image_file;
    var gtin = $scope.m.selected_product.gtin;
    gs1Factory.uploadImageToProduct(file, gtin);
  };

  $scope.removePhoto = function(url) {
    var gtin = $scope.m.selected_product.gtin;
    gs1Factory.deletePhoto(url, gtin);
  };

  $scope.$on('$routeChangeSuccess', function () {
    $scope.m.selected_product = {};
    $scope.m.selected_product = $scope.getProduct($routeParams.gtin);
  });

});