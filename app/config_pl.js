//Twitter
var twitterBaseUri = 'http://ec2-54-171-145-123.eu-west-1.compute.amazonaws.com:9001/';
var twitterSearchCriteria = 'devoxxpl';

// Schedule
var fullScheduleUrl = 'http://cfp.devoxx.pl/api/conferences/DevoxxPL2016/speakers';
var dailyScheduleUrl = 'http://cfp.devoxx.pl/api/conferences/DevoxxPL2016/schedules/';
var talkTypesInSchedule = ['Conference', 'Quickie', 'BOF (Bird of a Feather)', 'University', 'Hand\'s on Labs', 'Tools-in-Action', 'Startup presentation', 'Keynote'];

// Voting
var dayNumberToName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
var topOfWeekUrl = 'https://api-voting.devoxx.com/DV15/top/talks?limit=10';
var topOfDayUrl = 'https://api-voting.devoxx.com/DV15/top/talks?limit=10&day=';

// Devoxx Hunt leaderboard
var gameLeaderBoardUrl = '/blebackend/leaderboard';
