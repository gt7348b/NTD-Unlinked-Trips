(function(){

  angular.module('UPT')
      .controller('AddRegion', ['$scope', '$location', '$rootScope', 'RegionFactory',

      function($scope, $location, $rootScope, RegionFactory){

        console.log('Im in the region contoller');

      }]);



}());
