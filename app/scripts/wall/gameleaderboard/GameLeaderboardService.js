"use strict";

wallApp.factory('GameLeaderboardService', ['$http', '$q', function($http, $q) {
    var load = function() {
        var defer = $q.defer();
        $http.get('/blebackend/leaderboard')
            .success(function(data) {
                defer.resolve(data);
            }).error(function(error) {
                defer.reject(error);
            });
        return defer.promise;
    };

    return {
        loadLeaderboard: load
    };
}]);