"use strict";

describe('Game Leaderboard Ctrl', function () {

    beforeEach(module('wallApp'));

    var $controller, $scope, $timeout, $q, GameLeaderboardService;

    beforeEach(inject(function(_$rootScope_, _$controller_, _$timeout_, _$q_, _GameLeaderboardService_) {
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        $timeout = _$timeout_;
        $q = _$q_;
        GameLeaderboardService = _GameLeaderboardService_;
    }));

    it('Should load the board', function () {
        var result = [
            {"points":500, "name":"First player", "pictureUrl":"picUrl2"},
            {"points":200, "name":"Second player", "pictureUrl":"picUrl2"}
        ];
        spyOn(GameLeaderboardService, 'loadLeaderboard').and.callFake(function () {
            var defer = $q.defer();
            defer.resolve(result);
            return defer.promise;
        });
        $controller('GameLeaderboardCtrl', {$scope: $scope, $timeout: $timeout, GameLeaderboardService: GameLeaderboardService});
        $timeout.flush();

        expect($scope.leaderboard).toBe(result);
        expect($scope.loading).toBe(false);
    });

    it('Should load empty boards', function () {
        var result = [];
        spyOn(GameLeaderboardService, 'loadLeaderboard').and.callFake(function () {
            var defer = $q.defer();
            defer.resolve(result);
            return defer.promise;
        });
        $controller('GameLeaderboardCtrl', {$scope: $scope, $timeout: $timeout, GameLeaderboardService: GameLeaderboardService});
        $timeout.flush();

        expect($scope.leaderboard).toBe(result);
        expect($scope.loading).toBe(false);
    });

    it('Should handle server errors', function () {
        var result = 'error from server';
        spyOn(GameLeaderboardService, 'loadLeaderboard').and.callFake(function () {
            var defer = $q.defer();
            defer.reject(result);
            return defer.promise;
        });
        $controller('GameLeaderboardCtrl', {$scope: $scope, $timeout: $timeout, GameLeaderboardService: GameLeaderboardService});
        $timeout.flush();

        expect($scope.leaderboard.length).toBe(0);
        expect($scope.loading).toBe(false);
    });

    it('Should be loading initially', function () {
        var result = 'error from server';
        spyOn(GameLeaderboardService, 'loadLeaderboard').and.callFake(function () {
            var defer = $q.defer();
            defer.resolve(result);
            return defer.promise;
        });
        $controller('GameLeaderboardCtrl', {$scope: $scope, $timeout: $timeout, GameLeaderboardService: GameLeaderboardService});

        expect($scope.leaderboard).toBe(undefined);
        expect($scope.loading).toBe(true);
    });

    describe('asynchronous reload of board', function() {
        var $controller, $scope, $timeout, $q, GameLeaderboardService;

        var firstResult = [
            {"points":500, "name":"First player", "pictureUrl":"picUrl"}
        ];
        var secondResult = [
            {"points":500, "name":"First player", "pictureUrl":"picUrl"},
            {"points":200, "name":"Second player", "pictureUrl":"picUrl2"}
        ];

        beforeEach(inject(function(_$rootScope_, _$controller_, _$timeout_, _$q_, _GameLeaderboardService_) {
            $scope = _$rootScope_.$new();
            $controller = _$controller_;
            $timeout = _$timeout_;
            $q = _$q_;
            GameLeaderboardService = _GameLeaderboardService_;

            spyOn(GameLeaderboardService, 'loadLeaderboard').and.callFake(function () {
                var defer = $q.defer();
                var index = GameLeaderboardService.loadLeaderboard.calls.count() ;
                switch (index) {
                    case 1:
                        defer.resolve(firstResult);
                        break;
                    case 2:
                        defer.resolve(secondResult);
                        break;
                    default:
                        throw new Error('Too many calls')
                }

                return defer.promise;
            });
        }));

        beforeEach(function(done) {
            $scope.reloadInterval = 100;
            $controller('GameLeaderboardCtrl', {$scope: $scope, $timeout: $timeout, GameLeaderboardService: GameLeaderboardService});
            $timeout.flush();

            expect(GameLeaderboardService.loadLeaderboard.calls.count()).toBe(1);
            expect($scope.leaderboard).toBe(firstResult);
            setTimeout(function() {
                $timeout.flush();
                done();
            }, 100);
        });

        it('Should reload the board', function (done) {
            expect(GameLeaderboardService.loadLeaderboard.calls.count()).toBe(2);
            expect($scope.leaderboard).toBe(secondResult);

            done();
        });
    });
});
