'use strict';
/* globals twitterBaseUri: false */
/* globals twitterSearchCriteria: false */
/* globals Tweet: false */
wallApp.controller('TweetWallCtrl', function ($http, $scope, $timeout) {

    window.tc = this;
    var self = this;

    var MAX = 4;
    var maxTweetId = 0;

    this.tweetQueue = [];
    self.tweets = [];
    self.scrollClass = '';
    self.roundRobin = 0;

    var quadrantLeftOffset = 20;
    var quadrantTopOffset = 0;
    var quadrantWidth = 550;
    var quadrantHeight = 300;

    self.assignPosition = function () {
        var leftRnd = (Math.random() * 100);
        var topRnd = (Math.random() * 100);
        self.roundRobin = (self.roundRobin + 1) % 4;
        switch (self.roundRobin) {
            case 0: return {left: leftRnd + quadrantLeftOffset, top: topRnd+quadrantTopOffset};
            case 1: return {left: leftRnd + quadrantLeftOffset, top: topRnd+quadrantHeight};
            case 2: return {left: leftRnd+quadrantWidth, top: topRnd+quadrantTopOffset};
            case 3: return {left: leftRnd+quadrantWidth, top: topRnd+quadrantHeight};
        }
    };

    this.refreshRemoteData = function () {

        $http.get(twitterBaseUri + 'tweets/' + twitterSearchCriteria + '/' + maxTweetId)
            .then(function (data) {

                var orderedTweets = _.sortBy(data.data, 'id');

                orderedTweets.forEach(function (result) {
                    var tweet = new Tweet(result);
                    // Prevent the latest search results from popping up multiple times in our queue
                    if (maxTweetId < tweet.id) {
                        maxTweetId = tweet.id;
                        self.tweetQueue.push(tweet);
                    }
                });

                if (self.tweets.length === 0) {
                    setTimeout(self.tweetQueueProcessor, 0); // Populate on init (via timeout to avoid nested scope.apply)
                }
            });
    };

    this.tweetQueueProcessor = function () {
        $scope.$apply(function () {
            var tweet;

            // Initialisation
            if (self.tweets.length < MAX) {
                while (self.tweets.length < MAX && self.tweetQueue.length > 0) {
                    tweet = self.tweetQueue.shift();
                    var pos = self.assignPosition();
                    tweet.left = pos.left;
                    tweet.top = pos.top;
                    tweet.styleClass = 'animated fadeInUp';
                    self.tweets.push(tweet);
                }

            }
            // Regular operation
            else if (self.tweetQueue.length > 0) {
                shiftTweets();
            }

        });

        function shiftTweets() {
            if (self.tweets.length > 0) {
                self.tweets = self.tweets.map(function (t, idx) {
                    if (idx === 0) {
                        t.styleClass = 'animated fadeOutUp';
                    } else {
                        t.styleClass = 'animated moveUp';
                    }
                    return t;
                });

                $timeout(function () {
                    self.tweets = self.tweets.slice(1).map(function (t) {
                        t.styleClass = '';
                        return t;
                    });
                    addTweet();
                }, 1500);
            } else {
                addTweet();
            }
        }

        function addTweet() {
            var tweet = self.tweetQueue.shift();
            var pos = self.assignPosition();
            tweet.left = pos.left;
            tweet.top = pos.top;
            tweet.styleClass = 'animated fadeInUp';
            self.tweets.push(tweet);
        }
    };

    setTimeout(init, 0);
    function init() {
        self.refreshRemoteData();
        setInterval(self.refreshRemoteData, 10000);
        setInterval(self.tweetQueueProcessor, 30000);
    }
});
