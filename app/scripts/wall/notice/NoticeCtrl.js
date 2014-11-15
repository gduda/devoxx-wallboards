"use strict";

wallApp.controller('NoticeCtrl', [ '$scope', function ($scope) {

    var self = this;

    this.notices = [ "WIFI SSID: devoxx14 password: devoxx14" ]; // <- Add String messages here

    setInterval(cycleNotices, 10 * 1000);
    var noticeIndex = 0;

    $scope.notice = this.notices.length > 0 ? this.notices[0] : null;

    function cycleNotices() {

        $scope.$apply(function () {

            if (self.notices.length == 0) {
                $scope.notice = null;
            } else {
                if (noticeIndex >= self.notices.length) {
                    noticeIndex = 0;
                }
                $scope.notice = self.notices[noticeIndex];
                noticeIndex++;
            }
        });
    }
}]);
