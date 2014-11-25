console.log('Roscoes a cutie');

(function(){

  angular.module('UPT', ['ngRoute'])
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




    })

}());
