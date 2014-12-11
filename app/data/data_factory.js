(function(){

  angular.module('UPT')
    .factory('DataFactory', ['$q','$location','DATA_SOURCE',
      function($q, $location, DATA_SOURCE){

       var searchAgency = function(agency){
           console.log(agency);

           var response = [];
           var deferred = $q.defer();

           var data = d3.csv(DATA_SOURCE, function(error, data){

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

            var modes = response.map(function(m){
              return {
                mode: m.Modes
              }

            });


            var tripsArr = [];
            var tripmonth= {};

            //This section cleans Data for stacked area

            month.forEach(function(number){
              tripmonth[number] = {month: number, trips: []};
              tripsArr.push(tripmonth[number]);
            })

            response.forEach(function(d){

              month.map(function(trips){

                tripmonth[trips].trips.push({mode: d.Modes, month: trips, upt: +d[trips].replace(/,/g, '')});

              });

            });

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

             //console.log(uptData);

             var cleandata = [];

             cleandata.push(uptData);

             cleandata.push(month);

             cleandata.push(modes);

             cleandata.push(response);

             cleandata.push(tripsArr);

             deferred.resolve(cleandata);

           });

           return deferred.promise;

       };

       var tripsPerhour = function(uptData, month, vrhData){
          console.log(uptData);
        //  console.log(vrhData);
        //  console.log(month);

        //  var uptnumeric = uptData.map(function(t){
        //    return {
        //     agency: t.Agency,
        //     mode: t.Modes,
        //     monthtrips: month.map(function(d){
        //       return{month: d, trips: +t[d].replace(/,/g, "")}
        //     })
        //    }
        //  });
         //
         var vrhnumeric = vrhData.map(function(t){
           //console.log(t);
           var trips = [];

           uptData.forEach(function(upt){
            //  console.log(upt.Modes);
            //  console.log(t.Modes);
            //  console.log(upt);
             if (upt.Modes === t.Modes){
               trips.push(upt);
             }
           });

          return {
             agency: t.Agency,
             mode: t.Modes,
             monthhours: month.map(function(d){

               if (t[d] !== undefined && t[d] !== '0'){
                 var upt = trips[0][d].replace(/,/g, '');
                 var hours = +t[d].replace(/,/g, '');

                 console.log(upt/hours);
                 return {month: d, hours: +t[d].replace(/,/g, "")}
              }
             })
           }
         });
        // console.log(uptnumeric);
        // console.log(vrhnumeric);



        //  var tripspervrh = month.map(function(m){
        //    console.log(m)
        //    console.log(uptData);
         //
        //    var result
         //
        //    return {
        //      month: m,
        //      tpv: result
        //    }
        //  });

        // console.log(tripspervrh)

         return uptData;
       };


      var vehicleHours = function(agency){

        console.log(agency);

        var response = [];
        var deferred = $q.defer();

        var data = d3.csv('data/September 2014 Adjusted Database/VRH-Table 1.csv', function(error, data){

          var sel_agency = data.filter(function(entry){ //filters the data by agency name
            if (entry.Agency == agency.name){
              response.push(entry);  //adds the data to the response array
            }
          });

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

          var modes = response.map(function(m){
            return {
              mode: m.Modes
            }

          });

          // This creates an array used to call render the data
          var vrhData = response.map(function (t){
            return {
              agency: t.Agency,
              mode:   t.Modes,
              region: t.UZA,
              trips: month.map(function(d){
                return {month: d, upt: +t[d].replace(/,/g, '')}; //returns array of month and unlinked passenger trips as number
              })
            };
          });

          console.log(vrhData);

          var cleandata = [];

          cleandata.push(vrhData);

          cleandata.push(month);

          cleandata.push(modes);

          cleandata.push(response);

          deferred.resolve(cleandata);

        });

        return deferred.promise;

      };

      var vehicleMiles = function(agency){

        console.log(agency);

        var response = [];
        var deferred = $q.defer();

        var data = d3.csv('data/September 2014 Adjusted Database/VRM-Table 1.csv', function(error, data){

          var sel_agency = data.filter(function(entry){ //filters the data by agency name
            if (entry.Agency == agency.name){
              response.push(entry);  //adds the data to the response array
            }
          });

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

          var modes = response.map(function(m){
            return {
              mode: m.Modes
            }

          });

          // This creates an array used to call render the data
          var vrmData = response.map(function (t){
            return {
              agency: t.Agency,
              mode:   t.Modes,
              region: t.UZA,
              miles: month.map(function(d){
                return {month: d, vehmiles: +t[d].replace(/,/g, '')}; //returns array of month and unlinked passenger trips as number
              })
            };
          });

          var cleandata = [];

          cleandata.push(vrmData);

          cleandata.push(month);

          cleandata.push(modes);

          cleandata.push(response);

          deferred.resolve(cleandata);

        });

        return deferred.promise;

      };



      return {
        searchAgency: searchAgency,
        tripsPerhour: tripsPerhour,
        vehicleHours: vehicleHours,
        vehicleMiles: vehicleMiles
        }

    }]);

}());
