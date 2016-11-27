/*
 * Wraps the telldus-live-promise module, translates from telldus
 * semantics to HA-remote semantics and changes the API from prmomise
 * based to callback based.
 *
 * @author Jonas <jonas.m.andreasson@gmail.com>
 * @license MIT
 *
 */

'use strict';

/**
 * Constants - stolen with pride from
 * https://github.com/jornare/node-live-telldus/blob/master/src/constants.js
 */

let constants = {
  COMMANDS: {
    on: 0x0001,
    off: 0x0002,
    bell: 0x0004,
    dim: 0x0010,
    up: 0x0080,
    down: 0x0100
  },
  METHODS: {
    0x0001: 'on',
    0x0002: 'off',
    0x0004: 'bell',
    0x0010: 'dim',
    0x0080: 'up',
    0x0100: 'down'
  }
};

constants.SUPPORTED_METHODS = Object.keys(constants.COMMANDS)
  .reduce(function (previous, key) {
    return previous +
      constants.COMMANDS[key];
  }, 0);

// var path = require('path');
var logger = require('./utils/logger');
var querystring = require('querystring');
var telldus = require('telldus-live-promise');
var env = require('./environment');

/**
 * Get telldus API secrets from the environment.
 */
var config = {
  telldusPublicKey: env.telldusPublicKey,
  telldusPrivateKey: env.telldusPrivateKey,
  telldusToken: env.telldusToken,
  telldusTokenSecret: env.telldusTokenSecret
};

/**
 * Declare symbols available outside of the module.
 */

module.exports = {
  turnOn: turnOn,
  turnOff: turnOff,
  getDeviceState: getDeviceState,

  isPublicKeySet: config.telldusPublicKey !== null,
  isPrivateKeySet: config.telldusPrivateKey !== null,
  isTelldusTokenSet: config.telldusToken !== null,
  isTelldusTokenSecretSet: config.telldusTokenSecret !== null
};

/**
 * Telldus API objects.
 */
var api = telldus.API(config); // eslint-disable-line new-cap
var devices = telldus.Devices(api); // eslint-disable-line new-cap

/**
 * Turns a telldus device on
 *
 * @param {number} id -  Telldus ID of the Device
 * @param {turnOnCallback} cb
 */

function turnOn(id, cb) {
  devices.turnOn(id).then(
    function (response) {
      logger.debug('Sucessfull call to telldus turn on device, result is %s', response);

      if (isErrorResponse(response)) {
        return cb(response.error);
      }
      return cb(null);
    },
    function (result) {
      logger.error('Call to telldus list turn on device failed, error message %s', result);
      return cb(result);
    }
  );
}

/**
 * Callback that handles the response of a  turnOn command.
 *
 * @callback turnOnCallback
 * @param {*} error - a error message, undefined if no error
 *
 */

/**
 * Callback that handles the response of a  turnOff command.
 *
 * @callback turnOffCallback
 * @param error - a error code, null if no error
 *
 */

/**
 * Turns a telldus device off
 *
 * @param {number} id -  Telldus ID of the device
 * @param {turnOffCallback} cb
 */

function turnOff(id, cb) {
  devices.turnOff(id).then(
    function (response) {
      logger.debug('Sucessfull call to telldus turn off device, response is %s', response);

      if (isErrorResponse(response)) {
        return cb(response.error);
      }
      return cb(null);
    },
    function (result) {
      logger.error('Call to telldus turn off device failed, error message %s', result);
      return cb(result);
    }
  );
}

/**
 * Callback that handles the response of a  getDeviceState command.
 *
 * @callback getDeviceStateCallback
 * @param error - a error code, null if no error
 * @param {string} state - State of the device, can be "on" or "off" -
 * null of the state is unknow.
 */

/**
 * Turns a telldus device off
 *
 * @param {number} id -  Telldus ID of the device
 * @param {getDeviceStateCallback} cb
 */

function getDeviceState(id, cb) {
  api.request('/device/info?' +
    querystring.stringify({id: id, supportedMethods: constants.SUPPORTED_METHODS}))
    .then(
      function (response) {
        logger.debug('Sucessfull call to telldus device info, result is %s', response);

        if (isErrorResponse(response)) {
          return cb(response.error);
        }

        switch (parseInt(response.state, 10)) {
          case constants.COMMANDS.on:
            return cb(null, 'on');
          case constants.COMMANDS.off:
            return cb(null, 'off');
          default:
            logger.error('Unknown state %s of telldus device %s', response.state, id);
            return cb(null, null);
        }
      },
      function (response) {
        logger.error('Call to telldus device info failed, error message %s', response);
        return cb(response);
      });
}

/*
 * Private
 */

function isErrorResponse(response) {
  return 'error' in response;
}
