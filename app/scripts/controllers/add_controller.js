(function(){

  angular.module('UPT')
    .controller('AddController', ['$scope', '$location','$rootScope','DataFactory',
      function($scope, $location, $rootScope, DataFactory){

        var agency_response = [],
        msa_response = [],
        mode_response = [];

        console.log("hey - i'm in the add controller")

        $scope.searchAgency = function(agency){
        //  DataFactory.searchAgency(agency).then(function(results){
          //  agency_response = results;
        //  });
        //  console.log(agency_response);

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
