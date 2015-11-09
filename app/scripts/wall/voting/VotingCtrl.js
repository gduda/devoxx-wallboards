"use strict";

wallApp.controller('VotingCtrl', [ "$timeout", "$interval", "VotingService", function ($timeout, $interval, VotingService) {
    var self = this;
    self.loadingWeek = true;
    self.loadingDay = true;

    function retrieveVotes () {
        VotingService.topOfWeek().then(function (data) {
            self.topTalksOfWeek = data.talks;
            self.loadingWeek = false;
        });
        VotingService.topOfDay().then(function (data) {
            self.topTalksOfDay = data.talks;
            self.loadingDay = false;
        });
    }

    retrieveVotes();
    $interval(retrieveVotes, 10000);
}]);
