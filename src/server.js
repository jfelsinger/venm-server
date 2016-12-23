'use strict';

/**
 * Exports
 */
module.exports = VenmServerFactory;

/**
 * Dependencies
 */
const debug = require('debug')('venm-server'),
      chalk = require('chalk');

// Module Dependencies
const express = require('express'),
      http = require('http'),
      https = require('https'),
      BPromise = require('bluebird');

// Various Helpers
const gcHelper = require('./garbage-collection'),
      MwHelper = require('./mw'),
      RouteHelper = require('./routing');

const env = process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


/**
 * Representation of VENM Server
 * @class VenmServer
 */
class VenmServer {
    constructor(port, config, app) {
        this._config = config;
        this._app = app || express();
        this._port = port;

        this.gc = gcHelper(this);
        this.mw = new MwHelper(this);
        this.routes = new RouteHelper(this);
        this.errorRouting = [];

        // Aliases
        this.middleware = this.mw;
        this.routing = this.routes;

        // Configuration
        require('./express-config')(this, this._app);
    }

    /**
     * Run a configuration function,
     * supplying it the VENM server, the express app, and any configuration that
     * was passed in on construction
     */
    configure() {
        Array.prototype.forEach.call(arguments, (cb) => {
            debug('configure...');
            if (typeof(cb) === 'function') {
                cb(this, this._app, this._config);
            }
        });

        return this;
    }

    /**
     * Setup the routes for handling various errors
     * - This is similar to the configuration setup, but this routing is
     *   automatically applied last, right before serer start
     */
    routeErrors() {
        Array.prototype.forEach.call(arguments, (router) => {
            debug('register error routes...');
            if (typeof(router) === 'function') {
                this.errorRouting.push(router);
            }
        });

        return this;
    }

    /**
     * Start the app running and register any error handling routes/config
     * Returns a promise that is resolved once the server has finished starting
     */
    start() {
        // Run error routing setup
        this.errorRouting.forEach((router) => {
            router(this._app, this._config);
        });

        return new BPromise((res, rej) => {
            let server;
            let callback = (err) => {
                if (err) return rej(err);

                debug('Express application started on port `' + chalk.cyan('%s') + '`', this._port);
                debug('Environment: `' + chalk.cyan('%s') + '`', env);
                debug('Node Version: `' + chalk.cyan('%s') + '`', process.version);

                res(server);
            };

            if (this._config.isHttps) {
                server = https.createServer(this._config.ssl, this._app);
            } else {
                server = http.createServer(this._app);
            }

            server.listen(this._port, callback);
        });
    }
}


/**
 * Lets just complicate everything and make the outside interface weeeiiird
 * This should probably just be removed
 */
function VenmServerFactory(config, ssl) {
    config.ssl = ssl;

    let port = config.port;
    return (new VenmServer(port, config));
}
