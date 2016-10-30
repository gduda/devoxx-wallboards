'use strict';

wallApp.controller('HuntlyCtrl', function ($http, $scope, $interval) {
    var vm = this;
    var contestId = 48;
    var deploymentId = '11';
    var huntlyApiUrl = 'https://huntly-devel.scalac.io/deployments/' + deploymentId + '/leaderboards/sorted';

    vm.loading = true;

    function updateModels(response) {
        vm.leaderboard = _.flatten(response.data.rows.filter(function (row) {
            return row.contestId === contestId;
        }).map(function (row) {
            row.leaderBoardRows.push({username: 'JK1', credits: 5});
            row.leaderBoardRows.push({username: 'JK2', credits: 51});
            row.leaderBoardRows.push({username: 'JK3', credits: 15});
            row.leaderBoardRows.push({username: 'JK4', credits: 35});
            return row.leaderBoardRows.slice(0, 6);
        }));
        vm.loading = false;
    }

    function handleError(response) {
        console.log('An error occurred retrieving Huntly data: ' + response);
    }

    function retrieveLeaderboard() {
        $http.get(huntlyApiUrl, {
            headers: {
                'Authorization': 'Basic bGVhZGVyYm9hcmQ6bjZqMzNxcUw='
            }
        }).then(updateModels, handleError);
    }

    retrieveLeaderboard();
    vm.stopIntervalPanes = $interval(retrieveLeaderboard, 30000);
    $scope.$on('$destroy', function() {
        if (angular.isDefined(vm.stopIntervalPanes)) {
            $interval.cancel(vm.stopIntervalPanes);
            vm.stopIntervalPanes = undefined;
        }
    });

});