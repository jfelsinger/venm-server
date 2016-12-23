'use strict';
/* jshint unused:false */

var gulp = require('gulp');
var jscs = require('gulp-jscs'),
    jshint = require('gulp-jshint');

var paths = [
    'test/**/*.js',
];

gulp.task('lint-tests-jshint', function() {
    return gulp.src(paths)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-reporter-jscs'));
});

gulp.task('lint-tests-jscs', function() {
    return gulp.src(paths)
        .pipe(jscs())
        .pipe(jscs.reporter());
});

gulp.task('jscs-repair-tests', function() {
    return gulp.src(paths, { base: '.' })
        .pipe(jscs({ fix: true }))
        .pipe(gulp.dest('.'));
});

gulp.task('lint-tests', ['lint-tests-jshint'], function() {
    return gulp.start('lint-tests-jscs');
});
