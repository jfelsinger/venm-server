'use strict';

/**
 * Exports,
 */
module.exports = setupDefaultAccess;

/**
 * Deps
 */
const debug = require('debug')('venm-server:options-routing');


/**
 * Routing
 * Setup request routing
 */
function setupDefaultAccess(app) {

    // Allow all domains
    app.use(function(req, res, next) {
        var allowedMethods = [
            'GET', 'POST', 'OPTIONS',
            'PUT', 'PATCH', 'DELETE',
        ];

        var allowedHeaders = [
            'Origin',
            'Accept',
            'Content-Type',
            'x-access-token',
            'X-Access-Token',
            'X-Requested-With',
            'X-HTTP-Method-Override',
        ];

        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', allowedMethods.join(', '));
        res.header('Access-Control-Allow-Headers', allowedHeaders.join(', '));
        res.header('Access-Control-Allow-Credentials', true);

        debug('remoteAddress: ', req.connection.remoteAddress);
        debug('x-forwarded-for: ', req.headers['x-forwarded-for']);

        debug('req.method: ', req.method);
        if (req.method === 'OPTIONS')
            return res.send();

        next();
    });

}
