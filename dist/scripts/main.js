console.log('Roscoes a cutie');

(function(){

  angular.module('UPT', ['ngResource','ngRoute'])
    .constant({
      'DATA_SOURCE': src='data/September 2014 Adjusted Database/UPT-Table 1.csv'
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
            $scope.agencies = results[0];

            var uptData = results[0];

            var month = results[1];

            var modes = ['CR', 'DR', 'HR', 'LR', 'MB', 'FB', 'TB'];
            console.log(modes);

            var color = d3.scale.ordinal()
            .range(["#001c9c","#101b4d","#475003","#9c8305","#d3c47c", 'green', 'steelblue']);


            color.domain(modes);

            var margin = {top: 20, right: 50, bottom: 30, left: 75},
            width = 1500 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

            var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

            var y = d3.scale.linear()
            .range([height, 0]);

            var xAxis = d3.svg.axis()
            .scale(x)
            .orient('bottom');

            var yAxis = d3.svg.axis()
            .scale(y)
            .orient('left');

            var line = d3.svg.line()
            .interpolate("cardinal")
            .x(function (d) { return x(d.month) + x.rangeBand() / 2; })
            .y(function (d) { return y(d.upt); });

            var color = d3.scale.ordinal()
            .range(["#001c9c","#101b4d","#475003","#9c8305","#d3c47c"]);

            // This creates the svg object

            var svg = d3.select('.chart').append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // This defines the axes

            x.domain(month.map(function(d){ return d }));
            y.domain([
              d3.min(uptData, function(c){
                return d3.min(c.trips, function(min){ return min.upt;});
              }),
              d3.max(uptData, function(c){
                return d3.max(c.trips, function(max){ return max.upt;});
              })
              ]);

            // This renders the axes

            svg.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate (0, ' + height + ')')
                .call(xAxis);

            svg.append('g')
                .attr('class', 'y axis')
                .call(yAxis)
              .append('text')
                .attr('transform', 'rotate(-90)')
                .attr('y', 6)
                .attr('dy', '.71em')
                .style('text-anchor', 'end')
                .text('Number of Unlinked Passenger Trips');

              // This renders the data

              var trips = svg.selectAll('.chart')
              .data(uptData)
              .enter().append('g')
              .attr('class', 'chart');

              trips.append('path')
              .attr('class', 'line')
              .attr('d', function(d) {return line(d.trips);})
              .style('stroke', function(d) { return color(d.Modes);})
              .style('stroke-width', '.2em')
              .style('fill', 'none');

              var legend = svg.selectAll('.legend')
                  .data(modes.slice().reverse())
                .enter().append('g')
                  .attr('class', 'legend')
                  .attr('transform', function(d, i){
                    return 'translate(55, ' + i * 20 + ')';
                  });

              legend.append('rect')
                  .attr('x', width - 10)
                  .attr('width', 10)
                  .attr('height', 10)
                  .style('fill', color)
                  .style('stroke', 'grey');

              legend.append('text')
                  .attr('x', width - 12)
                  .attr('y', 6)
                  .attr('dy', '.35em')
                  .style('text-anchor', 'end')
                  .text(function(d){ return d;});
          });

        };

        $scope.tripsPerhour = function(agency){
          DataFactory.searchAgency(agency).then(function(results){
            var uptData = results[3];
            var month = results[1];

            DataFactory.vehicleHours(agency).then(function(results){
              var vrhData = results[3];

              DataFactory.tripsPerhour(uptData, vrhData, month);

            });

          });

        };

        $scope.vehicleHours = function(agency){
          DataFactory.vehicleHours(agency).then(function(results){
            $scope.agencies = results[0];

            var vrhData = results[0];

            var month = results[1];

            var modes = ['CR', 'DR', 'HR', 'LR', 'MB', 'FB', 'TB'];
            console.log(modes);

            var color = d3.scale.ordinal()
            .range(["#001c9c","#101b4d","#475003","#9c8305","#d3c47c", 'green', 'steelblue']);

            color.domain(modes);

            var margin = {top: 20, right: 50, bottom: 30, left: 75},
            width = 1500 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

            var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

            var y = d3.scale.linear()
            .range([height, 0]);

            var xAxis = d3.svg.axis()
            .scale(x)
            .orient('bottom');

            var yAxis = d3.svg.axis()
            .scale(y)
            .orient('left');

            var line = d3.svg.line()
            .interpolate("cardinal")
            .x(function (d) { return x(d.month) + x.rangeBand() / 2; })
            .y(function (d) { return y(d.upt); });

            var color = d3.scale.ordinal()
            .range(["#001c9c","#101b4d","#475003","#9c8305","#d3c47c"]);

            // This creates the svg object

            var svg = d3.select('.chart').append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // This defines the axes

            x.domain(month.map(function(d){ return d }));
            y.domain([
              d3.min(vrhData, function(c){
                return d3.min(c.trips, function(min){ return min.upt;});
              }),
              d3.max(vrhData, function(c){
                return d3.max(c.trips, function(max){ return max.upt;});
              })
              ]);

              // This renders the axes

              svg.append('g')
              .attr('class', 'x axis')
              .attr('transform', 'translate (0, ' + height + ')')
              .call(xAxis);

              svg.append('g')
              .attr('class', 'y axis')
              .call(yAxis)
              .append('text')
              .attr('transform', 'rotate(-90)')
              .attr('y', 6)
              .attr('dy', '.71em')
              .style('text-anchor', 'end')
              .text('Number of Vehicle Revenue Miles');

              // This renders the data

              var trips = svg.selectAll('.chart')
              .data(vrhData)
              .enter().append('g')
              .attr('class', 'chart');

              trips.append('path')
              .attr('class', 'line')
              .attr('d', function(d) {return line(d.trips);})
              .style('stroke', function(d) { return color(d.Modes);})
              .style('stroke-width', '.2em')
              .style('fill', 'none');

              var legend = svg.selectAll('.legend')
              .data(modes.slice().reverse())
              .enter().append('g')
              .attr('class', 'legend')
              .attr('transform', function(d, i){
                return 'translate(55, ' + i * 20 + ')';
              });

              legend.append('rect')
              .attr('x', width - 10)
              .attr('width', 10)
              .attr('height', 10)
              .style('fill', color)
              .style('stroke', 'grey');

              legend.append('text')
              .attr('x', width - 12)
              .attr('y', 6)
              .attr('dy', '.35em')
              .style('text-anchor', 'end')
              .text(function(d){ return d;});
            });
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

           var data = d3.csv(DATA_SOURCE, function(error, data){

             var sel_agency = data.filter(function(entry){ //filters the data by agency name
               if (entry.Agency == agency.name){
                 response.push(entry);  //adds the data to the response array
               }
             });

             //console.log(response);

             // This creates an array of months

             var month = d3.keys(data[0])
             .filter(function(key){ return key!=='Modes'})
             .filter(function(key){ return key!=='NTDID'})
             .filter(function(key){ return key!=='Agency'})
             .filter(function(key){ return key!=='Active'})
             .filter(function(key){ return key!=='SSW'})
             .filter(function(key){ return key!=='UZA'})
             .filter(function(key){ return key!=='UZA Name'})
             .filter(function(key){ return key!=='TOS'});

             //  console.log(month);

            var modes = response.map(function(m){
              return {
                mode: m.Modes
              }

            });

             console.log(modes);
              // This creates an array used to call render the data
             var uptData = response.map(function (t){
               return {
                 agency: t.Agency,
                 mode:   t.Modes,
                 region: t.UZA,
                 trips: month.map(function(d){
                   return {month: d, upt: +t[d].replace(/,/g, '')}; //returns array of month and unlinked passenger trips as number
                 })
               };
             });

             console.log(uptData);

             var cleandata = [];

             cleandata.push(uptData);

             cleandata.push(month);

             cleandata.push(modes);

             cleandata.push(response);

             deferred.resolve(cleandata);

           });

           return deferred.promise;

       };

       var tripsPerhour = function(uptData, vrhData, month){
         console.log(uptData);
         console.log(vrhData);
         console.log(month);

         var tripspervrh = uptData.map(function(t){
           return {
            agency: t.Agency,
            region: t.UZA,
            mode: t.Modes,
            tripsperhour: month.map(function(d){
              return {month: d, triphour: +t[d].replace(/,/g, '')}
            })
           }
         });
         return uptData;
       };


      var vehicleHours = function(agency){

        console.log(agency);

        var response = [];
        var deferred = $q.defer();

        var data = d3.csv('data/September 2014 Adjusted Database/VRH-Table 1.csv', function(error, data){

          var sel_agency = data.filter(function(entry){ //filters the data by agency name
            if (entry.Agency == agency.name){
              response.push(entry);  //adds the data to the response array
            }
          });

          // This creates an array of months

          var month = d3.keys(data[0])
          .filter(function(key){ return key!=='Modes'})
          .filter(function(key){ return key!=='NTDID'})
          .filter(function(key){ return key!=='Agency'})
          .filter(function(key){ return key!=='Active'})
          .filter(function(key){ return key!=='SSW'})
          .filter(function(key){ return key!=='UZA'})
          .filter(function(key){ return key!=='UZA Name'})
          .filter(function(key){ return key!=='TOS'});

          var modes = response.map(function(m){
            return {
              mode: m.Modes
            }

          });

          // This creates an array used to call render the data
          var vrhData = response.map(function (t){
            return {
              agency: t.Agency,
              mode:   t.Modes,
              region: t.UZA,
              trips: month.map(function(d){
                return {month: d, upt: +t[d].replace(/,/g, '')}; //returns array of month and unlinked passenger trips as number
              })
            };
          });

          console.log(vrhData);

          var cleandata = [];

          cleandata.push(vrhData);

          cleandata.push(month);

          cleandata.push(modes);

          cleandata.push(response);

          deferred.resolve(cleandata);

        });

        return deferred.promise;

      };

      return {
        searchAgency: searchAgency,
        tripsPerhour: tripsPerhour,
        vehicleHours: vehicleHours,
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
