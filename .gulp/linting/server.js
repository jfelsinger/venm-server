'use strict';
/* jshint unused:false */

var gulp = require('gulp');
var jscs = require('gulp-jscs'),
    jshint = require('gulp-jshint');

var paths = [
    'gulpfile.js',
    'gulp/**/*.js',
    '.gulp/**/*.js',

    'src/**/*.js',
];

gulp.task('lint-server-jshint', function() {
    return gulp.src(paths)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-reporter-jscs'));
});

gulp.task('lint-server-jscs', function() {
    return gulp.src(paths)
        .pipe(jscs())
        .pipe(jscs.reporter());
});

// --- JSCS Repairs

gulp.task('lint-server', ['lint-server-jshint'], function() {
    return gulp.start('lint-server-jscs');
});
