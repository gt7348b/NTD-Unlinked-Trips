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

            //var pairedresults = _.pairs(results);

            //console.log(pairedresults);

            var margin = {top: 20, right: 30, bottom: 30, left:40},
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

            var svg = d3.select(".chart")
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .selectAll("div")
                .data(results)
                .enter().append("div")
                .style("width", function(d) { return x(d) + "px"; })
                .text(function(d) { return  d.AGENCY; })
                .selectAll("div")
                .data(results)
                .enter().append("div")
                .style("width", function(d) { return x(d) + "px"; })
                .text(function(d) { return  d.MODES; });;


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
