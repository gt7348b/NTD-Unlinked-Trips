(function(){

  angular.module('UPT')
    .factory('DataFactory', ['DATA_SOURCE', function(DATA_SOURCE){

       var searchAgency = function(agency){
         console.log(agency);
       };

       var searchMSA = function(msa){
         console.log(msa);
       };


      console.log("factory");

      return {
        searchAgency: searchAgency,
        searchMSA:    searchMSA,
        }

    }]);

}());
