/**
 * Created by hyun4513 on 2015-07-30.
 */

var loginCtr = angular.module('MyApp.controllers.Login',[]);

loginCtr.controller('LoginCtrl',function($scope, Auth ){

    $scope.login = function() {
        Auth.login({ tel: $scope.tel });
    };

    //$scope.cancel = function() {
    //    $modalInstance.dismiss('cancel');
    //};



});