'use strict';
/** jshint ignore */
module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        watch: {
            less: {
                files: ['app/less/{,*/}*.less'],
                tasks: [
                    'less',
                    'copy:dist'
                ]
            },
            js: {
                files: ['app/scripts/{,**/}*.js'],
                tasks: [
                    'ngAnnotate',
                    'uglify',
                    'copy:dist'
                ]
            },
            html: {
                files: ['app/{,**/}*.html'],
                tasks: [
                    'copy:dist'
                ]
            }
        },
        connect: {
            server: {
                options: {
                    port: 9000,
                    hostname: '0.0.0.0',
                    base: 'dist',
                    middleware: function (connect, options, defaultMiddleware) {
                        var proxy = require('grunt-connect-proxy/lib/utils').proxyRequest;
                        return [
                            // Include the proxy first
                            proxy
                        ].concat(defaultMiddleware);
                    }
                },
                proxies: [
                    {
                        context: '/api',
                        host: 'cfp.devoxx.pl',
                        port: 443,
                        https: true,
                        secure: false,
                        xforward: false,
                        headers: {
                            // "x-custom-added-header": value
                        }//,
                        // hideHeaders: ['x-removed-header']
                    },
                    {
                        context: '/tweets',
                        host: 'ec2-18-202-227-82.eu-west-1.compute.amazonaws.com',
                        port: 9001,
                        https: false,
                        secure: false,
                        xforward: false,
                        headers: {
                            // "x-custom-added-header": value
                        }//,
                        // hideHeaders: ['x-removed-header']
                    }
                ]
            },
            serverDist: {
                options: {
                    port: 9002,
                    hostname: '0.0.0.0',
                    base: 'dist'
                }
            }
        },
        clean: {
            dist: {
                files: [
                    {
                        dot: true,
                        src: [
                            '.tmp',
                            'dist/*'
                        ]
                    }
                ]
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                'app/scripts/{,**/}*.js',
                '!app/scripts/wall/date.js',
                '!app/scripts/wall/md5.js'
            ]
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true,
                autoWatch: false
            },
            e2e: {
                configFile: 'karma-e2e.conf.js',
                singleRun: true,
                autoWatch: false
            }
        },
        less: {
            dist: {
                files: {
                    'dist/css/wall.css': 'app/less/wall.less',
                    'dist/css/tweetwall_fr.css': 'app/less/tweetwall_fr.less'
                }
            }
        },
        ngAnnotate: {
            options: {
                singleQuotes: true,
                separator: ';'
            },
            wallboard: {
                files: [{
                    expand: true,
                    src: [
                        'app/scripts/**/*.js'
                    ],
                    dest: '.tmp/annotated/',
                    ext: '.annotated.js',
                    extDot: 'last'
                }]
            }
        },
        filerev: {
            src: [
                'dist/images/*.{png,jpg,jpeg,gif,webp,svg}',
                'dist/scripts/*.js',
                'dist/css/*.css'

            ],
            dest: 'dist'
        },
        filerev_replace: {// jshint ignore:line
            options: {
                assets_root: 'dist'// jshint ignore:line
            },
            compiled_assets: {// jshint ignore:line
                src: 'dist/css/*.css'
            },
            views: {
                src: 'dist/*.html'
            }
        },
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: 'app',
                        dest: 'dist',
                        src: [
                            '*.{ico,txt}',
                            'config_be.js',
                            'config_fr.js',
                            'config_pl.js',
                            'components/**/*',
                            '!components/jquery/src/**/*',
                            '!components/animate.css/source/**/*',
                            'css/*.css',
                            'images/*',
                            '!images/*.psd',
                            '*.html',
                            'appspec.yml'
                        ]
                    }
                ]
            }
        },
        uglify: {
            main: {
                options: {
                    sourceMap: false
                },
                files: {
                    'dist/scripts/tweetwall.min.js': [
                        '.tmp/annotated/app/scripts/config.annotated.js',
                        '.tmp/annotated/app/scripts/wall/*.annotated.js',
                        '.tmp/annotated/app/scripts/wall/**/*.annotated.js',
                        'app/config_pl.js' // This should be changed depending of the event
                    ]
                }
            }
        }
    });

    grunt.registerTask('server', [
        'build',
        'configureProxies:server',
        'connect:server',
        'watch'
    ]);

    grunt.registerTask('serverDist', [
        'build',
        'connect:serverDist',
        'watch'
    ]);

    grunt.registerTask('build', [
        'clean',
        'less',
        'jshint',
        'ngAnnotate',
        'uglify',
        'copy:dist',
        'timestampFile'
    ]);

    grunt.registerTask('default', ['build']);

    grunt.registerTask('timestampFile', 'Creates a file with a timestamp in it', function() {
        grunt.file.write('dist/timestamp.json', '{"timestamp": ' + Date.now() + '}');
    });
};
