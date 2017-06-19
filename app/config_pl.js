//Twitter
var twitterBaseUri = 'http://wall.devoxx.com:9001/';

// Schedule
var fullScheduleUrl = 'http://cfp.devoxx.pl/api/conferences/DevoxxPL2017/speakers';
var dailyScheduleUrl = 'http://cfp.devoxx.pl/api/conferences/DevoxxPL2017/schedules/';
var talkTypesInSchedule = ['Conference', 'Quickie', 'BOF (Bird of a Feather)', 'University', 'Hand\'s on Labs', 'Tools-in-Action', 'Startup presentation', 'Keynote'];

// Voting
var hasVoting = true;
var dayNumberToName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
var topOfWeekUrl = 'http://cfp.devoxx.pl/api/voting/v1/top/talks?limit=7';
var topOfDayUrl = 'http://cfp.devoxx.pl/api/voting/v1/top/talks?limit=7&day=';

// Devoxx Hunt leaderboard
var gameLeaderBoardUrl = '/blebackend/leaderboard';
