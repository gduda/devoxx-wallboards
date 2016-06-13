'use strict';
/* globals gameLeaderBoardUrl: false */
wallApp.factory('GameLeaderboardService', function($http, $q) {
    var load = function() {
        var defer = $q.defer();
        $http.get(gameLeaderBoardUrl)
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
});