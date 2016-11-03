
/**
 * LocalStorageService, instantiated by AngularJS.
 * @param $xhr
 * @param $defer
 * @param $updateView
 */
wallApp.factory('LocalStorageService', function () {
    var DAY_KEY = 'day_';
    var DAYMD5_KEY = 'md5_' + DAY_KEY;
    var SPEAKER_KEY = 'speaker';
    var SCHEDULE_KEY = 'schedule';
    var STORAGE_TIMESTAMP = '_timestamp';

    var self = this;

    this.hasDay = function (dayNr) {
        try {
            return localStorage.getItem(key(dayNr)) !== null;
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
            var json = typeof(dayScheduleItems) === 'string' ? dayScheduleItems : JSON.stringify(dayScheduleItems);
            var hashFromJson = md5(json);
            var hashFromStorage = localStorage.getItem(keymd5(dayNr));
            return hashFromStorage !== hashFromJson;
        } catch (e) {
            console.error('Error MD5 day ' + dayNr + ' from LocalStorage: ' + e.message);
        }
        return true;
    };

    this.getDay = function (dayNr) {
        try {
            console.log('GET day ' + dayNr + ' from LocalStorage');
            var data = localStorage.getItem(key(dayNr));
            if (angular.isUndefined(data)) {
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
                if (!angular.isUndefined(data)) {
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
            return !(angular.isUndefined(data) || data === null);
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
            if (angular.isUndefined(data)) {
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
        if (typeof(dayNr) === 'number' && dayNr >= 0 && dayNr <= 6) {
            return;
        }
        console.error('Invalid dayNr: ' + dayNr);
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
        setSchedule: this.setSchedule,
        clear: this.clear
    };
});