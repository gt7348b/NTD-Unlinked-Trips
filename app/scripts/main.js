console.log('Roscoes a cutie');

(function(){

  var name_array = [];

      var name_search = d3.csv('data/April 2015 Adjusted Database/VRH-Table 1.csv', function(error, data){

        // console.log(data);
        var name = [];

        data.filter(function(entry){ //filters the data by agency name

          //  console.log(entry.Modes);
            name_array.push(entry.Agency);  //adds the data to the name array

        });
        console.log(name);
        name_array.push(name);
      });

      console.log(name_array);
      
  angular.module('UPT', ['ngResource','ngRoute'])
    .constant({
      'DATA_SOURCE': src='data/April 2015 Adjusted Database/UPT-Table 1.csv'
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
