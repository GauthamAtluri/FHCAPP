'use strict';

angular.module('wrtsApp')
  .controller('QuestionsCtrl', function ($scope) {
        $scope.question1 = {};
        $scope.question1.value = undefined;
        $scope.question2 = {};
        $scope.question2.value = undefined;

    $scope.availableTimes = [
      '11:00',
      '12:00',
      '1:00'
    ];

    $scope.getPatientAddress = function() {
      var patientAddress = $scope.patientAddress;
    };
  });

