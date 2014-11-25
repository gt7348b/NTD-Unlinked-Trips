(function(){

  angular.module('UPT')
    .controller('AddController', ['$scope', 'DataFactory',
      function($scope, DataFactory){

        console.log("hey - i'm in the add controller")

        $scope.searchAgency = function(agency){
          DataFactory.searchAgency(agency);
        };


      }]);



}());
