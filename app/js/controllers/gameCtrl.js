

var gameCtr = angular.module('MyApp.controllers.Game',[]);

    // puzzle types
    var types = [
        { id: 'sliding-puzzle', title: 'Sliding puzzle' },
        { id: 'word-search-puzzle', title: 'Word search puzzle' }
    ];


//
    /**
     * Startup
     */
    gameCtr.run(function($rootScope, $route, $filter, Auth) {
        $rootScope.types = types;
        $rootScope.type = types[0].id;

        // set type on route change
        $rootScope.$on('$routeChangeSuccess', function(event, route) {
            $rootScope.type = ($filter('filter')(types, { id: route.params.type }).length ? route.params.type : types[0].id);
        });
    });

    /**
     * Advanced sliding puzzle controller
     */
    gameCtr.controller('slidingAdvancedCtrl', function($scope, $modal) {

        $scope.puzzles = [
            { src: './image/game1.JPG', title: '퍼즐', rows: 4, cols: 4 }
        ];


     $scope.ranking = function() {
         var modalInstance = $modal.open({
                             animation: true,
                             templateUrl: 'myModalGame.html',
                             controller: 'ModalRankingCtrl',
                             size: 'sm'
                         });
         };




    });

gameCtr.controller('ModalRankingCtrl', function ($scope, $http, $modalInstance) {

    $scope.close = function() {
        $modalInstance.dismiss('cancel');
    };

    $http.get('/game/ranking').success(function(data) {
        $scope.allRanking = data;
    });

});