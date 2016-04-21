var auth = angular.module('MyApp')

auth.factory('Auth', function($http, $location, $rootScope, $window,$modal) {
    var token = $window.localStorage.token;
    if (!(token == null || token == undefined)) {
        var payload = JSON.parse(decodeURIComponent(escape($window.atob(token.split('.')[1]))));
        $rootScope.currentUser = payload.user;
    }


    return {


      login: function(user) {
        return $http.post('/auth/login', user)
          .success(function(data) {
                $window.localStorage.token = data.token;
                var payload = JSON.parse(decodeURIComponent(escape($window.atob(data.token.split('.')[1]))));
                $rootScope.currentUser = payload.user;
                $location.path('/user');

          })
          .error(function() {

            delete $window.localStorage.token;

                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'myModalContent.html',
                    controller: 'ModalInstanceCtrl',
                    size: 'sm'
                });

          });
      },
      signup: function(user) {
        return $http.post('/auth/signup', user)
          .success(function() {
            $location.path('/login');

          })
          .error(function(response) {
            var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'myModalContent2.html',
                    controller: 'ModalInstanceCtrl',
                    size: 'sm'
                });
          });
      },
      logout: function() {
        delete $window.localStorage.token;
        $rootScope.currentUser = null;
          $location.path('/');

      }
    };
  });

auth.controller('ModalInstanceCtrl', function ($scope, $modalInstance) {

    $scope.close = function() {
        $modalInstance.dismiss('cancel');
    };


});


