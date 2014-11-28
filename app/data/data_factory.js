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

       var searchMSA = function(msa){
         console.log(msa);
       };

      var selectModes = function(modes){
        $scope.AR = 'AR';
        $scope.AG = 'MG';
        $scope.CC = 'CC';
        $scope.CB = 'CB';
        $scope.CR = 'CR';
        $scope.DR = 'DR';
        $scope.FB = 'FB';
        $scope.HR = 'HR';
        $scope.IP = 'IP';
        $scope.JT = 'JT';
        $scope.LR = 'LR';
        $scope.MB = 'MB';
        $scope.MG = 'MG';
        $scope.PB = 'PB';
        $scope.SR = 'SR';
        $scope.TB = 'TB';
        $scope.TR = 'TR';
        $scope.VP = 'VP';
        $sopce.OR = 'OR'
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
