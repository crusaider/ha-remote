'use strict';

var logger = require('../utils/logger');
var express = require('express');
var Hashes = require('jshashes');


var password = process.env.PASSWORD || "";
var tokenSalt = process.env.TOKEN_SALT;

module.exports.hasPassword = function() {
    if ( password ) {
        return true;
    }
    return false;
}

module.exports.hasTokenSalt = function() {
    if ( tokenSalt ) {
        return true;
    }

    logger.error("Token salt not found in the environment, please set TOKEN_SALT. Exiting process.")
    process.exit(1);
}

module.exports.router = express.Router();

/**
 * A callers that posts a password will, if the password is accepted recieve a 
 * token in return that should be used in all subesquent calls to the API.
 */

module.exports.router.route('/authn')

    .post(function (req, res) {

        if ( req.body.password != password ) {
            logger.info("Refused token due to invalid password.")
            return res.status(401).json({ error: "Invalid password"});
        }
        
        logger.info("Password valid, issuing token based on hostname: %s and client ip: %s", req.hostname, req.ip );
        res.json({ token: computeToken(req.body.password, req.ip, req.hostname, tokenSalt )});
    });

/**
 * Express middleware that intercepts all requests and if on a protected URL checks that 
 * a valid token has ben submitted in the "Authorization" header.
 */

module.exports.authnFilter = function(req,res,next) {
    
    if ( req.path.match('/api.*') && req.path != '/api/authn' ) {
        logger.debug("Authorizing");
        if ( req.headers.authorization == undefined
            || req.headers.authorization != computeToken(password, req.ip, req.hostname, tokenSalt )  ) {
            
            if(req.headers.authorization == undefined) {
               logger.info("Refused access due to missing token");
            } else {
               logger.info("Refused access due to invalid token");
            }
 
            return res.status(401).send();
        }
         
   }
   next();
}

function computeToken(password, ip, hostname, salt ) {

    var tokenObject = {
        password: password,
        ip: ip,
        hostname: hostname     
    }
    return new Hashes.MD5().hex_hmac(salt, JSON.stringify(tokenObject)).toUpperCase();
}