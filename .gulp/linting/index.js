'use strict';
/* jshint unused:false */

var gulp = require('gulp');

require('./server');
require('./tests');

gulp.task('lint', ['lint-server']);

gulp.task('lint-all', ['lint'], function() {
    return gulp.start('lint-tests');
});

gulp.task('jscs-repair', ['jscs-repair-server'], function() {
    return gulp.start('jscs-repair-client');
});

gulp.task('jscs-repair-all', ['jscs-repair'], function() {
    return gulp.start('jscs-repair-tests');
});
