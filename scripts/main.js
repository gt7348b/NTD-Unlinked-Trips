console.log('Roscoes a cutie');

(function(){

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

      $routeProvider.when('/results', {
        templateUrl: 'templates/search_results.html',
        controller: 'AddController'
      });




    })

}());

(function(){}(


));

(function(){

  angular.module('UPT')
    .controller('AddController', ['$scope', '$location','$rootScope','DataFactory',
      function($scope, $location, $rootScope, DataFactory){

        var agency_response = [],
        msa_response = [],
        mode_response = [];

        console.log("hey - i'm in the add controller")

        $scope.searchAgency = function(agency){
          DataFactory.searchAgency(agency).then(function(results){

            $scope.agencies = results;

            var width = 960,
                height = 500;

            var x = d3.scale.ordinal()
                .rangeRoundBands([0, width], .1);

            var y = d3.scale.linear()
                .range([height, 0]);

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient('bottom');

                d3.select(".chart")
                .selectAll("div")
                .data(results)
                .enter().append("div")
                .style("width", function(d) { return y(d) + "px"; })
                .text(function(d) { return d; });

        //    chart.append('x')
          //      .attr('class', 'x axis')
                //.attr('transform', 'translate(0,' + height')')
            //    .call(xAxis);

            console.log(d3.selectAll(results));

    //        d3.select(results, function(error, data){
    //          console.log("I'm in the d3.select function");
    //        })

          });

        };

        $scope.searchMSA = function(msa){
          DataFactory.searchMSA(msa).then(function(results){
            $scope.agencies = results;
          });
        };

        $scope.selectModes = function(modes){
          DataFactory.selectModes(modes);
        };


      }]);



}());

(function(){

  angular.module('UPT')
    .factory('DataFactory', ['$q','$location','DATA_SOURCE',
      function($q, $location, DATA_SOURCE){


       var searchAgency = function(agency){
           console.log(agency);

           var response = [];
           var deferred = $q.defer();

           $.getJSON(DATA_SOURCE).done(function(ntd_data){

             var sel_agency = ntd_data.filter(function(entry){ //filters the data by agency name
               if (entry.AGENCY == agency.name){
                 response.push(entry);  //adds the data to the response array
                 }
                });

             console.log(response);
             //return response;
             deferred.resolve(response);

           //}).done(function(response){
             //return $location.path('/results');

         });

         return deferred.promise;
       };

       var searchMSA = function(msa){
         console.log(msa);

         var msa_filter = [];
         var deferred = $q.defer();

         $.getJSON(DATA_SOURCE).done(function(ntd_data){

           ntd_data.forEach(function(entry){

             if (entry.UZA_NAME == msa.region){

               msa_filter.push(entry); //Adds results to array

             }   // This is the return of the if
           });
           console.log(msa_filter);
           //return msa_filter;
           deferred.resolve(msa_filter);
         });
         return deferred.promise;
       };


      var selectModes = function(modes){

        console.log(modes);

        var data = $.getJSON(DATA_SOURCE).done(function(ntd_data){

        //  ntd_data.forEach(function(entry){

          //  if (entry.UZA_NAME == modes.name)

          //});

        });

      };


      return {
        searchAgency: searchAgency,
        searchMSA:    searchMSA,
        selectModes:  selectModes,
        }

    }]);

}());

(function(){}(
//  angular.module('UPT')
  //  .controller('ModeController', [$scope, function($scope){

    //}])

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
