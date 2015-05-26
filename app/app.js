'use strict';

var GS1App = angular.module("GS1App", [
  'ngRoute', 
  'index',
  'edit',
  'show',
  'create',
  'schema_show',
  'schema_edit',
  'categories_index'
]);

var domain = "http://gs1-api.cloudapp.net:8080";
var token = "f76b2ca2bd9b50f51e894ffd18708bc9";
var lang = "en"

//var domain = "http://localhost:3000";
//var token = "8108730b909de6d7315201e291b3bb0b";

//var domain = "http://gs1-api.cloudapp.net";
//var token = "0069db092633f82d97025999d7ba28d9";

GS1App.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/products', {
    templateUrl: 'partials/index.html',
    controller: 'indexController'
  })
  .when('/products/edit/:gtin', {
    templateUrl: 'partials/product-edit.html',
    controller: 'productEditController'
  })
  .when('/products/new', {
    templateUrl: 'partials/product-new.html',
    controller: 'productCreateController'
  })
  .when('/products/:gtin', {
    templateUrl: 'partials/product-show.html',
    controller: 'productShowController'
  })
  .when('/schemas/edit/:category', {
    templateUrl: 'partials/schema-edit.html',
    controller: 'schemaEditController'
  })
  .when('/schemas/:category', {
    templateUrl: 'partials/schema-show.html',
    controller: 'schemaShowController'
  })
  .when('/categories/', {
    templateUrl: 'partials/categories-index.html',
    controller: 'categoriesController'
  })
  .otherwise({redirectTo: '/products'});
}]);

GS1App.factory('gs1Factory', ['$http', function($http) {
  var factory = {};
  
  factory.getProducts = function(search_params){
    return $http({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token token="'+token+'"',
        'Accept-Language': lang
      },
      params: search_params,
      url: domain+"/v1/products/"
    });
  };

  factory.getProduct = function(gtin){
    return $http({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token token="'+token+'"',
        'Accept-Language': lang
      },
      params: {},
      url: domain+"/v1/products/"+gtin
    });
  };

  factory.updateProduct = function(product){
    return $http({
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token token="'+token+'"',
        'Accept-Language': lang
      },
      params: {},
      data: {product: product},
      url: domain+"/v1/products/"+product.gtin
    });
  }; 

  factory.deleteProduct = function(gtin){
    return $http({
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token token="'+token+'"',
        'Accept-Language': lang
      },
      url: domain+"/v1/products/"+gtin
    });
  };  

  factory.createProduct = function(product){
    return $http({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token token="'+token+'"',
        'Accept-Language': lang
      },
      params: {},
      data: {product: product},
      url: domain+"/v1/products/"
    });
  };  

  factory.uploadImageToProduct = function(file, gtin){
    var uploadUrl = domain+"/v1/products/"+gtin+"/photos/";
    var fd = new FormData();
    fd.append('photo', file);
    $http.post(uploadUrl, fd, {
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined,
        'Authorization': 'Token token="'+token+'"',
        'Accept-Language': lang
      }
    })
    .success(function(){
    })
    .error(function(){
    });
  };

  factory.deletePhoto = function(url, gtin){
    return $http({
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token token="'+token+'"',
        'Accept-Language': lang
      },
      url: domain+"/v1/products/"+gtin+"/photos/"+encodeURIComponent(url),
    });
  };

  return factory;
}]);

GS1App.factory('gs1SchemasFactory', ['$http', function($http) {
  var factory = {};
  
  factory.getCategories = function(){
    return $http({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token token="'+token+'"',
        'Accept-Language': lang
      },
      params: {},
      url: domain+"/v1/categories/"
    });
  };

  factory.getSchemas = function(categories){
    return $http({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token token="'+token+'"',
        'Accept-Language': lang
      },
      params: {"categories[]": categories},
      url: domain+"/v1/schemas/"
    });
  };

  factory.getSchema = function(category){
    return $http({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token token="'+token+'"',
        'Accept-Language': lang
      },
      params: {},
      url: domain+"/v1/schemas/"+category
    });
  };

  factory.updateSchema = function(schema){
    return $http({
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token token="'+token+'"',
        'Accept-Language': lang
      },
      params: {},
      data: {schema: schema},
      url: domain+"/v1/schemas/"+schema.category
    });
  }; 

  factory.deleteSchema = function(category){
    return $http({
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token token="'+token+'"',
        'Accept-Language': lang
      },
      url: domain+"/v1/schemas/"+gtin
    });
  };  

  factory.createSchema = function(schema){
    return $http({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token token="'+token+'"',
        'Accept-Language': lang
      },
      params: {},
      data: {schema: schema},
      url: domain+"/v1/schemas/"
    });
  };  

  return factory;
}]);

GS1App.controller('gs1Controller', function($scope, $location, gs1Factory, gs1SchemasFactory) {
  $scope.m = {
    categories: [],
    products: [],
    image_file: null,
    keys: [],
    selected_product: {},
    selected_schema: {},
    arabic_selected_schema = {},
    new_product: {keys: [], values: []}
  };

  $scope.getProduct = function (gtin){
    gs1Factory.getProduct(gtin)
      .success(function(data){
        $scope.m.selected_product = data.product;
      })
      .error(function(error){
        $scope.error = "error retrieving data ...";
      });
  };

  $scope.addSchemaField = function() {
    $scope.m.selected_schema.schema_fields.push({
      key: "",
      name: "",
      type: "",
      description: "",
      possible_values: []
    });
  };

  $scope.getSchema = function(category) {
    lang = "en"
    gs1SchemasFactory.getSchema(category)
      .success(function(data){
        $scope.m.selected_schema = data.schema;
      })
      .error(function(){
        $scope.error = "error retrieving data ...";
      });
    lang = "ar"
    gs1SchemasFactory.getSchema(category)
      .success(function(data){
        $scope.m.arabic_selected_schema = data.schema;
      })
      .error(function(){
        $scope.error = "error retrieving data ...";
      });
  };

  $scope.getSchemas = function() {
    gs1SchemasFactory.getSchemas()
      .success(function(data){
        //something
      })
      .error(function(){
        $scope.error = "error retrieving data ...";
      })
  };

  
});

GS1App.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
