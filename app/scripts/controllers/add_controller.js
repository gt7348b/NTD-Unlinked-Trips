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

            //var x = d3.scale.ordinal()
            //    .rangeRoundBands([0, width], .1);
            var data = [4, 8, 13, 16, 23, 42];

            var x = d3.scale.linear()
            .domain([0, d3.max(data)])
            .range([0, 420]);

            var y = d3.scale.linear()
                .range([height, 0]);



                d3.select(".chart")
                .selectAll("div")
                .data(data)
                .enter().append("div")
                .style("width", function(d) { return x(d) + "px"; })
                .text(function(d) { return d; });

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient('bottom');

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
