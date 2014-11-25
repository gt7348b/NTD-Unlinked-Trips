console.log('Roscoes a cutie');

(function(){

  angular.module('UPT', ['ngResource','ngRoute'])
    .constant({
      'DATA_SOURCE': src='data/UPT1.json'
    })

    .config(function($routeProvider){

      $routeProvider.when('/', {
        templateUrl: 'templates/home.html',
        controller: 'MainController'
      });

      $routeProvider.when('/add', {
      templateUrl: 'templates/add-template.html',
      controller: 'AddController'
      });

      $routeProvider.when('/agency', {
        templateUrl:'templates/agency.html',
        controller: 'AddController'
      });

      $routeProvider.when('/mode', {
        templateUrl:'templates/mode.html',
        controller:'AddController'
      });

      $routeProvider.when('/msa', {
        templateUrl: 'templates/msa.html',
        controller: 'AddController'
      });




    })

}());

(function(){}(


));

(function(){

  angular.module('UPT')
    .controller('AddController', ['$scope', 'DataFactory',
      function($scope, DataFactory){

        console.log("hey - i'm in the add controller")

        $scope.searchAgency = function(agency){
          DataFactory.searchAgency(agency);
        };

        $scope.searchMSA = function(msa){
          DataFactory.searchMSA(msa);
        };

        $scope.selectModes = function(modes){
          DataFactory.selectModes(modes);
        };


      }]);



}());

(function(){

  angular.module('UPT')
    .factory('DataFactory', ['$resource','DATA_SOURCE',
      function($resource, DATA_SOURCE){


       var searchAgency = function(agency){
         console.log(agency);
         $http.get('data/UPT1.json').success(function(data){
           console.log(data);
         });
       };

       var searchMSA = function(msa){
         console.log(msa);
       };

      var selectModes = function(modes){
        console.log(modes);
        console.log(DATA_SOURCE);
      };


      return {
        searchAgency: searchAgency,
        searchMSA:    searchMSA,
        selectModes:  selectModes,
        }

    }]);

}());

(function(){}(


));

(function(){}(


));

(function(){

  angular.module('UPT')
    .controller('MainController', ['$scope', function($scope){

      //console.log("main!");

    }])

}());

(function(){}(


));
