(function(){

  angular.module('UPT')
    .factory('DataFactory', ['$q','$location','DATA_SOURCE',
      function($q, $location, DATA_SOURCE){

       var searchAgency = function(agency){
           console.log(agency);

           var response = [];
           var deferred = $q.defer();

           var data = d3.csv('data/September 2014 Adjusted Database/UPT-Table 1.csv', function(error, data){

             var sel_agency = data.filter(function(entry){ //filters the data by agency name
               if (entry.Agency == agency.name){
                 response.push(entry);  //adds the data to the response array
               }
             });

             //console.log(response);

             // This creates an array of months

             var month = d3.keys(data[0])
             .filter(function(key){ return key!=='Modes'})
             .filter(function(key){ return key!=='NTDID'})
             .filter(function(key){ return key!=='Agency'})
             .filter(function(key){ return key!=='Active'})
             .filter(function(key){ return key!=='SSW'})
             .filter(function(key){ return key!=='UZA'})
             .filter(function(key){ return key!=='UZA Name'})
             .filter(function(key){ return key!=='TOS'});

             //  console.log(month);

             // This creates an array used to call render the data

             var uptData = response.map(function (t){
               return {
                 agency: t.Agency,
                 mode:   t.Modes,
                 region: t.UZA,
                 trips: month.map(function(d){
                   return {month: d, upt: +t[d].replace(/,/g, '')}; //returns array of month and unlinked passenger trips as number
                 })
               };
             });

             console.log(uptData);

             var cleandata = [];

             cleandata.push(uptData);

             cleandata.push(month);

             deferred.resolve(cleandata);

           });

           return deferred.promise;

       };

       var searchMSA = function(msa){
         console.log(msa);

         var msa_filter = [];
         var deferred = $q.defer();

         $.getJSON(DATA_SOURCE).done(function(ntd_data){

           ntd_data.forEach(function(entry){

             if (entry.UZA_NAME == msa.region){

               msa_filter.push(entry); //Adds results to array

             }   // This is the return of the if
           });
           console.log(msa_filter);
           //return msa_filter;
           deferred.resolve(msa_filter);
         });
         return deferred.promise;
       };


      var selectModes = function(modes){

        console.log(modes);

        var data = $.getJSON(DATA_SOURCE).done(function(ntd_data){

        //  ntd_data.forEach(function(entry){

          //  if (entry.UZA_NAME == modes.name)

          //});

        });


      };

      var d3render = function(results){

        var response = [];
        var deferred = $q.defer();

        console.log('I made into into the Render Factory');

        var data = d3.csv('data/September 2014 Adjusted Database/UPT-Table 1.csv', function(error, data){

          var sel_agency = data.filter(function(entry){ //filters the data by agency name
            if (entry.Agency == results.name){
              response.push(entry);  //adds the data to the response array
            }
          });

          //console.log(response);

          // This creates an array of months

          var month = d3.keys(data[0])
              .filter(function(key){ return key!=='Modes'})
              .filter(function(key){ return key!=='NTDID'})
              .filter(function(key){ return key!=='Agency'})
              .filter(function(key){ return key!=='Active'})
              .filter(function(key){ return key!=='SSW'})
              .filter(function(key){ return key!=='UZA'})
              .filter(function(key){ return key!=='UZA Name'})
              .filter(function(key){ return key!=='TOS'});

            //  console.log(month);

            // This creates an array used to call render the data

          var uptData = response.map(function (t){
            return {
              agency: t.Agency,
              mode:   t.Modes,
              region: t.UZA,
              trips: month.map(function(d){
                return {month: d, upt: +t[d].replace(/,/g, '')}; //returns array of month and unlinked passenger trips as number
              })
            };
          });

          console.log(uptData);

          var cleandata = [];

          cleandata.push(uptData);

          cleandata.push(month);

          deferred.resolve(cleandata);

        });

        return deferred.promise;
      };


      return {
        searchAgency: searchAgency,
        searchMSA:    searchMSA,
        selectModes:  selectModes,
        d3render:     d3render,
        }

    }]);

}());
