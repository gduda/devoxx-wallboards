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

var urlParams;
(function() {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, ' ')); },
        query  = window.location.search.substring(1);

    urlParams = {};
    while (!!(match = search.exec(query))) {
        urlParams[decode(match[1])] = decode(match[2]);
    }
    console.log('urlParams', urlParams);
})();

function getCurrentTime() {
    //return new Date('November 9, 2016 10:24:00');
    if (urlParams && urlParams.currentTime) {
        var date = new Date(urlParams.currentTime);
        console.log('currentTime set', urlParams.currentTime, date);
        return date;
    } else {
        console.log('currentTime not set');
        return new Date();
    }
}
