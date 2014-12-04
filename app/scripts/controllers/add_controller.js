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

            console.log(d3.values(results));

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


                // REMEMBER:  "+d.APR02" converts a string to a number

          var svg = d3.select('chart').append('svg')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                  .append('g')
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          d3.csv('data/MONTHLY_ADJ_DATA_05_02_2012/UPT-Table 1.csv', function(error, data){

            console.log('initial data', data);

          });



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
