"use strict";

wallApp.factory('VotingService', ['$http', '$q', function($http, $q) {

    var dayNumberToName = ['sunday', 'monday', 'tuesday', 'thursday', 'friday', 'saturday'];
    var dayNumber = new Date().getDay();
    var topOfWeekUrl = 'https://api-voting.devoxx.com/DV15/top/talks?limit=5';
    var topOfDayUrl = 'https://api-voting.devoxx.com/DV15/top/talks?limit=5&day=' + dayNumberToName[dayNumber];

    return {
        topOfWeek: function() {
            var defer = $q.defer();

            $http.get(topOfWeekUrl).success(function(data, status, headers, config) {
                defer.resolve(data);
            }).error(function(data, status, headers, config) {
                defer.reject(data);
            });

            return defer.promise;
        },
        topOfDay : function() {
            var defer = $q.defer();

            $http.get(topOfDayUrl).success(function(data, status, headers, config) {
                defer.resolve(data);
            }).error(function(data, status, headers, config) {
                defer.reject(data);
            });

            return defer.promise;
        }
    }
}] );
