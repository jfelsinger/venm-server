'use strict';

/**
 * Exports, Helpers for GC
 */
module.exports = VenmGarbageCollectionHandler;

/**
 * Deps
 */
const debug = require('debug')('venm-server:gc');


let isRunningGC = false;

/**
 * ...
 */
function VenmGarbageCollectionHandler(/* venmServer */) {
    return {
        run: function runGarbageCollection() {
            if (!isRunningGC &&
                global.gc &&
                typeof(global.gc) === 'function') {

                setInterval(() => {
                    debug('run gc');
                    global.gc();

                    isRunningGC = true;
                }, 5000);

            }
        },
    };
}
