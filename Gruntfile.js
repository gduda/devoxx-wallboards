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
            }
        },
        connect: {
            server: {
                options: {
                    port: 9000,
                    hostname: '0.0.0.0',
                    base: 'dist'
                }
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
                    'dist/css/tweetwall_fr.css': 'app/less/tweetwall_fr.less',
                    'dist/css/cinemawall_pl.css': 'app/less/cinemawall_pl.less'
                }
            }
        },
        imagemin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: 'app/images',
                        src: '{,**/}*.{png,jpg,jpeg,png}',
                        dest: 'dist/images'
                    }
                ]
            }
        },
        htmlmin: {
            dist: {
                options: {},
                files: [
                    {
                        expand: true,
                        cwd: 'app',
                        src: ['*.html', 'views/**/*.html'],
                        dest: 'dist'
                    }
                ]
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
                            'css/*.css',
                            'images/*',
                            '*.html'
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
                        'app/*.js'
                    ]
                }
            }
        }
    });

    grunt.registerTask('server', [
        'build',
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
        // 'imagemin',
        // 'htmlmin',
        'jshint',
        'ngAnnotate',
        'uglify',
        'copy:dist',
        // 'filerev',
        // 'filerev_replace',
        'timestampFile'
    ]);

    grunt.registerTask('default', ['build']);

    grunt.registerTask('timestampFile', 'Creates a file with a timestamp in it', function() {
        grunt.file.write('dist/timestamp.json', '{"timestamp": ' + Date.now() + '}');
    });
};
