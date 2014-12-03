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

            var chart = d3.select('.chart')
                .attr('width', width)
                .attr('height', height);

            console.log(d3.select(results));

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
