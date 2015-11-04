"use strict";

var twitterSearchCriteria = 'devoxx';

wallApp.controller('TweetWallCtrl', ['$http', '$scope', function ($http, $scope) {

    window.tc = this;
    var self = this;

    var MAX = 4;
    var maxTweetId = 0;

    this.tweetQueue = [];
    self.tweets = [];
    self.scrollClass = "";

    this.refreshRemoteData = function () {

        $http.get(twitterBaseUri + "tweets/" + twitterSearchCriteria)
            .then(function (data) {

                var orderedTweets = _.sortBy(data.data, "id");

                orderedTweets.forEach(function (result) {
                    var tweet = new Tweet(result);
                    // Prevent the latest search results from popping up multiple times in our queue
                    if (maxTweetId < tweet.id) {
                        maxTweetId = tweet.id;
                        self.tweetQueue.push(tweet);
                    }
                });

                if (self.tweets.length == 0) {
                    setTimeout(self.tweetQueueProcessor, 0); // Populate on init (via timeout to avoid nested scope.apply)
                }
            });
    };

    this.tweetQueueProcessor = function () {
        $scope.$apply(function () {

            // Initialisation
            if (self.tweets.length < MAX) {
                while (self.tweets.length < MAX && self.tweetQueue.length > 0) {
                    self.tweets.push(self.tweetQueue.shift());
                }

            }
            // Regular operation
            else if (self.tweetQueue.length > 0) {
                self.tweets.push(self.tweetQueue.shift());
                self.scrollClass = "scrollup";
                setTimeout(shiftTweets, 1900);
            }

        });

        function shiftTweets() {

            $scope.$apply(function () {
                self.tweets.shift();
                self.scrollClass = "";
            });
        }
    };

    setTimeout(init, 0);
    function init() {
        self.refreshRemoteData();
        setInterval(self.refreshRemoteData, 10000);
        setInterval(self.tweetQueueProcessor, 3000);
    }
}]);
