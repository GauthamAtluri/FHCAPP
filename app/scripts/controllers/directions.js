'use strict';

angular.module('wrtsApp')
  .controller('DirectionsCtrl', function ($scope) {
    $scope.availableTimes = [
      '11:00',
      '12:00',
      '1:00'
    ];

    $scope.getPatientAddress = function() {
      var patientAddress = $scope.patientAddress;
    };
  });

