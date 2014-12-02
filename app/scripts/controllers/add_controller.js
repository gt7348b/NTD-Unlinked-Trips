(function(){

  angular.module('UPT')
    .controller('AddController', ['$scope', '$location','DataFactory',
      function($scope, $location, DataFactory){

        console.log("hey - i'm in the add controller")

        $scope.searchAgency = function(agency){
          DataFactory.searchAgency(agency).then(function(results){
            $scope.agencies = results;
          });
        };


        $scope.searchMSA = function(msa){
          DataFactory.searchMSA(msa);
        };

        $scope.selectModes = function(modes){
          DataFactory.selectModes(modes);
        };


      }]);



}());
