'use strict';

/**
 * Deps
 */
const setupDefaultAccess = require('./setup-default-access');

// TODO:
// We treat the VenmRoutes object here... as an object, where-as in `server.js`
// we're treating the main object as a class.
//
// Things should be structured consistently throughout... especially since this
// particuler bit of code makes use of an OO structure via references to this,
// perhaps re-factor as a class?

/**
 * ...
 */
class VenmRoutingHandler {

    constructor(venmServer) {
        this.server = venmServer;
        this.routes = {};
    }

    /**
     * Register a route
     * @param {Function} route
     * @param {*} ...args - Optional args, as many as you want!
     */
    register() {
        let args = Array.prototype.map.call(arguments, (arg) => arg);
        let route = args.shift();

        args = [this.server, this.server._app, this.server.db].concat(args);

        route.apply(route, args);

        return this;
    }

    setupDefaultAccess() {
        setupDefaultAccess(this.server._app);
        return this;
    }
}


/**
 * Exports
 */
module.exports = VenmRoutingHandler;
