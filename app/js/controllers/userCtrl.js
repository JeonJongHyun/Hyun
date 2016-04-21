/**
 * Created by hyun on 2015-08-01.
 */
var user = angular.module('MyApp.controllers.User',[]);


user.controller('UserCtrl',function($scope, $rootScope, $http, Auth){
    //$scope.page = '종현 diet page';
   // console.log($rootScope.currentUser);
    $scope.messages = $rootScope.currentUser;

    $scope.logout = function() {
        Auth.logout();
    };
    $scope.userNote = null;

    $http.post('/user/message', $rootScope.currentUser)
        .success(function(data) {
            $scope.userNote = data
        })

    //$http.post('/diet/dietList', { params: { id: '1' } }).success(function(data) {
    //    $scope.diets = data;
    //});

});
