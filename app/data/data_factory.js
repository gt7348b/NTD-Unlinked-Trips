(function(){

  angular.module('UPT')
    .factory('DataFactory', ['$rootScope','$http', '$location','DATA_SOURCE',
      function($rootScope, $http, $location, DATA_SOURCE){


       var searchAgency = function(agency){
         console.log(agency);

         var response = [];

         $.getJSON(DATA_SOURCE).done(function(ntd_data){

           var sel_agency = ntd_data.filter(function(entry){ //filters the data by agency name
             //console.log(entry.AGENCY);
             if (entry.AGENCY == agency.name){

               response.push(entry);  //adds the data to the response array
             }

           });

           console.log(response);

           //$scope.agencies = response;

           return response;

         }).done(function(response){
           return $location.path('/results');
         });


       };

       var searchMSA = function(msa){
         console.log(msa);

         var msa_filter = [];

         $.getJSON(DATA_SOURCE).done(function(ntd_data){

           ntd_data.forEach(function(entry){

             if (entry.UZA_NAME == msa.region){

               msa_filter.push(entry);

             }   // This is the return of the if
           });
           console.log(msa_filter);
           return msa_filter;
         });

       };


      var selectModes = function(modes){

        console.log(modes);

        var data = $.getJSON(DATA_SOURCE).done(function(ntd_data){

        //  ntd_data.forEach(function(entry){

          //  if (entry.UZA_NAME == modes.name)

          //});

        });

      };


      return {
        searchAgency: searchAgency,
        searchMSA:    searchMSA,
        selectModes:  selectModes,
        }

    }]);

}());
