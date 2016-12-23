'use strict';

module.exports = function handleError(err) {
    /* jshint validthis:true */
    console.log(err.toString());
    this.emit('end');
};
