'use strict';

/**
 * Exports,
 */
module.exports = configureExpress;

/**
 * Deps
 */
const debug = require('debug')('venm-server:express-config'),
      chalk = require('chalk');

const bodyParser = require('body-parser');


/**
 * ...
 */
function configureExpress(venmServer, app) {

    app.set('json spaces', 2);
    app.set('showStackError', true);
    app.enable('jsonp callback');

    // No logger on test environment
    if (process.env.NODE_ENV !== 'production' &&
        process.env.NODE_ENV !== 'test') {
        app.use(require('morgan')('dev'));

        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
        debug(chalk.yellow('WARNING') + ': allowing self-signed certs for ' +
            'development. Make sure to user proper ssl certifications in ' +
            'production environment');
    }

    app.use(require('method-override')());
    app.use(require('compression')());

    // parse application/json requests
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // Continue to routing,
    venmServer.routing.setupDefaultAccess();
}
