//Twitter
var twitterBaseUri = 'http://localhost:9001/';
var twitterSearchCriteria = 'devoxx';

// Schedule
var fullScheduleUrl = 'http://cfp.devoxx.be/api/conferences/DV16/speakers';
var dailyScheduleUrl = 'http://cfp.devoxx.be/api/conferences/DV16/schedules/';
var talkTypesInSchedule = ['Conference', 'Quickie', 'BOF (Bird of a Feather)', 'University', 'Hand\'s on Labs', 'Tools-in-Action', 'Startup presentation', 'Keynote'];

// Voting
var hasVoting = true;
var dayNumberToName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
var topOfWeekUrl = 'https://api-voting.devoxx.com/DV15/top/talks?limit=10';
var topOfDayUrl = 'https://api-voting.devoxx.com/DV15/top/talks?limit=10&day=';

// Devoxx Hunt leaderboard
var gameLeaderBoardUrl = '/blebackend/leaderboard';
