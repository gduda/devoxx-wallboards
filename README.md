![Build status](https://devoxx.ci.cloudbees.com/job/cfp-speaker/badge/icon)

Devoxx Wallboards Application
This application is used to show interesting data on the various Devoxx screens.

Used technologies:
- HTML 5 / CSS 3
- LESS CSS
- AngularJS
- Karma
- Grunt
- Bower
- NodeJS

# Setup global env

- Install [nodejs] [1]
 - It comes with [npm] [2]
- Have a look to [yeoman] [3]: it helps to scaffold an angular project with best practices
- [sudo] npm install -g yo grunt-cli bower generator-angular generator-karma

# Setup project env
- cd path/to/project
- npm install && bower install
 - *npm install* is configured with **package.json** and generates the directory **node_modules**
 - *bower* is configured with **bower.json** or **bower.json** and generates the directory **app/components**

## Starts your application

- grunt server
 - *grunt* is configured with **Gruntfile.js**

## Build your app, including testing and optimization

 - grunt
 
## Build static files

 - grunt static
 - This will create all the static files like speakers, schedule etc in the /dist directory

## Update your project's dependencies
- bower update
- it update **app/bower_components** directory

## Update your project's build dependencies
- npm update
 - it update **node_modules** directory

# Customize the code for a Devoxx conference

The Tweet Wall needs to be customized for each Devoxx conference (country, date). These are the changes you need to make

## Change the images

In `app/images` you can add the background images you need. Then you have to reference them in the `wall.less` file : 

    #hallway {
        .screen(url('../images/dv15-hallwall.jpg'), 1280px, 800px, 70px);
    }
    
    #cinema {
        margin-top: 130px;
        .screen(url('../images/dv15-cinemawall.jpg'), 1920px, 817px, 0);
    }


## Change the URLs

The application needs to ping the REST interface for the schedule, the speakers and so on. Configure the URLs that are in the `ScheduleCtrl.js` controller :

    ...
    var fullScheduleUrl = 'http://cfp.devoxx.be/api/conferences/DV15/speakers';
    ...
    $http.get('http://cfp.devoxx.be/api/conferences/DV15/schedules/' + dayName)

## Voting
 
To vote, the application needs to have access to the URLs allowing vote. These URLs can be configured in `votingservice.js` : 

    ...
    var topOfWeekUrl = 'https://api-voting.devoxx.com/DV15/top/talks?limit=10';
    ...
    var topOfDayUrl = 'https://api-voting.devoxx.com/DV15/top/talks?limit=10&day=' + dayNumberToName[dayNumber];
 
##Support##
- [Best practices] [4]

[![Built on CloudBees](http://www.cloudbees.com/sites/default/files/Button-Built-on-CB-1.png)](https://devoxx.ci.cloudbees.com/job/cfp-speaker/)

