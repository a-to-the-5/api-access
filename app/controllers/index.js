angular.module('index', ['ngRoute'])

.controller('indexController', function($scope, gs1Factory, gs1SchemasFactory) {

  $scope.m.category = "";
  $scope.m.brand = "";
  $scope.m.supplier = "";
  $scope.m.fields = [];
  $scope.m.page = 1;

  $scope.getProducts = function (search_params){
    if(!search_params)
      search_params = {};
    gs1Factory.getProducts(search_params)
      .success(function(data){
        $scope.m.products = data.products;
        $scope.m.keys = $scope.collectKeys(data.products);
      })
      .error(function(error){
        $scope.error = "error retrieving data ...";
      });
  };

  $scope.deleteProduct = function (gtin){
    gs1Factory.deleteProduct(gtin)
      .success(function(data){
        $scope.getProducts();
      })
      .error(function(error){
        $scope.error = "error retrieving data ...";
      });
  };

  $scope.searchProducts = function(){
    var search_params = {};
    if($scope.m.category!=="")
      search_params["category"] = $scope.m.category;
    if($scope.m.brand!=="")
      search_params["brand"] = $scope.m.brand;
    if($scope.m.supplier!=="")
      search_params["supplier"] = $scope.m.supplier;
    if($scope.m.fields!==[])
      search_params["fields[]"] = $scope.m.fields;
    search_params["page"] = $scope.m.page;
    console.log($scope.m.fields);
    $scope.getProducts(search_params);
  };
  
  $scope.previousPage = function(){
    if($scope.m.page>0){
      $scope.m.page--;
      $scope.searchProducts();
    }
  };

  $scope.nextPage = function(){
    $scope.m.page++;
    $scope.searchProducts();
  };

  $scope.collectKeys = function (products) {
    var keys = [];
    for(var i = 0; i<products.length; i++){
      for (var key in products[i]) {
        if (products[i].hasOwnProperty(key)) {
          keys.push(key);
        }
      }
    }
    return keys.filter(function(item, i, ar){ return ar.indexOf(item) === i; });
  };

  $scope.$on('$routeChangeSuccess', function () {
    $scope.getProducts();
  });
  
});