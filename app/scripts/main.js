console.log('Roscoes a cutie');

(function(){

  angular.module('UPT', ['ngResource','ngRoute'])
    .constant({
      'DATA_SOURCE': src='data/October 2014 Adjusted Database/UPT-Table 1.csv'
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

      $routeProvider.when('/vrh', {
        templateUrl:'templates/mode.html',
        controller:'AddController'
      });

      $routeProvider.when('/tripshour', {
        templateUrl: 'templates/msa.html',
        controller: 'AddController'
      });

      $routeProvider.when('/vehmiles', {
        templateUrl: 'templates/vehmiles.html',
        controller: 'AddController'
      });




    })

}());
