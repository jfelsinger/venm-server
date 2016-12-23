'use strict';
/* jshint unused:false */

var gulp = require('gulp');

var mocha = require('gulp-mocha'),
    istanbul = require('gulp-istanbul');

var handleError = require('./handle');

gulp.task('mocha', function(cb) {
    process.env.NODE_ENV = 'test';
    GLOBAL.capture = console; // redefine capture from ./server.js

    gulp.src(['src/**/*.js'])
        .pipe(istanbul({ includeUntested: true }))
        .pipe(istanbul.hookRequire())
        .on('error', handleError)
        .on('finish', function() {
            gulp.src('test/**/*.js')
                .pipe(mocha({ /*reporter: 'list'*/ }))
                .on('error', handleError)
                .pipe(istanbul.writeReports())
                .on('end', cb);
        });
});

gulp.task('test', ['lint', 'mocha']);
