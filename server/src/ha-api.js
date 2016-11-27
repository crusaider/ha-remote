'use strict';

var request = require('request');
var logger = require('./utils/logger');
var env = require('./environment');

/**
 * Runtime settings from the environment
 */
var haURL = env.haURL;
var haPassword = env.haPassword;

module.exports = {
  callService: callService,
  getDeviceState: getDeviceState,

  url: haURL,
  password: haPassword
};

function callService(domain, service, serviceData, cb) {
  var options = buildOptionsBase();

  options.method = 'POST';
  options.url = haURL + '/api/services/' + domain + '/' + service;
  options.body = serviceData;

  request(options, function (err, message, body) {
    if (err) {
      logger.error('Call to HA API Server failed', err);
      return cb(500);
    }

    if (message.statusCode !== 200) {
      logger.error('Call to service %s/%s with service data %s failed, statuscode: %s',
        domain, service, JSON.stringify(serviceData), message.statusCode);
      return cb(message.statusCode,
        {
          haStatusCode: message.statusCode,
          haStatusMessage: message.StatusMessage
        });
    }

    return cb(err, body);
  });
}

function getDeviceState(entityId, cb) {
  var options = buildOptionsBase();

  options.method = 'GET';
  options.url = haURL + '/api/states/' + entityId;

  request(options, function (err, message, body) {
    if (err) {
      logger.error('Call to HA API Server failed', err);
      return cb(500);
    }

    if (message.statusCode !== 200) {
      logger.error('Call to get state for entity_id %s failed, statuscode: %s',
        entityId, message.statusCode);
      return cb(message.statusCode,
        {
          haStatusCode: message.statusCode,
          haStatusMessage: message.StatusMessage
        });
    }

    return cb(err, body);
  });
}

function buildOptionsBase() {
  return {
    headers: {
      'X-HA-Access': haPassword
    },
    strictSSL: false,
    json: true
  };
}
