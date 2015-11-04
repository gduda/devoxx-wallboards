var wallApp = angular.module('wallApp', []);

var lastTimestamp = Number.MAX_VALUE
setInterval(function () {
    $.ajax({
        url: 'timestamp.json'
    }).done(function (response) {
        if (response.timestamp > lastTimestamp) {
            document.location.reload();
        } else {
            lastTimestamp = response.timestamp;
        }
    });
}, 10000);
