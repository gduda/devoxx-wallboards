"use strict";

wallApp.controller('GameLeaderboardCtrl', ["$scope", "$timeout", "GameLeaderboardService", function ($scope, $timeout, GameLeaderboardService) {
    $scope.loading = true;

    function loadLeaderboard() {
        console.log('Loading game leaderboard');
        GameLeaderboardService.loadLeaderboard().then(function (data) {
            $scope.leaderboard = data;
            $scope.loading = false;
        }, function (error) {
            $scope.leaderboard = [];
            $scope.loading = false;
            console.log('Error loading leaderboard: ', error);
        }).then(reloadLeaderboard, reloadLeaderboard);
    }

    function reloadLeaderboard() {
        console.log('reload leaderboard');
        $timeout(loadLeaderboard, (60*1000) * 10);
    }

    loadLeaderboard();
}]);
