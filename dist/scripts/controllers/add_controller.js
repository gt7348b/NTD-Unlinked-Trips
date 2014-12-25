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

            //This defines things for a stacked area

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

            var stackmode = function(c){
              return c.mode
            };


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
          //  y.domain([0, d3.max(tripsArr, function(d){return d.total})]);

            // // This is for line chart
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
              // This section renders a stacked area
              // var trips = svg.selectAll('.chart')
              //     .data(tripsArr)
              //     .enter().append('g')
              //       .attr('class', 'chart')
              //
              // trips.append('path')
              //     .attr('class', 'stackPath')
              //     .attr('d', function (d) { return area(d.trips); })
              //     .style('fill', function (d) {return color(stackmode(d.trips)); })
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

                DataFactory.tripsPerhour(uptData, month, vrhData).then(function(results){

                  console.log(results);

                  var tphData = results;

                  //This defines overall rendering variables
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
                  .x(function (d) { if (d !== undefined){return x(d.month) + x.rangeBand() / 2; }})
                  .y(function (d) { if (d !== undefined){return y(d.tph); }});

                  // This creates the svg object

                  var svg = d3.select('.chart').append('svg')
                  .attr('width', width + margin.left + margin.right)
                  .attr('height', height + margin.top + margin.bottom)
                  .append('g')
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                  // This defines the axes

                  x.domain(month.map(function(d){ return d }));

                  // This is for line chart
                  y.domain([
                    d3.min(tphData, function(c){
                        return d3.min(c.monthlytph, function(min){
                          if (min !== undefined){
                          return min.tph;}});
                      }),
                    d3.max(tphData, function(c){
                            return d3.max(c.monthlytph, function(max){
                              if (max !== undefined){return max.tph;}});
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
                  .text('Trips per Vehicle Revenue Miles');

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

                  // This section renders a line chart
                  var trips = svg.selectAll('.chart')
                  .data(tphData)
                  .enter().append('g')
                  .attr('class', 'chart');

                  trips.append('path')
                  .attr('class', 'line')
                  .attr('d', function(d) {return line(d.monthlytph);})
                  .style('stroke', function(d) { return color(d.mode);})
                  .style('stroke-width', '.2em')
                  .style('fill', 'none');

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
