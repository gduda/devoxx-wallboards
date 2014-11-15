"use strict";

wallApp.factory('VotingService', ['$http', '$q', function($http, $q) {
    var topOfWeekUrl = "http://172.19.0.252:3000/bestofweek";
    var topOfDayUrl = "http://172.19.0.252:3000/bestoftoday";

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
        topOfDay : function(callback) {
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
