(function(){

  angular.module('UPT')
    .factory('DataFactory', ['$resource','DATA_SOURCE',
      function($resource, DATA_SOURCE){


       var searchAgency = function(agency){
         console.log(agency);
         $http.get('data/UPT1.json').success(function(data){
           console.log(data);
         });
       };

       var searchMSA = function(msa){
         console.log(msa);
       };

      var selectModes = function(modes){
        console.log(modes);
        console.log(DATA_SOURCE);
      };


      return {
        searchAgency: searchAgency,
        searchMSA:    searchMSA,
        selectModes:  selectModes,
        }

    }]);

}());
