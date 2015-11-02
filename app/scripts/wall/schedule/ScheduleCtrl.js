"use strict";

var scheduleLoaded = {
    defer: undefined,
    promise: undefined
};


var eventId = "13";

/**
 * ScheduleController, instantiated by AngularJS.
 * @param $xhr
 * @param $defer
 * @param $updateView
 */
wallApp.controller('ScheduleCtrl', ['$http', '$scope', '$q', 'LocalStorageService', function ($http, $scope, $q, LocalStorageService) {
    scheduleLoaded.defer = $q.defer();
    scheduleLoaded.promise = scheduleLoaded.defer.promise;
    window.sc = this; // Global var to interact with from console

    var self = this;

    this.scheduleNow = [];
    this.scheduleNext = [];
    this.loading = true;

    var speakers = [];

    var currentTime = new Date();
    var currentDay = currentTime.getDay();
    var currentData = [];

    var onDone = function () {
        if ((!LocalStorageService.hasDay(currentDay)) || (!LocalStorageService.hasSchedule())) {
            self.refreshRemoteData();
        } else {
            currentData = LocalStorageService.getDay(currentDay);
            updateModels();
        }

        console.log("Resolve after speakers");
        scheduleLoaded.defer.resolve();
        self.loading = false;

        var MINUTES_10 = 1000 * 60 * 10;
        setInterval(self.refreshRemoteData, MINUTES_10);
    };

    setTimeout(function() {
        preLoadSpeakerImageUrls(onDone);
    }, 0);

    function preLoadSpeakerImageUrls(done) {
        console.log('Preloading all speaker images...');
        try {
            var speakersFromCache = LocalStorageService.getSpeakers();
            if (speakersFromCache) {
                speakers = speakersFromCache;
                done();
            } else {
                var fullScheduleUrl = 'http://cfp.devoxx.be/api/conferences/DV15/speakers';
                $http.get(fullScheduleUrl)
                    .then(function (data, code) {
                        if ("" == data.data) {
                            console.error('Failed to call CFP REST');
                            speakers = LocalStorageService.getSpeakers();
                        } else {
                            data.data.forEach(function (item) {
                                speakers.push(new Speaker(item));
                            });

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
        currentTime = new Date();
        var dayNr = currentTime.getDay();
        if (dayNr != currentDay) {
            currentDay = dayNr;
            currentData = LocalStorageService.getDay(dayNr);
        }
        console.log("NowAndNextTime", currentTime.toLongDateString(), currentDay);
        $scope.$apply(updateModels);
    };

    var MINUTES_1 = 1000 * 60;
    setInterval(self.nowAndNextTimer, MINUTES_1);

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
        var dayName = getDayName(new Date().getDay());
        $http.get('http://cfp.devoxx.be/api/conferences/DV15/schedules/' + dayName)
            .then(function (data, code) {
                if ("" == data.data) {
                    console.error('Failed to call CFP REST');
                    return;
                }
                console.log("Received Schedule");

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
                    /*var changed =*/
                    LocalStorageService.setDay(itemDay, group);
                    //if (changed && currentDay == itemDay) {
                    //    currentData = group;
                    //    updateModels();
                    //}
                }
console.log('currentdata1', currentData);
console.log('groups', groups);
                currentData = groups[currentDay - 1];
console.log('currentdata2', currentData);
                updateModels();

            }).then(scheduleLoaded.defer.resolve);
    };

    function updateModels() {
        console.log('ScheduleItem data changed for day ' + currentDay + ' updating models...');

        self.scheduleNow = [];
        self.scheduleNext = [];

        var slots = defineSlots(currentData);
        var nowAndNext = nowAndNextSlot(slots);

        self.scheduleNow = filterTime(nowAndNext[0]);
        self.scheduleNext = filterTime(nowAndNext[1]);

        console.log("Slots", slots, "NowAndNext", nowAndNext);
        console.log("NOW:", self.scheduleNow);
        console.log("NEXT:", self.scheduleNext);

        function defineSlots(items) {
            var slots = [];
            items.forEach(function (item) {
                var slot = item.time;
                if (slots.indexOf(slot) == -1) {
                    slots.push(slot);
                }
            });
            return slots;
        }

        function nowAndNextSlot(slots) {
            var nowAndNext = [];
            var now = currentTime;
            for (var i = 0; i < slots.length; i++) {
                var slot = slots[i];
                var slotDate = Date.parseExact(slot, "HH:mm").withDate(now);

                if (now.after(slotDate)) {
                    nowAndNext[0] = slot;
                    nowAndNext[1] = slots[i + 1];
                }
            }
            if (!nowAndNext.length) {
                var firstSlotDate = Date.parseExact(slots[0], "HH:mm").withDate(now);
                var beforeFirstSlot = now.before(firstSlotDate);
                if (beforeFirstSlot) {
                    nowAndNext[0] = slots[0];
                    nowAndNext[1] = slots[1];
                }
            }
            return nowAndNext;
        }

        function filterTime(time) {
            if (time == undefined) {
                return [];
            }
            var items = [];
            currentData.forEach(function (item) {
                if (time == item.time) {
                    items.push(item);
                }
            });
            return items;
        }
    }

    function filterTalksAndKeynotes(data, speakers) {
        var talks = [];

        data.slots.forEach(function (slot) {
            var talk = slot.talk;
            if (talk &&
                   (talk.talkType === 'Conference' ||
                    talk.talkType === 'Quickie' ||
                    talk.talkType === 'BOF (Bird of a Feather)' ||
                    talk.talkType === 'University' ||
                    talk.talkType === 'Hand\'s on Labs' ||
                    talk.talkType === 'Keynote')) {
                if (talk.speakers) {
                    var si = new ScheduleItem(slot, findSpeakerImageUrl);
                    talks.push(si);
                }
            }
        });

        talks = _.sortBy(talks, "date");
        //_.each(talks, function (si) {
        //console.log("Day: " + si.day + " Room: " + si.room + " Time: " + si.time + " Title: " + si.title + " Speakers: " + si.speakers + " SpeakerImg: " + si.speakerImgUri);
        //});

        function findSpeakerImageUrl(id) {
            if (id) {
                var speakerId = parseInt(id);
                var speakerUrl = null;
                speakers.forEach(function (speaker) {
                    if (speaker.id == speakerId) {
                        speakerUrl = speaker.imageUrl;
                    }
                });

                return speakerUrl
            }
        }

        return talks;
    }
}]);

wallApp.factory('LocalStorageService', ['$http', function ($http) {
    var DAY_KEY = 'day_';
    var DAYMD5_KEY = 'md5_' + DAY_KEY;
    var SPEAKER_KEY = 'speaker';
    var SCHEDULE_KEY = 'schedule';
    var STORAGE_TIMESTAMP = '_timestamp';

    var self = this;

    this.hasDay = function (dayNr) {
        try {
            return localStorage.getItem(key(dayNr)) != null;
        } catch (e) {
            console.error('Error HAS day ' + dayNr + ' in LocalStorage: ' + e.message);
        }
        return false;
    };

    /**
     * Check if the ScheduleItems Array has changed.
     * @param dayNr the Day NR
     * @param dayScheduleItems ScheduleItems Array or JSON stringified
     */
    this.hasChanged = function (dayNr, dayScheduleItems) {
        try {
            var json = typeof(dayScheduleItems) == "string" ? dayScheduleItems : JSON.stringify(dayScheduleItems);
            var hashFromJson = md5(json);
            var hashFromStorage = localStorage.getItem(keymd5(dayNr));
            return hashFromStorage != hashFromJson;
        } catch (e) {
            console.error('Error MD5 day ' + dayNr + ' from LocalStorage: ' + e.message);
        }
        return true;
    };

    this.getDay = function (dayNr) {
        try {
            console.log('GET day ' + dayNr + ' from LocalStorage');
            var data = localStorage.getItem(key(dayNr));
            if (data == undefined) {
                return data;
            } else {
                return JSON.parse(data);
            }
        } catch (e) {
            console.error('Error GET day ' + dayNr + ' from LocalStorage: ' + e.message);
        }
    };

    /**
     * Set the ScheduleItems for a day.
     * @param dayNr day NR
     * @param dayScheduleItems ScheduleItems Array
     * @return boolean true if the data was changed, false if it's not changed or stored
     */
    this.setDay = function (dayNr, dayScheduleItems) {
        try {
            console.log('SET day ' + dayNr + ' to LocalStorage');
            var json = JSON.stringify(dayScheduleItems);
            if (self.hasChanged(dayNr, json)) {
                var hash = md5(json);
                localStorage.setItem(key(dayNr), json);
                localStorage.setItem(keymd5(dayNr), hash);
                console.log('ScheduleItems changed for day ' + dayNr);
                logStorageSize();
                return true;
            }
        } catch (e) {
            console.error('Error SET day ' + dayNr + ' to LocalStorage: ' + e.message);
        }
        return false;
    };

    function createTimestamp() {
        return new Date().getTime();
    }

    this.setSpeakers = function (speakers) {
        try {
            localStorage.setItem(SPEAKER_KEY, JSON.stringify(speakers));
            localStorage.setItem(SPEAKER_KEY + STORAGE_TIMESTAMP, createTimestamp());
            logStorageSize();
        } catch (e) {
            console.error('ERROR Storing Speakers error: ' + e.message);
        }
    };

    this.getSpeakers = function () {
        try {
            var timestamp = localStorage.getItem(SPEAKER_KEY + STORAGE_TIMESTAMP);
            if (timestamp > createTimestamp() - 1000 * 60 * 60) {
                var data = localStorage.getItem(SPEAKER_KEY);
                if (data != undefined) {
                    return JSON.parse(data);
                }
            }
        } catch (e) {
            console.error('ERROR Loading Speakers error: ' + e.message);
        }
        return undefined;
    };

    this.clear = function () {
        try {
            localStorage.clear();
            logStorageSize();
        } catch (e) {
            console.error('Error clearing LocalStorage: ' + e.message);
        }
    };

    this.hasSchedule = function () {
        try {
            var data = localStorage.getItem(SCHEDULE_KEY);
            return !(data == undefined || data == null);
        } catch (e) {
            return false;
        }
    };

    this.setSchedule = function (scheduleItems) {
        var map = {};
        for (var i = 0; i < scheduleItems.length; i++) {
            map[scheduleItems[i].id] = scheduleItems[i];
        }
        localStorage.setItem(SCHEDULE_KEY, JSON.stringify(map));
    };

    this.getSchedule = function () {
        try {
            var data = localStorage.getItem(SCHEDULE_KEY);
            if (data == undefined) {
                return data;
            } else {
                return JSON.parse(data);
            }
        } catch (e) {
            console.error('ERROR Loading Speakers error: ' + e.message);
        }
    };

    function key(dayNr) {
        checkDay(dayNr);
        return DAY_KEY + dayNr;
    }

    function keymd5(dayNr) {
        checkDay(dayNr);
        return DAYMD5_KEY + dayNr;
    }

    function checkDay(dayNr) {
        if (typeof(dayNr) == 'number' && dayNr >= 0 && dayNr <= 6) {
            return;
        }
        console.error("Invalid dayNr: " + dayNr);
    }

    function logStorageSize() {
        var size = 0;
        for (var i = 0; i < localStorage.length; i++) {
            size += localStorage.getItem(localStorage.key(i)).length;
        }
        console.log(size, 'Bytes in LocalStorage,', 2.5 * 1024 * 1024 - size, 'available.');
    }

    return {
        hasDay: this.hasDay,
        getDay: this.getDay,
        setDay: this.setDay,
        getSpeakers: this.getSpeakers,
        setSpeakers: this.setSpeakers,
        hasSchedule: this.hasSchedule,
        getSchedule: this.getSchedule,
        setSchedule: this.setSchedule
    };
}]);
