'use strict';

/**
 * Exports
 */
module.exports = VenmMiddlewareHandler;

/**
 * Deps
 */
const compose = require('connect-compose');
const mwflow = require('middleware-flow');
const R = require('ramda');


/**
 * ...
 */
function VenmMiddlewareHandler(venmServer) {
    let registeredMW = {};
    let VenmMW = {};

    /**
     * Register a MW for later use
     */
    VenmMW.register = function registerVenmMWs() {
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

        registeredMW[name] = mw;

        return venmServer;
    };

    /**
     * Get a MW, or combination of MW,
     * to be used in a route
     */
    VenmMW.getMWs = function getVenmMWsArray() {
        let args = Array.prototype.slice.call(arguments);
        args = R.flatten(args);

        let fn = (name) => {
            if (typeof(name) === 'function')
                return name;
            else
                return registeredMW[name];
        };
        let mws = R.map(fn, args);

        return mws;
    };

    /**
     * Get a MW or combination of MW to be used in a route,
     * executed in parallel
     */
    VenmMW.get = function getVenmMW() {
        let args = Array.prototype.slice.call(arguments);
        let mws = VenmMW.getMWs(args);

        if (mws.length < 2) {
            return mws[0];
        } // else:

        return mwflow.parallel.apply(mwflow, mws);
    };

    /**
     * Get a MW or combination of MW to be used in a route,
     * but executed in series
     */
    VenmMW.getSeries = function getVenmMWInSeries() {
        let args = Array.prototype.slice.call(arguments);
        let mws = VenmMW.getMWs(args);

        if (mws.length < 2) {
            return mws[0];
        } // else:

        return compose(mws);
    };

    /**
     * Register MW for a router
     * - or-
     * Return a function that will register the given mw to a supplied router
     */
    VenmMW.use = function useVenmMWs(/* router, ...mws */) {
        let args = Array.prototype.slice.call(arguments);
        if (typeof(args[0]) === 'object' && !Array.isArray(args[0])) {
            let router = args.shift();
            let mw = VenmMW.get(args);
            router.use(mw);
        } else {

            let mw = VenmMW.get(args);
            return function(router) {
                let routerArgs = Array.prototype.slice.call(arguments, 1);
                routerArgs = R.append(mw, routerArgs);
                router.use.apply(router, routerArgs);
            };

        }
    };

    /**
     * Register MW for a router, but in series
     * - or-
     * Return a function that will register the given mw to a supplied router
     */
    VenmMW.useSeries = function useVenmMWsInSeries(/* router, ...mws */) {
        let args = Array.prototype.slice.call(arguments);

        if (typeof(args[0]) === 'object' && !Array.isArray(args[0])) {

            let router = args.shift();
            let mw = VenmMW.getSeries(args);
            router.use(mw);

        } else {

            let mw = VenmMW.get(args);
            return function(router) {
                let routerArgs = Array.prototype.slice.call(arguments, 1);
                routerArgs = R.append(mw, routerArgs);
                router.use.apply(router, routerArgs);
            };

        }
    };

    return VenmMW;
}
