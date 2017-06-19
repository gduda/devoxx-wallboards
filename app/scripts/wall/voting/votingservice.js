'use strict';
/* globals angular: false */
/* globals topOfWeekUrl: false */
/* globals topOfDayUrl: false */
/* globals dayNumberToName: false */
/* globals getCurrentTime: false */
wallApp.service('VotingService', function($q, $http, $interval, $rootScope) {
    var self = this;

    function retrieveTopOfWeek() {
        if ($rootScope.hasVoting) {
            self.topOfWeek = $http.get(topOfWeekUrl).then(function (req) {
                return req.data;
            });
        } else {
            self.topOfWeek = $q.defer().promise;
        }
    }

    function retrieveTopOfDay() {
        var dayNumber = getCurrentTime().getDay();
        var topOfDayUrlComplete = topOfDayUrl + dayNumberToName[dayNumber];

        if ($rootScope.hasVoting) {
            self.topOfDay = $http.get(topOfDayUrlComplete).then(function (req) {
                return req.data;
            });
        } else {
            self.topOfDay = $q.defer().promise;
        }
    }

    function retrieveVotes() {
        retrieveTopOfWeek();
        retrieveTopOfDay();
    }

    retrieveVotes();
    self.stopInterval = $interval(retrieveVotes, 60000);

    $rootScope.$on('$destroy', function() {
        if (angular.isDefined(self.stopInterval)) {
            $interval.cancel(self.stopInterval);
            self.stopInterval = undefined;
        }
    });

});
