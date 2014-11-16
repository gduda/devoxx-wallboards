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

#Setup global env

- Install [nodejs] [1]
 - It comes with [npm] [2]
- Have a look to [yeoman] [3]: it helps to scaffold an angular project with best practices
- [sudo] npm install -g yo grunt-cli bower generator-angular generator-karma

#Setup project env
- cd path/to/project
- npm install && bower install
 - *npm install* is configured with **package.json** and generates the directory **node_modules**
 - *bower* is configured with **bower.json** or **bower.json** and generates the directory **app/components**

##Starts your application##

- grunt server
 - *grunt* is configured with **Gruntfile.js**

##Build your app, including testing and optimization##

 - grunt
 
##Build static files

 - grunt static
 - This will create all the static files like speakers, schedule etc in the /dist directory

##Update your project's dependencies##
- bower update
 - it update **app/bower_components** directory

##Update your project's build dependencies##
- npm update
 - it update **node_modules** directory

##Support##
- [Best practices] [4]

[![Built on CloudBees](http://www.cloudbees.com/sites/default/files/Button-Built-on-CB-1.png)](https://devoxx.ci.cloudbees.com/job/cfp-speaker/)
