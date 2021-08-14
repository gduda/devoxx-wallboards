'use strict';
// /* globals twitterBaseUri: false */
wallApp.controller('TweetWallCtrl', function (/*$http, $scope, $timeout, TweetsLocalStorageService*/) {
    // window.tc = this;
    // var self = this;
    //
    // var MAX = 5;
    // var maxTweetId = 0;
    //
    // self.tweetQueue = [];
    // self.tweets = [];
    //
    // this.refreshRemoteData = function () {
    //
    //     var fromTimestamp = TweetsLocalStorageService.getLastShownTimestamp();
    //     $http.get(twitterBaseUri + 'tweets/' + fromTimestamp)
    //         .then(function (data) {
    //             var orderedTweets = _.sortBy(data.data, 'timestamp');
    //
    //             orderedTweets.forEach(function (tweet) {
    //                 // Prevent the latest search results from popping up multiple times in our queue
    //                 if (maxTweetId < tweet.id) {
    //                     maxTweetId = tweet.id;
    //                     self.tweetQueue.push(tweet);
    //                 }
    //             });
    //
    //             if (self.tweets.length === 0) {
    //                 setTimeout(self.tweetQueueProcessor, 0); // Populate on init (via timeout to avoid nested scope.apply)
    //             }
    //         });
    // };
    //
    // this.tweetQueueProcessor = function () {
    //     $scope.$apply(function () {
    //         var tweet;
    //
    //         // Initialisation
    //         if (self.tweets.length < MAX) {
    //             while (self.tweets.length < MAX && self.tweetQueue.length > 0) {
    //                 tweet = self.tweetQueue.shift();
    //                 tweet.styleClass = 'animated fadeIn';
    //                 self.tweets.push(tweet);
    //             }
    //         }
    //         // Regular operation
    //         else if (self.tweetQueue.length > 0) {
    //             shiftTweets();
    //         }
    //
    //     });
    //
    //     function shiftTweets() {
    //         if (self.tweets.length > 0) {
    //             self.tweets = self.tweets.map(function (t, idx) {
    //                 if (idx === 0) {
    //                     t.styleClass = 'animated fadeOut';
    //                 } else {
    //                     t.styleClass = 'animated moveUp';
    //                 }
    //                 return t;
    //             });
    //
    //             $timeout(function () {
    //                 self.tweets = self.tweets.slice(1).map(function (t) {
    //                     t.styleClass = '';
    //                     return t;
    //                 });
    //                 addTweet();
    //             }, 1500);
    //         } else {
    //             addTweet();
    //         }
    //     }
    //
    //     function addTweet() {
    //         var tweet = self.tweetQueue.shift();
    //         tweet.styleClass = 'animated fadeIn';
    //         self.tweets.push(tweet);
    //
    //         if (self.tweets[0]) {
    //             TweetsLocalStorageService.setLastShownTimestamp(self.tweets[0].timestamp);
    //         }
    //     }
    // };
    //
    // setTimeout(init, 0);
    // function init() {
    //     self.refreshRemoteData();
    //     setInterval(self.refreshRemoteData, 30000);
    //     setInterval(self.tweetQueueProcessor, 5000);
    // }
});

wallApp.service('TweetsLocalStorageService', function () {
    var self = this;
    self.lastShownTimestamp = 0;
    try {
        self.lastShownTimestamp = localStorage.getItem('tweetsLastShownTimestamp') || 0;
    } catch (e) {
        console.error('Error retrieving lastTimestamp from local storage, using 0 as default', e);
    }

    self.getLastShownTimestamp = function () {
        return self.lastShownTimestamp;
    };

    self.setLastShownTimestamp = function (lastShownTimestamp) {
        localStorage.setItem('tweetsLastShownTimestamp', lastShownTimestamp);
    };

});
