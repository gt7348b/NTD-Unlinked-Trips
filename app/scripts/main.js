console.log('Roscoes a cutie');

(function(){

  var agency_response = [],
  msa_response = [],
  mode_response = [];
  

  angular.module('UPT', ['ngResource','ngRoute'])
    .constant({
      'DATA_SOURCE': src='data/UPT_2.json'
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
