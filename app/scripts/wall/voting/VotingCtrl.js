"use strict";

wallApp.controller('VotingCtrl', ["$scope", "$timeout", "VotingService", function ($scope, $timeout, VotingService) {
    $scope.loadingDay = true;
    $scope.loadingWeek = true;
    function enrich(talks) {
        var schedule = lsc.getSchedule();
        angular.forEach(talks, function (value, key) {
            value.scheduleItem = schedule[value.talkId];
        });
        return talks;
    }

    function filterKeyNotes(talks) {
        var filtered = [];
        angular.forEach(talks, function (value, key) {
            if ((value.scheduleItem) && (value.scheduleItem.type != "Keynote")) {
                filtered.push(value);
            }
        }, filtered);
        return filtered;
    }

    var refreshInterval = 5*1000 * 60;

    function refresh () {
        console.log('VotingService.refresh');
        VotingService.topOfWeek().then(function (data) {
            var filteredData = filterKeyNotes(enrich(data));
            $scope.topTalksOfWeek = filteredData.slice(0, 3);
            $scope.hasTopTalksOfWeek = (filteredData.length > 0);
            $scope.loadingWeek = false;
        }, function(err) {
            console.log("VotingService.topOfWeek Error", err);
        });
        VotingService.topOfDay().then(function (data) {
            var filteredData = filterKeyNotes(enrich(data));
            $scope.topTalksOfDay = filteredData.slice(0, 4);
            $scope.hasTopTalksOfDay = (filteredData.length > 0);
            $scope.loadingDay = false;
        }, function(err) {
            console.log("VotingService.topOfDay Error", err);
        });

        $timeout(refresh, refreshInterval);
    }

    scheduleLoaded.promise.then(refresh);
} ]);
