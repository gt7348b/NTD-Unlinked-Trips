(function(){

  angular.module('UPT')
    .controller('AddController', ['$scope', '$location','$rootScope','DataFactory',
      function($scope, $location, $rootScope, DataFactory){

        var agency_response = [],
        msa_response = [],
        mode_response = [];

        console.log("hey - i'm in the add controller")

        $scope.d3render = function(results){

          DataFactory.d3render(results).then(function(results){

            $scope.agencies = results[0];

            var uptData = results[0];

            //console.log(results);

            var month = results[1];
            //console.log(month)

            //d3.select(".chart").append("svg").attr("width", 100).attr("height", 100).append("circle").attr("cx", 25).attr("cy", 25).attr("r", 25).style("fill", "purple");

            var margin = {top: 20, right: 30, bottom: 30, left: 40},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;


            var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

            var y = d3.scale.linear()
            .range([height, 0]);

            var line = d3.svg.line()
            .interpolate('cardinal')
            .x(function(d) { return x(d.label)})
            .y(function(d) { return y(d.value)});

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

            var svg = d3.select('.chart').append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // This renders defines the axes

            x.domain(month.map(function(d){ return d }));
            y.domain([
              d3.min(uptData, function(c){
                return d3.min(c.trips, function(min){ return min.upt;});
              }),
              d3.max(uptData, function(c){
                return d3.max(c.trips, function(max){ return max.upt;});
              })
              ]);

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

          });
        };


        $scope.searchAgency = function(agency){
          DataFactory.searchAgency(agency).then(function(results){
            $scope.agencies = results[0];

            var uptData = results[0];

            //console.log(results);

            var month = results[1];
            //console.log(month)

            //d3.select(".chart").append("svg").attr("width", 100).attr("height", 100).append("circle").attr("cx", 25).attr("cy", 25).attr("r", 25).style("fill", "purple");

            var margin = {top: 20, right: 30, bottom: 30, left: 40},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;


            var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

            var y = d3.scale.linear()
            .range([height, 0]);

            var line = d3.svg.line()
            .interpolate('cardinal')
            .x(function(d) { return x(d.label)})
            .y(function(d) { return y(d.value)});

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

            var svg = d3.select('.chart').append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // This renders defines the axes

            x.domain(month.map(function(d){ return d }));
            y.domain([
              d3.min(uptData, function(c){
                return d3.min(c.trips, function(min){ return min.upt;});
              }),
              d3.max(uptData, function(c){
                return d3.max(c.trips, function(max){ return max.upt;});
              })
              ]);

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
