'use strict';

wallApp.controller('VotingCtrl', function ($timeout, $interval, VotingService) {
    var self = this;
    self.loadingWeek = true;
    self.loadingDay = true;

    function retrieveVotes () {
        VotingService.topOfWeek().then(function (data) {
            if (data.result) {
                self.topTalksOfWeek = data.result.talks;
            } else {
                self.topTalksOfWeek = [];
            }
            self.loadingWeek = false;
        });
        VotingService.topOfDay().then(function (data) {
            if (data.result) {
                self.topTalksOfDay = data.result.talks;
            } else {
                self.topTalksOfDay = [];
            }
            self.loadingDay = false;
        });
    }

    retrieveVotes();
    $interval(retrieveVotes, 10000);
});
