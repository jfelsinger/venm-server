'use strict';

/**
 * Exports
 */
module.exports = VenmRoutingHandler;

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
function VenmRoutingHandler(venmServer) {
    let VenmRoutes = {};

    /**
     * Register a route
     * @param {Function} route
     * @param {*} ...args - Optional args, as many as you want!
     */
    VenmRoutes.register = function registerVenmRoute() {
        let args = Array.prototype.map.call(arguments, (arg) => arg);
        let route = args.shift();

        args = [venmServer, venmServer._app, venmServer.db].concat(args);

        route.apply(route, args);

        return this;
    };

    VenmRoutes.setupDefaultAccess = function setupDefaultVenmResultAccess() {
        require('./setup-default-access')(venmServer._app);
        return this;
    };

    return VenmRoutes;
}
