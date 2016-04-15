wallApp.factory('VotingService', ['$http', '$q', function($http, $q) {

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

            var dayNumber = new Date().getDay();
            var topOfDayUrlComplete = topOfDayUrl + dayNumberToName[dayNumber]

            $http.get(topOfDayUrlComplete).success(function(data, status, headers, config) {
                defer.resolve(data);
            }).error(function(data, status, headers, config) {
                defer.reject(data);
            });

            return defer.promise;
        }
    }
}] );
