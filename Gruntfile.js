module.exports = function(grunt) {

    var sources = [
        'js/shims/shims.js',

        'js/boxxer.js',

        'js/view/ViewContainer.js',
        'js/Dialog.js',

        'js/decorator/Decorator.js',

        'js/mixins/Adjustable.js',
        'js/mixins/ElementWrapper.js',
        'js/mixins/ParentElementWrapper.js',
        'js/mixins/Serializer.js',

        //'js/async/Async.js',
        'js/async/Connection.js',
        'js/layouts/Layout.js',

        'js/events/BoxEvent.js',
        'js/events/EventEmitter.js',

        'js/render/Dimension.js',
        'js/Box.js',
        'js/render/BoxRenderer.js',

        //caplin patches
//        'js_patches/caplin/bootstrap-lite.js',
//        'js_patches/caplin/ComponentLifeCycleEvents.js',
//        'js_patches/caplin/Component.js',
//        'js_patches/caplin/**/*.js',
//
//        'js_patches/**/*.js',

        //decorators
        'js/decorator/**/*.js'
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

        //watch
        watch: {
            scripts: {
                files: ['js/**/*.js', 'js_patches/**/*.js'],
                tasks: ['concat']
            }
        }

    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Default task(s).
    grunt.registerTask('default', ['concat', 'uglify', 'qunit']);
    grunt.registerTask('deploy', ['concat', 'uglify', 'qunit', 'copy']);
};