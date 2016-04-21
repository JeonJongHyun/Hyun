var myApp = angular.module('MyApp', [
                              'ngResource',
                              'ngRoute',
                              'ui.calendar',
                              'mobile-angular-ui',
                              'mobile-angular-ui.gestures',
                              'mobile-angular-ui.core.capture',
                              'MyApp.controllers.Main',
                              'MyApp.controllers.Map',
                              'MyApp.controllers.Photo',
                              'MyApp.controllers.Login',
                              'MyApp.controllers.User',
                              'MyApp.controllers.Signup',
                              'MyApp.controllers.Message',
                              'MyApp.controllers.Tour',
                              'slick',
                              'MyApp.controllers.Game'
                              //'ngAnimate',
                              //'mgcrea.ngStrap'
                              //'angular-carousel'
                            ]);

myApp.config(function($routeProvider, $locationProvider) {
  //$routeProvider.when('/', {templateUrl:'templates/home.html',  reloadOnSearch: false});
  $locationProvider.html5Mode(true);
  $routeProvider
      .when('/',{
        templateUrl:'templates/home.html',
        controller:'MainCtrl',
        reloadOnSearch: false
      })
      .when('/map',{
        templateUrl:'html/map/mapList.html',
        controller:'MapCtrl',
        reloadOnSearch: false
      })
      .when('/photo',{
        templateUrl:'html/photo/photoList.html',
        controller:'PhotoCtrl',
        reloadOnSearch: false
      })
      .when('/message',{
        templateUrl:'html/message/messageList.html',
        controller:'MessageCtrl',
        reloadOnSearch: false
      })

      .when('/order',{
          templateUrl:'html/order/orderList.html',
          //controller:'MessageCtrl',
          reloadOnSearch: false
      })
      .when('/gentleman',{
          templateUrl:'html/gentleman/manStroy.html',
          //controller:'MessageCtrl',
          reloadOnSearch: false
      })
      .when('/lady',{
          templateUrl:'html/lady/ladyStroy.html',
          //controller:'MessageCtrl',
          reloadOnSearch: false
      })
      .when('/game',{
          templateUrl:'html/game/gameList.html',
          controller:'slidingAdvancedCtrl',
          reloadOnSearch: false
       })
      .when('/tour',{
          templateUrl:'html/tour/tourList.html',
          controller:'TourCtrl',
          reloadOnSearch: false
      })
      .when('/login',{
        templateUrl:'html/login/login.html',
        controller:'LoginCtrl',
        reloadOnSearch: false
      })
      .when('/signup',{
                templateUrl:'html/login/signup.html',
                controller:'signupCtrl',
                reloadOnSearch: false
            })
      .when('/user',{
          templateUrl:'html/login/user.html',
          controller:'UserCtrl',
          reloadOnSearch: false
      });

});

myApp.config(function ($httpProvider) {
    $httpProvider.interceptors.push(function ($rootScope, $q, $window, $location) {
        return {
            request: function(config) {
                if ($window.localStorage.token) {
                    config.headers.Authorization = 'Bearer ' + $window.localStorage.token;
                }
                return config;
            },
            responseError: function(response) {
                if (response.status === 401 || response.status === 403) {
                    $location.path('/login');
                }
                return $q.reject(response);
            }
        }
    });
});


myApp.controller('MainController', function( $rootScope){

    // Needed for the loading screen
    $rootScope.$on('$routeChangeStart', function(){
        $rootScope.loading = true;
    });

    $rootScope.$on('$routeChangeSuccess', function(){
        $rootScope.loading = false;
    });

});