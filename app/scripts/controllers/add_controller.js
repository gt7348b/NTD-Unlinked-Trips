(function(){

  angular.module('UPT')
    .controller('AddController', ['$scope', '$location','$rootScope','DataFactory',
      function($scope, $location, $rootScope, DataFactory){

        console.log("hey - i'm in the add controller")

        $scope.searchAgency = function(agency){
          DataFactory.searchAgency(agency);
        };

        $scope.searchMSA = function(msa){
          DataFactory.searchMSA(msa);
        };

        $scope.selectModes = function(modes){
          DataFactory.selectModes(modes);
        };


      }]);



}());
