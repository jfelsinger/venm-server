'use strict';
/* jshint unused:false */

var gulp = require('gulp');

var handleError = require('./.gulp/handle');

require('./.gulp/linting');
require('./.gulp/test');

gulp.task('watch', ['mocha', 'lint'], function() {
    gulp.watch([
        'src/**/*.js',
    ], ['mocha', 'lint']);
});

/** Build it all up and serve it */
gulp.task('default', ['mocha', 'lint']);


// /** Build it all up and serve the production version */
// gulp.task('serve', ['app', 'client', 'watch']);
