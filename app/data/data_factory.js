(function(){

  angular.module('UPT')
    .factory('DataFactory', ['$resource','$http','DATA_SOURCE',
      function($resource, $http, DATA_SOURCE){


       var searchAgency = function(agency){
         console.log(agency);
         console.log(DATA_SOURCE);
         return $resource(DATA_SOURCE, {}, {query: {method:'GET', param:{agency:'AGENCY'}, isArray:true}
         });

       };
      console.log(searchAgency);
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
