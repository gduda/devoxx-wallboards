'use strict';
/* exported wallApp */
/* global hasVoting: false */
var wallApp = angular.module('wallApp', []);

wallApp.run(function ($rootScope) {
    $rootScope.hasVoting = hasVoting;
});

var lastTimestamp = Number.MAX_VALUE;
setInterval(function () {
    $.getJSON({
        url: 'timestamp.json'
    }).done(function (response) {
        if (response.timestamp > lastTimestamp) {
            document.location.reload();
        } else {
            lastTimestamp = response.timestamp;
        }
    });
}, 10000);
