'use strict';
/* globals angular: false */
/* globals topOfWeekUrl: false */
/* globals topOfDayUrl: false */
/* globals dayNumberToName: false */
/* globals getCurrentTime: false */
wallApp.service('VotingService', function($http, $interval, $rootScope) {
    var self = this;

    function retrieveTopOfWeek() {
        self.topOfWeek = $http.get(topOfWeekUrl).then(function (req) {
            return req.data;
        });
    }

    function retrieveTopOfDay() {
        var dayNumber = getCurrentTime().getDay();
        var topOfDayUrlComplete = topOfDayUrl + dayNumberToName[dayNumber];

        self.topOfDay = $http.get(topOfDayUrlComplete).then(function (req) {
            return req.data;
        });
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
