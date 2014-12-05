(function(){

  angular.module('UPT')
    .controller('AddController', ['$scope', '$location','$rootScope','DataFactory',
      function($scope, $location, $rootScope, DataFactory){

        var agency_response = [],
        msa_response = [],
        mode_response = [];

        console.log("hey - i'm in the add controller")

        $scope.d3render = function(results){
          console.log('I am in the d3render in controller');
          DataFactory.d3render(results).then(function(results){

            $scope.agencies = results;

            

          });
        };


        $scope.searchAgency = function(agency){
          DataFactory.searchAgency(agency).then(function(results){

            $scope.agencies = results;

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
