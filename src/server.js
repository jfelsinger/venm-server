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
      mwHelper = require('./mw'),
      routeHelper = require('./routing');

const env = process.env.NODE_ENV = process.env.NODE_ENV || 'dev';



/**
 * Representation of VENM Server
 * @class VenmServer
 */
function VenmServerFactory(config, ssl) {
    let port = config.port;
    let app = express();
    let errorRouting = [];
    let server;

    class VenmServer {
        constructor() {
            this._config = config;
            this._app = app;

            this.gc = gcHelper(this);
            this.mw = mwHelper(this);
            this.routes = routeHelper(this);

            // Aliases
            this.middleware = this.mw;
            this.routing = this.routes;

            // Configuration
            require('./express-config')(this, app);
        }

        configure() {
            Array.prototype.forEach.call(arguments, (cb) => {
                debug('configure...');
                if (typeof(cb) === 'function') {
                    cb(this, app, this._config);
                }
            });

            return this;
        }

        routeErrors() {
            Array.prototype.forEach.call(arguments, (router) => {
                debug('register error routes...');
                if (typeof(router) === 'function') {
                    errorRouting.push(router);
                }
            });

            return this;
        }

        start() {
            // Run error routing setup
            errorRouting.forEach((router) => {
                router(app, this._config);
            });

            return new BPromise((res, rej) => {
                var callback = (err) => {
                    if (err) return rej(err);

                    debug('Express application started on port `' + chalk.cyan('%s') + '`', port);
                    debug('Environment: `' + chalk.cyan('%s') + '`', env);
                    debug('Node Version: `' + chalk.cyan('%s') + '`', process.version);

                    res(server);
                };

                if (this._config.isHttps) {
                    server = https.createServer(ssl, app);
                } else {
                    server = http.createServer(app);
                }

                server.listen(port, callback);
            });
        }
    }

    return (new VenmServer());
}
