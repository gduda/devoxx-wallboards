'use strict';
/* globals topOfWeekUrl: false */
/* globals topOfDayUrl: false */
/* globals dayNumberToName: false */
/* globals getCurrentTime: false */
wallApp.factory('VotingService', function($http, $q) {

    return {
        topOfWeek: function() {
            var defer = $q.defer();

            $http.get(topOfWeekUrl).success(function(data) {
                defer.resolve(data);
            }).error(function (data) {
                defer.reject(data);
            });

            return defer.promise;
        },
        topOfDay: function() {
            var defer = $q.defer();

            var dayNumber = getCurrentTime().getDay();
            var topOfDayUrlComplete = topOfDayUrl + dayNumberToName[dayNumber];

            $http.get(topOfDayUrlComplete).success(function(data) {
                defer.resolve(data);
            }).error(function(data) {
                defer.reject(data);
            });

            return defer.promise;
        }
    };
});
