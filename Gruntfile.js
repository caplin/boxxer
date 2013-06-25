module.exports = function(grunt) {

    var sources = [
        //intro
        'js/intro',

        //core
        'js/boxxer.js',

        //dependencies
        'js/modules/**/*.js',
        'js/decorators/**/*.js',

        //main classes
        'js/Dialog.js',
        'js/Box.js',

        //api
        'js/api.js',

        //outro
        'js/outro'
    ];

    // config
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        concat: {
            build: {
                src: sources,
                dest: 'build/<%= pkg.name %>.src.js'
            }
        },

        uglify: {
            build: {
                src: 'build/<%= pkg.name %>.src.js',
                dest: 'build/<%= pkg.name %>.min.js'
            }
        },

        qunit: {
            all: ['test/unit_test.html']
        },

        copy: {
            js: {
                src: 'build/<%= pkg.name %>.min.js',
                dest: 'server/client/js/<%= pkg.name %>.min.js'
            },
            css: {
                src: 'css/global.css',
                dest: 'server/client/css/global.css'
            }
        },

        watch: {
            scripts: {
                files: ['js/**/*.js', 'js_patches/**/*.js'],
                tasks: ['concat']
            }
        },

        jsdoc: {
            dist: {
                src: sources,
                options: {
                    destination: 'documentation',
                    lenient: true
                }
            }
        }
    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-jsdoc');

    // Default task(s).
    grunt.registerTask('default', ['concat', 'uglify', 'qunit']);
    grunt.registerTask('doc', ['concat', 'jsdoc']);
    grunt.registerTask('deploy', ['concat', 'uglify', 'qunit', 'copy']);
};