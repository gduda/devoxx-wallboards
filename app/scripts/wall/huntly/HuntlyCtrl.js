'use strict';
/* globals angular: false */
/* globals getCurrentTime: false */

wallApp.controller('HuntlyCtrl', function ($scope, $interval, HuntlyService) {
    var vm = this;

    vm.loading = true;

    function retrieveLeaderboard() {
        HuntlyService.retrieveLeaderboard().then(function (data) {
            vm.leaderboard = data;
            vm.loading = false;
        });
    }

    retrieveLeaderboard();
    vm.stopIntervalPanes = $interval(retrieveLeaderboard, 30000);

    $scope.$on('$destroy', function() {
        if (angular.isDefined(vm.stopIntervalPanes)) {
            $interval.cancel(vm.stopIntervalPanes);
            vm.stopIntervalPanes = undefined;
        }
    });

}).service('HuntlyService', function ($http) {
    var deploymentId = 83;

    var contestIdSocial = 251;
    var contestIdUni = 252;
    var contestIdConf1 = 253;
    var contestIdConf2 = 254;
    var contestIdMapping = [contestIdSocial, contestIdUni, contestIdUni, contestIdConf1, contestIdConf2, contestIdConf2, contestIdSocial];

    function getHuntlyUrl() {
        var currentTime = getCurrentTime();
        var currentDay = currentTime.getDay();
        var contestId = contestIdMapping[currentDay];
        if (contestId) {
            return 'https://huntlyapp.com/deployments/' + deploymentId + '/leaderboards/' + contestId + '/topten ';
        } else {
            return null;
        }
    }

    function updateModels(response) {
        return response.data.slice(0, 6);
    }

    function handleError(response) {
        console.log('An error occurred retrieving Huntly data: ' + response);
    }

    this.retrieveLeaderboard = function() {
        var huntlyUrl = getHuntlyUrl();
        if (huntlyUrl) {
            return $http.get(huntlyUrl).then(updateModels, handleError);
        }
    };

});