"use strict";

wallApp.controller('GameLeaderboardCtrl', ["$scope", "$timeout", "GameLeaderboardService", function ($scope, $timeout, GameLeaderboardService) {
    $scope.reloadInterval = (60 * 1000) * 10; // Ten minutes
    $scope.loading = true;

    function load() {
        console.log('Loading game leaderboard');
        GameLeaderboardService.loadLeaderboard().then(function (data) {
            $scope.leaderboard = data;
            $scope.loading = false;
        }, function (error) {
            $scope.leaderboard = [];
            $scope.loading = false;
            console.log('Error loading leaderboard: ', error);
        }).then(reload, reload);
    }

    function reload() {
        console.log('reload leaderboard');
        $timeout(load, $scope.reloadInterval);
    }

    load();
}]);
