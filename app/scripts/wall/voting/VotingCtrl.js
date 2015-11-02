"use strict";

wallApp.controller('VotingCtrl', [ "$timeout", "VotingService", function ($timeout, VotingService) {
    var self = this;
    self.loadingWeek = true;
    self.loadingDay = true;
    VotingService.topOfWeek().then(function (data) {
        self.topTalksOfWeek = data.talks;
        self.loadingWeek = false;
    });
    VotingService.topOfDay().then(function (data) {
        self.topTalksOfDay = data.talks;
        self.loadingDay = false;
    });
}]);
