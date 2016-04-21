/**
 * Created by kojunghyun on 15. 1. 6..
 */
var myDirectiveModule = angular.module('MyApp');

myDirectiveModule.directive('autoFocus', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element) {
            $timeout(function(){
                console.log("set focus!!!");//debug
                element[0].focus();
            }, 300);
        }
    };
});