'use strict';
/* exported day */
/* exported getCurrentTime */
Date.prototype.before = function(other) {
    return this.compareTo(other) < 0;
};
Date.prototype.after = function(other) {
    return this.compareTo(other) > 0;
};
Date.prototype.withDate = function(date) {
    this.setFullYear(date.getFullYear());
    this.setMonth(date.getMonth());
    this.setDate(date.getDate());
    return this;
};

function day(date) {
    var startOfEvent = new Date(2014, 10, 10);
    var theDay = date === undefined ? Date.today() : date;
    var diff = (theDay.getDayOfYear() + 1) - startOfEvent.getDayOfYear();
    var eventDay = diff >= 1 && diff <= 5 ? diff : 1; // Default to day1 to show something
    console.log('Calculated event day: ', eventDay);
    return eventDay;
}

function getCurrentTime() {
    return new Date('November 9, 2016 10:24:00');
    // return new Date();
}
