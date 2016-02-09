 'use strict';

angular
  .module('wrtsApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute'

  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/directions', {
        templateUrl: 'views/directions.html',
        controller: 'DirectionsCtrl'
      })
      .when('/questions', {
        templateUrl: 'views/questions.html',
        controller: 'QuestionsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
