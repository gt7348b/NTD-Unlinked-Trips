(function(){

  angular.module('UPT')
    .factory('DataFactory', ['$resource','$http','DATA_SOURCE',
      function($resource, $http, DATA_SOURCE){


       var searchAgency = function(agency){
         console.log(agency);
         var response = $.getJSON(DATA_SOURCE).done(function(ntd_data){

           ntd_data.forEach(function(entry){
             //console.log(entry.AGENCY);
             if (entry.AGENCY === agency.name){
             console.log(entry.AGENCY);
             return entry.AGNECY}
           });

           console.log(response);

         });

       };

       var searchMSA = function(msa){
         console.log(msa);
       };

      var selectModes = function(modes){

        console.log(modes);
        console.log(DATA_SOURCE);
        var data = $.getJSON(DATA_SOURCE).done(function(ntd_data){

          console.log(ntd_data);

        });

      };


      return {
        searchAgency: searchAgency,
        searchMSA:    searchMSA,
        selectModes:  selectModes,
        }

    }]);

}());
