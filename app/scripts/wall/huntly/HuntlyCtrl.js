'use strict';
/* globals angular: false */

wallApp.controller('HuntlyCtrl', function ($scope, HuntlyService) {
    var vm = this;

    vm.loading = true;

    function retrieveLeaderboard() {
        HuntlyService.leaderboard.then(function (data) {
            vm.leaderboard = data;
            vm.loading = false;
        });
    }

    retrieveLeaderboard();

});

wallApp.service('HuntlyService', function ($http, $interval, $rootScope) {
    var self = this;
    // var deploymentId = 125;

    // var contestIdSocial = 251;
    // var contestIdUni = 252;
    // var contestIdConf1 = 253;
    // var contestIdConf2 = 254;
    // var contestIdMapping = [contestIdSocial, contestIdUni, contestIdUni, contestIdConf1, contestIdConf2, contestIdConf2, contestIdSocial];

    function getHuntlyUrl() {
        // var currentTime = getCurrentTime();
        // var currentDay = currentTime.getDay();
        var contestId = 340;//contestIdMapping[currentDay];
        if (contestId) {
            return null; //'https://srv.huntlyapp.com/deployments/' + deploymentId + '/leaderboards/' + contestId + '/topten ';
        } else {
            return null;
        }
    }

    function updateModels(response) {
        return response.data.slice(0, 6);
    }

    function handleError(response) {
        console.log('An error occurred retrieving Huntly data: ', response);
    }

    function retrieveLeaderboard() {
        var huntlyUrl = getHuntlyUrl();
        if (huntlyUrl) {
            self.leaderboard = $http.get(huntlyUrl).then(updateModels, handleError);
        }
    }

    retrieveLeaderboard();
    self.stopInterval = $interval(retrieveLeaderboard, 60000);

    $rootScope.$on('$destroy', function() {
        if (angular.isDefined(self.stopInterval)) {
            $interval.cancel(self.stopInterval);
            self.stopInterval = undefined;
        }
    });

});