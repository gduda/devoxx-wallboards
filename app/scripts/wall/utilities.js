'use strict';
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

function getCurrentTime() {
    //return new Date('November 9, 2016 10:24:00');
    return new Date();
}
