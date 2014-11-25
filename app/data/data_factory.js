(function(){

  angular.module('UPT')
    .factory('DataFactory', ['DATA_SOURCE', function(DATA_SOURCE){

      console.log("factory");

      return 'this'

    }]);

}());
