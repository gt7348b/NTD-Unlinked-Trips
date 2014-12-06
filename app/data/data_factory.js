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

             deferred.resolve(response);

           //}).done(function(response){
             //return $location.path('/results');

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

        var margin = {top: 20, right: 30, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;


        var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

        var y = d3.scale.linear()
        .range([height, 0]);

        var line = d3.svg.line()
        .interpolate('cardinal')
        .x(function(d) { return x(d.label)})
        .y(function(d) { return y(d.value)});

        var xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom');

        var yAxis = d3.svg.axis()
        .scale(y)
        .orient('left');


        // REMEMBER:  "+d.APR02" converts a string to a number

        var svg = d3.select('chart').append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var data = d3.csv('data/September 2014 Adjusted Database/UPT-Table 1.csv', function(error, data){

          var sel_agency = data.filter(function(entry){ //filters the data by agency name
            if (entry.Agency == results.name){
              response.push(entry);  //adds the data to the response array
            }
          });

          console.log(response);

          var month = d3.keys(data[0])
              .filter(function(key){ return key!=='Modes'})
              .filter(function(key){ return key!=='NTDID'})
              .filter(function(key){ return key!=='Agency'})
              .filter(function(key){ return key!=='Active'})
              .filter(function(key){ return key!=='SSW'})
              .filter(function(key){ return key!=='UZA'})
              .filter(function(key){ return key!=='UZA Name'})
              .filter(function(key){ return key!=='TOS'});

              console.log(month);

          var uptData = response.map(function (t){
            return {
              agency: t.Agency,
              mode:   t.Modes,
              trips: month.map(function(d){
                console.log(t[d]);
                return {month: d, upt: t[d]};
              })
            };
          });

          console.log(uptData);

          x.domain(response.map(function(d){ return d.MODE}));

          svg.append('g')
              .attr('class', 'x axis')
              .attr('transform', 'translate(0, ' + height +')')
              .call(xAxis);

          deferred.resolve(response);

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
