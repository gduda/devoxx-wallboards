//Twitter
var twitterBaseUri = 'http://ec2-18-202-227-82.eu-west-1.compute.amazonaws.com/';

// Schedule
var fullScheduleUrl = '/api/public/speakers';
var dailyScheduleUrl = '/api/public/schedules/';
var talkTypesInSchedule = ["Conference", "BOF", "Keynote", "Tools-in-Action", "Quickie", "Hands-on Lab", "Lunch Break", "Coffee Break", "Coffee Break", "Deep Dive", "Networking Afterparty", "Short Break"];

// Voting
var hasVoting = true;
var dayNumberToName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
var topOfWeekUrl = 'https://devoxxpl23.cfp.dev/api/voting/v1/top/talks?limit=7';
var topOfDayUrl = 'https://devoxxpl23.cfp.dev/api/voting/v1/top/talks?limit=7&day=';

// Devoxx Hunt leaderboard
var gameLeaderBoardUrl = '/blebackend/leaderboard';
