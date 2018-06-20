//Twitter
var twitterBaseUri = 'http://ec2-34-244-221-30.eu-west-1.compute.amazonaws.com/';

// Schedule
var fullScheduleUrl = 'https://cfp.devoxx.pl/api/conferences/DevoxxPL2018/speakers';
var dailyScheduleUrl = 'https://cfp.devoxx.pl/api/conferences/DevoxxPL2018/schedules/';
var talkTypesInSchedule = ['Conference', 'Quickie', 'BOF (Bird of a Feather)', 'University', 'Hand\'s on Labs', 'Tools-in-Action', 'Startup presentation', 'Keynote'];

// Voting
var hasVoting = true;
var dayNumberToName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
var topOfWeekUrl = 'https://cfp.devoxx.pl/api/voting/v1/top/talks?limit=7';
var topOfDayUrl = 'https://cfp.devoxx.pl/api/voting/v1/top/talks?limit=7&day=';

// Devoxx Hunt leaderboard
var gameLeaderBoardUrl = '/blebackend/leaderboard';
