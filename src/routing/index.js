'use strict';

/**
 * Exports
 */
module.exports = VenmRoutingHandler;


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
