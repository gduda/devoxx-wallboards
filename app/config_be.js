//Twitter
var twitterBaseUri = 'http://ec2-54-194-162-191.eu-west-1.compute.amazonaws.com:9001/';

// Schedule
// var fullScheduleUrl = 'http://localhost:9000/api/conferences/DV17/speakers';
// var dailyScheduleUrl = 'http://localhost:9000/api/conferences/DV17/schedules/';
var fullScheduleUrl = '/api/conferences/DV17/speakers';
var dailyScheduleUrl = '/api/conferences/DV17/schedules/';
var talkTypesInSchedule = ['Conference', 'Quickie', 'BOF (Bird of a Feather)', 'University', 'Hand\'s on Labs', 'Tools-in-Action', 'Startup presentation', 'Keynote'];

// Voting
var hasVoting = true;
var dayNumberToName = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
var topOfWeekUrl = 'https://localhost:9000/api/voting/v1/top/talks?limit=7';
var topOfDayUrl = 'https://localhost:9000/api/voting/v1/top/talks?limit=7&day=';

// Devoxx Hunt leaderboard
var gameLeaderBoardUrl = '/blebackend/leaderboard';
