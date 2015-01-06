(function(){

  angular.module('UPT')
      .factory('RegionFactory', ['$q', '$location', 'DATA_SOURCE',
        function($q, $location, DATA_SOURCE){

          var searchRegion = function(region){
            console.log(region);

            var response = [];
            var deffered = $;

            var data = d3.csv(DATA_SOURCE, function(error, data){

              console.log(data);

            })

          }

        }]);

}());
