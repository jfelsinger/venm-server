'use strict';

// TODO:
// Perhaps phase-out compose and/or mwflow?

/**
 * Deps
 */
const compose = require('connect-compose');
const mwflow = require('middleware-flow');
const R = require('ramda');


/**
 * Provide extra functionality for handling MWs
 */
class VenmMiddlewareHandler {
    constructor(venmServer) {
        this.server = venmServer;
        this.registeredMW = {};
    }

    /**
     * Register a MW for later use
     */
    register() {
        let name, mw;

        if (arguments.length === 2) {
            name = arguments[0];
            mw = arguments[1];
        } else {
            mw = arguments[1];
            name = mw.name;
        }

        if (!name) {
            throw new Error('name required to register middlware');
        }

        this.registeredMW[name] = mw;

        return this;
    }

    /**
     * Get a MW, or combination of MW,
     * to be used in a route
     */
    getMWs() {
        let args = Array.prototype.slice.call(arguments);
        args = R.flatten(args);

        let fn = (name) => {
            if (typeof(name) === 'function')
                return name;
            else
                return this.registeredMW[name];
        };
        let mws = R.map(fn, args);

        return mws;
    }

    /**
     * Get a MW or combination of MW to be used in a route,
     * executed in parallel
     */
    get() {
        let args = Array.prototype.slice.call(arguments);
        let mws = this.getMWs(args);

        if (mws.length < 2) {
            return mws[0];
        } // else:

        return mwflow.parallel.apply(mwflow, mws);
    }

    /**
     * Get a MW or combination of MW to be used in a route,
     * but executed in series
     */
    getSeries() {
        let args = Array.prototype.slice.call(arguments);
        let mws = this.getMWs(args);

        if (mws.length < 2) {
            return mws[0];
        } // else:

        return compose(mws);
    }

    /**
     * Register MW for an express router
     * - or-
     * Return a function that will register the given mw to a supplied router
     */
    use() {
        let args = Array.prototype.slice.call(arguments);

        if (typeof(args[0]) === 'object' && !Array.isArray(args[0])) {
            let router = args.shift();
            let mw = this.get(args);
            router.use(mw);
        } else {

            let mw = this.get(args);
            return function(router) {
                let routerArgs = Array.prototype.slice.call(arguments, 1);
                routerArgs = R.append(mw, routerArgs);
                router.use.apply(router, routerArgs);
            };

        }
    }

    /**
     * Register MW for a router, but in series
     * - or-
     * Return a function that will register the given mw to a supplied router
     */
    useSeries() {
        let args = Array.prototype.slice.call(arguments);

        if (typeof(args[0]) === 'object' && !Array.isArray(args[0])) {

            let router = args.shift();
            let mw = this.getSeries(args);
            router.use(mw);

        } else {

            let mw = this.get(args);
            return function(router) {
                let routerArgs = Array.prototype.slice.call(arguments, 1);
                routerArgs = R.append(mw, routerArgs);
                router.use.apply(router, routerArgs);
            };

        }
    }
}



/**
 * Exports
 */
module.exports = VenmMiddlewareHandler;
