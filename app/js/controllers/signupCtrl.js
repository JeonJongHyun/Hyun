/**
 * Created by hyun on 2015-08-01.
 */
var user = angular.module('MyApp.controllers.Signup',[]);


user.controller('signupCtrl',function($scope, $rootScope, $http, Auth){


    $scope.tel = "";
    $scope.name = "";

    $scope.signup = function() {
            Auth.signup({
                         name: $scope.name,
                         tel: $scope.tel
                         });
     };

});
