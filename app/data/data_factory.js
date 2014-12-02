(function(){

  angular.module('UPT')
    .factory('DataFactory', ['$q','$location','DATA_SOURCE',
      function($q, $location, DATA_SOURCE){


       var searchAgency = function(agency){
           console.log(agency);

           var response = [];
           var deferred = $q.defer();

           $.getJSON(DATA_SOURCE).done(function(ntd_data){

             var sel_agency = ntd_data.filter(function(entry){ //filters the data by agency name
               if (entry.AGENCY == agency.name){
                 response.push(entry);  //adds the data to the response array
                 }
                });

             console.log(response);
             //return response;
             deferred.resolve(response);

           //}).done(function(response){
             //return $location.path('/results');

         });

         return deferred.promise;
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
