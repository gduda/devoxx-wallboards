'use strict';
/* globals dailyScheduleUrl: false */
/* globals talkTypesInSchedule: false */
/* globals ScheduleItem: false */
/* globals getCurrentTime: false */
wallApp.controller('ScheduleCtrl', function ($http, $scope, $q, $interval, constants) {
    window.sc = this; // Global var to interact with from console

    var self = this;

    this.scheduleNow = [];
    this.scheduleNext = [];
    this.loading = true;
    this.currentPane = 0;
    this.numberOfPanes = 2;

    self.stopIntervalPanes = $interval(function () {
        if (++self.currentPane >= self.numberOfPanes) {
            self.currentPane = 0;
        }
    }, constants.carouselInterval);
    $scope.$on('$destroy', function () {
        if (angular.isDefined(self.stopIntervalPanes)) {
            $interval.cancel(self.stopIntervalPanes);
            self.stopIntervalPanes = undefined;
        }
    });

    var speakers = [];

    var currentTime = getCurrentTime();
    var currentDay = currentTime.getDay();
    var currentData = [];

    this.nowAndNextTimer = function () {
        currentTime = getCurrentTime();
        var dayNr = currentTime.getDay();
        if (dayNr !== currentDay) {
            currentDay = dayNr;
            this.refreshRemoteData();
        }
        console.log('NowAndNextTime', currentTime.toLongDateString(), currentDay);
        updateModels();
    };

    self.getTimeString = function (item) {
        return (item.time.getHours() + '').padStart(2, '0') + ':' +
            (item.time.getMinutes() + '').padStart(2, '0');
    };

    var MINUTES_5 = 5 * 1000 * 60;
    $interval(self.nowAndNextTimer, MINUTES_5);

    function getDayName(dayNr) {
        switch (dayNr) {
            case 0:
                return 'sunday';
            case 1:
                return 'monday';
            case 2:
                return 'tuesday';
            case 3:
                return 'wednesday';
            case 4:
                return 'thursday';
            case 5:
                return 'friday';
            case 6:
                return 'saturday';
            default:
                return 'unknown'; //Should never happen
        }
    }

    this.refreshRemoteData = function () {
        var dayName = getDayName(getCurrentTime().getDay());
        //TODO fill in dailyScheduleUrl
        $http.get(dailyScheduleUrl + dayName).then(function (data) {
            if ('' === data.data) {
                console.error('Failed to call CFP REST');
                return;
            }

            console.log('Received Schedule', data);

            var tak = filterTalksAndKeynotes(data.data, speakers);
            currentData = tak.filter(function (talk) {
                return talk.dayNr === currentDay;
            });

            updateModels();
            self.loading = false;
        });
    };

    function updateModels() {
        console.log('ScheduleItem data changed for day ' + currentDay + ' updating models...');

        self.scheduleNow = [];
        self.scheduleNext = [];

        var slots = defineSlots(currentData);
        var nowAndNext = nowAndNextSlot(slots);

        console.log('currentData', currentData);
        self.scheduleNow = filterTime(nowAndNext[0]);
        self.scheduleNext = filterTime(nowAndNext[1]);

        console.log('Slots', slots, 'NowAndNext', nowAndNext);
        console.log('NOW:', self.scheduleNow);
        console.log('NEXT:', self.scheduleNext);

        function defineSlots(items) {
            var unique = _.uniq(items.map(function (talk) {
                return talk.time.toString();
            })).sort();

            return unique.map(function (timeString, index) {
                var startTime = new Date(timeString.toString());
                var endTime;
                if (unique[index+1]) {
                    endTime = new Date(unique[index+1].toString());
                } else {
                    endTime = new Date(startTime);
                    endTime.setHours(startTime.getHours() + 2);
                }
                return [startTime, endTime];
            });
        }

        function nowAndNextSlot(slots) {
            var nowAndNext = [];
            var now = currentTime;

            var currentAndFutureStartTimes = slots.filter(function (s) {
                return s[1] >= now;
            });

            if (currentAndFutureStartTimes.length === 1) {
                // 1 if the talk has not yet started, 0 if the talk has started.
                // This determines whether or not this is the current or upcoming talk.
                var index = currentAndFutureStartTimes[0][0] > now ? 1 : 0;
                nowAndNext[index] = currentAndFutureStartTimes[0];
            }
            if (currentAndFutureStartTimes.length >= 2) {
                nowAndNext[0] = currentAndFutureStartTimes[0];
                nowAndNext[1] = currentAndFutureStartTimes[1];
            }

            return nowAndNext;
        }

        function filterTime(time) {
            if (angular.isUndefined(time) || angular.isUndefined(time[0])) {
                return [];
            }
            return currentData.filter(function (item) {
                return time[0].toString() === item.time.toString();
            });
        }
    }

    function filterTalksAndKeynotes(data) {
        var talks = [];

        console.log('data', data, talkTypesInSchedule);
        data.forEach(function (talk) {
            if (talk.speakers) {
                var si = new ScheduleItem(talk);
                talks.push(si);
            }
        });

        talks = _.sortBy(talks, 'fromDate');
        _.each(talks, function (si) {
            console.log(' Time: ' + si.time + ' Room: ' + si.room + ' Title: ' + si.title + ' Speakers: ' + si.speakers);
        });

        return talks;
    }

    this.refreshRemoteData();
});

wallApp.directive('onShowAnimate', function ($timeout) {
    return {
        restrict: 'A',
        scope: false,
        link: function (scope, element, attrs) {
            var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
            var classes = 'animated ' + attrs.onShowAnimate;
            // Unfortunately ng-class overwrites the classname, so using a $timeout
            // we apply this animation a bit later.
            $timeout(function () {
                element.addClass(classes).one(animationEnd, function () {
                    $(this).removeClass(classes);
                });
            }, 0);
        }
    };
});
