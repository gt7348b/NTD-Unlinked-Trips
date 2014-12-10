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

      $routeProvider.when('/vehmiles', {
        templateUrl: 'templates/vehmiles.html',
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


//        console.log("hey - i'm in the add controller")

        $scope.searchAgency = function(agency){

          $scope.agency = null;

          d3.select("svg")
          .remove();

          DataFactory.searchAgency(agency).then(function(results){


            $scope.agencies = results[0];

            var uptData = results[0];

            var month = results[1];

            var tripsArr = results[4];

            //console.log(tripsArr);

            //stack(tripsArr);

            var modes = ['CR', 'DR', 'HR', 'LR', 'MB', 'FB', 'TB'];

            var color = d3.scale.ordinal()
            .range(["#001c9c","hsla(113, 86%, 50%, 1)","hsla(360, 100%, 50%, 1)","hsla(275, 100%, 44%, 1)","hsla(247, 100%, 50%, 1)", 'green', 'steelblue']);

            color.domain(modes);

            var margin = {top: 20, right: 50, bottom: 50, left: 60},
            width = 1200 - margin.left - margin.right,
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

            var stack = d3.layout.stack()
                .offset('zero')
                .values(function(d){return d.trips; })
                .x(function (d) { return x(d.month) + x.rangeBand() / 2; })
                .y(function (d) { return y(d.upt); });

            var area = d3.svg.area()
                .interpolate('cardinal')
                .x(function (d) { return x(d.month) + x.rangeBand() / 2; })
                .y0(function (d) { return y(d.y0); })
                .y1(function (d) { return y(d.y0 + d.y); });


            stack(tripsArr);

            // This creates the svg object

            var svg = d3.select('.chart').append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



            // This defines the axes

            x.domain(month.map(function(d){ return d }));

            //This is for stacked bar
            //y.domain([0, d3.max(tripsArr, function(d){return d.total})]);

            // This is for line chart
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
                .call(xAxis)
                .selectAll('text')
                    .style('text-anchor', 'end')
                    .style('font-size', '.45em')
                    .attr('dx', '-.8em')
                    .attr('dy', '.15em')
                    .attr('transform', function(d){
                        return 'rotate(-65)'
                    });

            svg.append('g')
                .attr('class', 'y axis')
                .call(yAxis)
                // .selectAll('text')
                // .style('font-size', '.575em')
              .append('text')
                .attr('transform', 'rotate(-90)')
                .attr('y', 6)
                .attr('dy', '.71em')
                .style('text-anchor', 'end')
                .text('Number of Unlinked Passenger Trips');

              // This renders the grid

              svg.selectAll('line.y')
                  .data(y.ticks(10))
                  .enter().append('line')
                  .attr('class', 'y')
                  .attr('x1', 0)
                  .attr('x2', width)
                  .attr('y1', y)
                  .attr('y2', y)
                  .style('stroke', '#ccc');


              // This renders the data


              // This section renders a line chart
              var trips = svg.selectAll('.chart')
              .data(uptData)
              .enter().append('g')
              .attr('class', 'chart');

              trips.append('path')
              .attr('class', 'line')
              .attr('d', function(d) {return line(d.trips);})
              .style('stroke', function(d) { return color(d.mode);})
              .style('stroke-width', '.2em')
              .style('fill', 'none');


              // console.log(tripsArr);
              // // This section renders a stacked area
              // var trips = svg.selectAll('.chart')
              //     .data(tripsArr)
              //     .enter().append('g')
              //       .attr('class', 'chart')
              //
              // trips.append('path')
              //     .attr('class', 'stackPath')
              //     .attr('d', function (d) { return area(d.trips); })
              //     .style('fill', function (d) {return color(d.month); })
              //     .style('stroke', 'grey');

              // This renders stacked bar NOT WORKING
              // var selection = svg.selectAll('.chart')
              //       .data(tripsArr)
              //     .enter().append('g')
              //       .attr('class', 'trips')
              //       .attr('transform', function(d){
              //         console.log(d);
              //         console.log(x(month));
              //         return 'translate(' + x(month) + ', 0)'
              //       });
              //
              // selection.selectAll('rect')
              //     .data(function(d){ return d.mapping;})
              //   .enter().append('rect')
              //     .attr('width', x.rangeBand())
              //     .attr('y', function(d){ return y(d.y1); })
              //     .attr('height', function (d){ return y(d.y0) - y(d.y1); })
              //     .style('fill', function(d) {return color(d.Modes); })
              //     .style('stroke', 'grey');


              // This creates the legend
              var legend = svg.selectAll('.legend')
                  .data(modes.slice().reverse())
                .enter().append('g')
                  .attr('class', 'legend')
                  .attr('transform', function(d, i){
                    return 'translate(25, ' + i * 30 + ')';
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
                  .attr('dy', '.5em')
                  .style('text-anchor', 'end')
                  .text(function(d){ return d;});
          });

        };

        $scope.tripsPerhour = function(agency){

          d3.select("svg")
          .remove();

          DataFactory.searchAgency(agency).then(function(results){
              var uptData = results[3];

              var month = results[1];

              DataFactory.vehicleHours(agency).then(function(results){
                var vrhData = results[3];

                DataFactory.tripsPerhour(uptData, month, vrhData);

              });
          });





              $scope.agency = null;

          };

          $scope.vehicleHours = function(agency){

          $scope.agency = null;

          d3.select('svg')
              .remove();

          DataFactory.vehicleHours(agency).then(function(results){
            $scope.agencies = results[0];

            var vrhData = results[0];

            var month = results[1];

            var modes = ['CR', 'DR', 'HR', 'LR', 'MB', 'FB', 'TB'];
            console.log(modes);

            var color = d3.scale.ordinal()
            .range(["#001c9c","hsla(113, 86%, 50%, 1)","hsla(360, 100%, 50%, 1)","hsla(275, 100%, 44%, 1)","hsla(247, 100%, 50%, 1)", 'green', 'steelblue']);

            color.domain(modes);

            var margin = {top: 20, right: 50, bottom: 30, left: 60},
            width = 1200 - margin.left - margin.right,
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
            .range(["#001c9c","hsla(113, 86%, 50%, 1)","hsla(360, 100%, 50%, 1)","hsla(275, 100%, 44%, 1)","hsla(247, 100%, 50%, 1)", 'green', 'steelblue']);

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
              .call(xAxis)
              .selectAll('text')
                .style('text-anchor', 'end')
                .style('font-size', '.45em')
                .attr('dx', '-.8em')
                .attr('dy', '.15em')
                .attr('transform', function(d){
                  return 'rotate(-65)'
                });

              svg.append('g')
              .attr('class', 'y axis')
              .call(yAxis)
              // .selectAll('text')
              //     .style('font-size', '.575em')
              .append('text')
                  .attr('transform', 'rotate(-90)')
                  .attr('y', 6)
                  .attr('dy', '.71em')
                  .style('text-anchor', 'end')
                  .text('Number of Vehicle Revenue Miles');

                  // This renders the grid

                  svg.selectAll('line.y')
                  .data(y.ticks(10))
                  .enter().append('line')
                  .attr('class', 'y')
                  .attr('x1', 0)
                  .attr('x2', width)
                  .attr('y1', y)
                  .attr('y2', y)
                  .style('stroke', '#ccc');

              // This renders the data

              var trips = svg.selectAll('.chart')
              .data(vrhData)
              .enter().append('g')
              .attr('class', 'chart');

              trips.append('path')
              .attr('class', 'line')
              .attr('d', function(d) {return line(d.trips);})
              .style('stroke', function(d) { return color(d.mode);})
              .style('stroke-width', '.2em')
              .style('fill', 'none');

              var legend = svg.selectAll('.legend')
              .data(modes.slice().reverse())
              .enter().append('g')
              .attr('class', 'legend')
              .attr('transform', function(d, i){
                return 'translate(25, ' + i * 20 + ')';
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

        $scope.vehicleMiles = function(agency){

          $scope.agency = null;

          d3.select('svg')
            .remove();

          DataFactory.vehicleMiles(agency).then(function(results){
            $scope.agencies = results[0];

            var vrmData = results[0];

            console.log(vrmData);

            var month = results[1];

            var modes = ['CR', 'DR', 'HR', 'LR', 'MB', 'FB', 'TB'];

            var color = d3.scale.ordinal()
            .range(["#001c9c","hsla(113, 86%, 50%, 1)","hsla(360, 100%, 50%, 1)","hsla(275, 100%, 44%, 1)","hsla(247, 100%, 50%, 1)", 'green', 'steelblue']);

            color.domain(modes);

            var margin = {top: 20, right: 50, bottom: 30, left: 60},
            width = 1200 - margin.left - margin.right,
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
            .y(function (d) { return y(d.vehmiles); });

            var color = d3.scale.ordinal()
            .range(["#001c9c","hsla(113, 86%, 50%, 1)","hsla(360, 100%, 50%, 1)","hsla(275, 100%, 44%, 1)","hsla(247, 100%, 50%, 1)", 'green', 'steelblue']);

            // This creates the svg object

            var svg = d3.select('.chart').append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // This defines the axes

            x.domain(month.map(function(d){ return d }));
            y.domain([
              d3.min(vrmData, function(c){
                return d3.min(c.miles, function(min){ return min.vehmiles;});
              }),
              d3.max(vrmData, function(c){
                return d3.max(c.miles, function(max){ return max.vehmiles;});
              })
              ]);

              // This renders the axes

              svg.append('g')
              .attr('class', 'x axis')
              .attr('transform', 'translate (0, ' + height + ')')
              .call(xAxis)
              .selectAll('text')
              .style('text-anchor', 'end')
              .style('font-size', '.45em')
              .attr('dx', '-.8em')
              .attr('dy', '.15em')
              .attr('transform', function(d){
                return 'rotate(-65)'
              });

              svg.append('g')
              .attr('class', 'y axis')
              .call(yAxis)
              // .selectAll('text')
              // .style('font-size', '.575em')
              .append('text')
              .attr('transform', 'rotate(-90)')
              .attr('y', 6)
              .attr('dy', '.71em')
              .style('text-anchor', 'end')
              .text('Number of Vehicle Revenue Miles');

              // This renders the grid

              svg.selectAll('line.y')
              .data(y.ticks(10))
              .enter().append('line')
              .attr('class', 'y')
              .attr('x1', 0)
              .attr('x2', width)
              .attr('y1', y)
              .attr('y2', y)
              .style('stroke', '#ccc');

              // This renders the data

              var miles = svg.selectAll('.chart')
              .data(vrmData)
              .enter().append('g')
              .attr('class', 'chart');

              miles.append('path')
              .attr('class', 'line')
              .attr('d', function(d) {return line(d.miles);})
              .style('stroke', function(d) { return color(d.mode);})
              .style('stroke-width', '.2em')
              .style('fill', 'none');

              //This renders the legend

              var legend = svg.selectAll('.legend')
              .data(modes.slice().reverse())
              .enter().append('g')
              .attr('class', 'legend')
              .attr('transform', function(d, i){
                return 'translate(25, ' + i * 20 + ')';
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


            var tripsArr = [];
            var tripmonth= {};

            //This section cleans Data for stacked area

            month.forEach(function(number){
              tripmonth[number] = {month: number, trips: []};
              tripsArr.push(tripmonth[number]);
            })

            response.forEach(function(d){

              month.map(function(trips){

                tripmonth[trips].trips.push({mode: d.Modes, month: trips, upt: +d[trips].replace(/,/g, '')});

              });

            });

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

             //console.log(uptData);

             var cleandata = [];

             cleandata.push(uptData);

             cleandata.push(month);

             cleandata.push(modes);

             cleandata.push(response);

             cleandata.push(tripsArr);

             deferred.resolve(cleandata);

           });

           return deferred.promise;

       };

       var tripsPerhour = function(uptData, month, vrhData){
        //  console.log(uptData);
        //  console.log(vrhData);
        //  console.log(month);

        //  var uptnumeric = uptData.map(function(t){
        //    return {
        //     agency: t.Agency,
        //     mode: t.Modes,
        //     monthtrips: month.map(function(d){
        //       return{month: d, trips: +t[d].replace(/,/g, "")}
        //     })
        //    }
        //  });
         //
        //  var vrhnumeric = vrhData.map(function(t){
        //   return {
        //      agency: t.Agency,
        //      mode: t.Modes,
        //      monthhours: month.map(function(d){
         //
        //        if (t[d] !== undefined){
        //          return {month: d, hours: +t[d].replace(/,/g, "")}
        //       }
        //      })
        //    }
        //  });
        //  console.log(uptnumeric);
        //  console.log(vrhnumeric);


         var calctripspervrh = function(tripsArr, hoursArr){
           console.log(tripsArr);
           console.log(hoursArr);

           return {
            agency: tripsArr.Agency,
            region: tripsArr.UZA,
            mode: tripsArr.Modes,
            tripsperhour: month.map(function(d){
              if (hoursArr[d]!== undefined){
                return {month: d, triphour: +tripsArr[d].replace(/,/g, '') - +hoursArr[d].replace(/,/g, '')}
              }
            })
           }
         };

         var tripspervrh = calctripspervrh(uptData, vrhData);

         console.log(tripspervrh)

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

      var vehicleMiles = function(agency){

        console.log(agency);

        var response = [];
        var deferred = $q.defer();

        var data = d3.csv('data/September 2014 Adjusted Database/VRM-Table 1.csv', function(error, data){

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
          var vrmData = response.map(function (t){
            return {
              agency: t.Agency,
              mode:   t.Modes,
              region: t.UZA,
              miles: month.map(function(d){
                return {month: d, vehmiles: +t[d].replace(/,/g, '')}; //returns array of month and unlinked passenger trips as number
              })
            };
          });

          var cleandata = [];

          cleandata.push(vrmData);

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
        vehicleMiles: vehicleMiles
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
