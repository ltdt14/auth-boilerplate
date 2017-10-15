'use strict';

const fs = require('fs');

module.exports = function(grunt) {
    //load plugins
    [
        'grunt-contrib-watch',
        'grunt-jsdoc-to-markdown',
        'grunt-markdown-toc',
        'grunt-eslint'
    ].forEach(function(task) {
        grunt.loadNpmTasks(task);
    });

    //configure plugins
    grunt.initConfig({
        jsdoc2md: {
            oneOutputFile: {
                src: 'dist/index.js',
                dest: 'docs/API.md'
            }
        },
        markdown_toc: {
            src: ['./**.md', './docs/**.md']
        },
        watch: {
            toc: {
                files: ["**/*"],
                tasks: ["toc"],
                options: {
                    livereload: true
                }
            }
        },
        eslint: {
            target: ['lib/**/*.js', 'index.js', 'models/**/*.js']
        }
    });
};