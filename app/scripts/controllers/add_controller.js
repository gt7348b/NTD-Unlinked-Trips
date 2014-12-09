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

            var tripsArr = results[4];

            //console.log(tripsArr);

            //stack(tripsArr);

            var modes = ['CR', 'DR', 'HR', 'LR', 'MB', 'FB', 'TB'];

            var color = d3.scale.ordinal()
            .range(["#001c9c","#101b4d","#475003","#9c8305","#d3c47c", 'green', 'steelblue']);

            color.domain(modes);

            var margin = {top: 20, right: 50, bottom: 50, left: 60},
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
                .selectAll('text')
                .style('font-size', '.575em')
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

            var margin = {top: 20, right: 50, bottom: 30, left: 60},
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
              .selectAll('text')
                  .style('font-size', '.575em')
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

      }]);



}());
