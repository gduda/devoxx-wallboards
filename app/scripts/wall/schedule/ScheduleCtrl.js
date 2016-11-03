'use strict';
/* globals md5: false */
/* globals fullScheduleUrl: false */
/* globals dailyScheduleUrl: false */
/* globals talkTypesInSchedule: false */
/* globals Speaker: false */
/* globals ScheduleItem: false */

wallApp.controller('ScheduleCtrl', function ($http, $scope, $q, LocalStorageService, $interval) {
    window.sc = this; // Global var to interact with from console

    var self = this;

    this.scheduleNow = [];
    this.scheduleNext = [];
    this.loading = true;
    this.currentPane = 0;

    self.stopIntervalPanes = $interval(function () {
        if (++self.currentPane >= 2) {
            self.currentPane = 0;
        }
    }, 5000);
    $scope.$on('$destroy', function() {
        if (angular.isDefined(self.stopIntervalPanes)) {
            $interval.cancel(self.stopIntervalPanes);
            self.stopIntervalPanes = undefined;
        }
    });

    var speakers = [];

    this.getCurrentTime = function() {
        return new Date('November 9, 2016 10:24:00');
        // return new Date();
    };

    var currentTime = self.getCurrentTime();
    var currentDay = currentTime.getDay();
    var currentData = [];

    var onDone = function () {
        if ((!LocalStorageService.hasDay(currentDay)) || (!LocalStorageService.hasSchedule())) {
            self.refreshRemoteData();
        } else {
            currentData = LocalStorageService.getDay(currentDay);
            console.log('currentData from local storage', currentData, currentDay);
            updateModels();
        }

        console.log('Resolve after speakers');
        self.loading = false;

        var MINUTES_10 = 1000 * 60 * 10;
        $interval(self.refreshRemoteData, MINUTES_10);
    };

    function preLoadSpeakerImageUrls(done) {
        console.log('Preloading all speaker images...');
        try {
            var speakersFromCache = LocalStorageService.getSpeakers();
            if (speakersFromCache) {
                speakers = speakersFromCache;
                console.log(speakers);
                done();
            } else {
                $http.get(fullScheduleUrl)
                    .then(function (data) {
                        if ('' === data.data) {
                            console.error('Failed to call CFP REST');
                            speakers = LocalStorageService.getSpeakers();
                        } else {
                            data.data.forEach(function (item) {
                                speakers.push(new Speaker(item));
                            });
                            console.log(speakers);


                            LocalStorageService.setSpeakers(speakers);
                        }

                        done();
                    });
            }
        } catch (e) {
            console.error('Failed to preload speaker images: ', e);
            done();
        }
    }

    this.nowAndNextTimer = function () {
        currentTime = self.getCurrentTime();
        var dayNr = currentTime.getDay();
        if (dayNr !== currentDay) {
            currentDay = dayNr;
            currentData = LocalStorageService.getDay(dayNr);
        }
        console.log('NowAndNextTime', currentTime.toLongDateString(), currentDay);
        updateModels();
    };

    var MINUTES_1 = 1000 * 60;
    $interval(self.nowAndNextTimer, MINUTES_1);

    function getDayName(dayNr) {
        switch (dayNr) {
            case 0:  return 'sunday';
            case 1:  return 'monday';
            case 2:  return 'tuesday';
            case 3:  return 'wednesday';
            case 4:  return 'thursday';
            case 5:  return 'friday';
            case 6:  return 'saturday';
            default: return 'sunday'; //Should never happen
        }
    }

    this.refreshRemoteData = function () {
        var dayName = getDayName(self.getCurrentTime().getDay());
        //TODO fill in dailyScheduleUrl
        $http.get(dailyScheduleUrl + dayName).then(function (data) {
            if ('' === data.data) {
                console.error('Failed to call CFP REST');
                return;
            }
console.log('Received Schedule');

            var tak = filterTalksAndKeynotes(data.data, speakers);

            LocalStorageService.setSchedule(tak);
            var groups = [];
            tak.forEach(function (item) {
                var itemIndex = (item.dayNr - 1);
                if (!groups[itemIndex]) {
                    groups[itemIndex] = [];
                }
                groups[itemIndex].push(item);
            });

            for (var i = 0; i < groups.length; i++) {
                storeDay(i + 1, groups[i]);
            }
            console.log('stored days');
            function storeDay(itemDay, group) {
                LocalStorageService.setDay(itemDay, group);
            }

            currentData = groups[currentDay - 1];
console.log('groupsda', currentDay);
console.log('groups', groups);
            updateModels();

        });
    };

    function updateModels() {
        console.log('ScheduleItem data changed for day ' + currentDay + ' updating models...');

        self.scheduleNow = [];
        self.scheduleNext = [];

        var slots = defineSlots(currentData);
        var nowAndNext = nowAndNextSlot(slots);
console.log('currentData', currentData);
console.log('slots', slots);
        self.scheduleNow = filterTime(nowAndNext[0]);
        self.scheduleNext = filterTime(nowAndNext[1]);

        // self.scheduleNow.forEach(function (s) {
        //     s.visible = true;
        // });
        // self.scheduleNext.forEach(function (s) {
        //     s.visible = true;
        // });

        console.log('Slots', slots, 'NowAndNext', nowAndNext);
        console.log('NOW:', self.scheduleNow);
        console.log('NEXT:', self.scheduleNext);

        function defineSlots(items) {
            var slots = [];
            if (items) {
                items.forEach(function (item) {
                    var slot = item.time;
                    if (slots.indexOf(slot) === -1) {
                        slots.push(slot);
                    }
                });
            }
            return slots;
        }

        function nowAndNextSlot(slots) {
            var nowAndNext = [];
            var now = currentTime;
            for (var i = 0; i < slots.length; i++) {
                var slot = slots[i];
                var parseExact = Date.parseExact(slot, 'HH:mm');
                if (parseExact) {
                    var slotDate = parseExact.withDate(now);
                    if (now.after(slotDate)) {
                        nowAndNext[0] = slot;
                        nowAndNext[1] = slots[i + 1];
                    }
                }
            }
            if (!nowAndNext.length) {
                var parseExact2 = Date.parseExact(slots[0], 'HH:mm');
                if (parseExact2) {
                    var firstSlotDate = parseExact2.withDate(now);
                    var beforeFirstSlot = now.before(firstSlotDate);
                    if (beforeFirstSlot) {
                        nowAndNext[0] = slots[0];
                        nowAndNext[1] = slots[1];
                    }
                }
            }
            return nowAndNext;
        }

        function filterTime(time) {
            if (angular.isUndefined(time)) {
                return [];
            }
            var items = [];
            currentData.forEach(function (item) {
                if (time === item.time) {
                    items.push(item);
                }
            });
            return items;
        }
    }

    function filterTalksAndKeynotes(data, speakers) {
        var talks = [];
console.log('data.slots', data.slots, talkTypesInSchedule);
console.log('talkTypesInSchedule', talkTypesInSchedule);
        data.slots.forEach(function (slot) {
            var talk = slot.talk;
            if (talk && _.contains(talkTypesInSchedule, talk.talkType)) {
                if (talk.speakers) {
                    var si = new ScheduleItem(slot, findSpeakerImageUrl);
                    talks.push(si);
                }
            }
        });

        talks = _.sortBy(talks, 'date');
        _.each(talks, function (si) {
            console.log('Day: ' + si.day + ' Room: ' + si.room + ' Time: ' + si.time + ' Title: ' + si.title + ' Speakers: ' + si.speakers + ' SpeakerImg: ' + si.speakerImgUri);
        });

        function findSpeakerImageUrl(id) {
            if (id) {
                var speakerId = parseInt(id);
                var speakerUrl = null;
                speakers.forEach(function (speaker) {
                    if (speaker.id === speakerId) {
                        speakerUrl = speaker.imageUrl;
                    }
                });

                return speakerUrl;
            }
        }

        return talks;
    }

    preLoadSpeakerImageUrls(onDone);

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

