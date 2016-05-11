'use strict';

var request = require('request');

var logger = require('./utils/logger');

/**
 * Runtime settings from the environment
 */
var haURL = process.env.HA_URL || "http://localhost:8123";
var haPassword = process.env.HA_PASSWORD || "";


module.exports = {
    callService: callService,

    url: haURL,
    password: haPassword,

}

function callService(domain, service, serviceData, cb) {

    var options = {
        method: 'POST',
        url: haURL + "/api/services/" + domain + "/" + service,
        headers: {
            'X-HA-Access': haPassword
        },
        strictSSL: false,
        json: true,
        body: serviceData
    }

    request(options, function (err, message, body) {
        if ( err ) {
            logger.error("Call to HA API Server failed", err );
            return cb(500);
        }
        
        if (message.statusCode != 200) {
            logger.error("Call to service %s/%s with service data %s failed, statuscode: %s",
                domain, service, JSON.stringify(serviceData), message.statusCode);
            return cb(message.statusCode, 
                { haStatusCode: message.statusCode,
                    haStatusMessage: message.StatusMessage
                });
        }

        return cb(err, body);
    })
}