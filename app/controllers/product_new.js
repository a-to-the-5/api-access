angular.module('create', ['ngRoute'])

.controller('productCreateController', function($scope, $location, $routeParams, gs1Factory) {
  $scope.createProduct = function (){
    gs1Factory.createProduct($scope.newProduct())
      .success(function(data){
        $scope.selected_product = data["product"];
        $scope.clearNewProduct();
        $location.path("products/"+$scope.selected_product.gtin);
      })
      .error(function(error){
        $scope.error = "error retrieving data ...";
      });
  };

  $scope.newProduct = function(){
    var product = {};
    for(var i = 0; i<$scope.m.new_product.keys.length; i++){
      product[$scope.m.new_product.keys[i]] = $scope.m.new_product.values[i];
    }
    return product;
  };

  $scope.addAttribute = function(){
    $scope.m.new_product.keys.push("");
    $scope.m.new_product.values.push("");
  };

  $scope.clearNewProduct = function(){
    $scope.m.new_product = {
      keys: ["gtin", "category", "brand", "supplier"], 
      values: ["","","",""]
    };
  };

  $scope.$on('$routeChangeSuccess', function () {
    $scope.clearNewProduct();
  });

});