/**
 * Express middleware that loggs all requests.
 * 
 * 
 * @author Jonas <jonas.m.andreasson@gmail.com>
 * @license MIT
 */

'use strict';

var logger = require('./logger'); 

module.exports = function( req, res, next ) {
    next();
    logger.verbose("%s %s : %s [%s]",
        req.method, req.path, res.statusCode,
        req.headers['user-agent'] );    
}