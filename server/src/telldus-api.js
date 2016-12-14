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

const constants = require('telldus-live-constants');

// var path = require('path');
const logger = require('./utils/logger');
const querystring = require('querystring');
const telldus = require('telldus-live-promise');
const env = require('./environment');

/**
 * Get telldus API secrets from the environment.
 */
let config = {
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
  listDevices: listDevices,

  isPublicKeySet: config.telldusPublicKey !== null,
  isPrivateKeySet: config.telldusPrivateKey !== null,
  isTelldusTokenSet: config.telldusToken !== null,
  isTelldusTokenSecretSet: config.telldusTokenSecret !== null
};

/**
 * Telldus API objects.
 */
const api = telldus.API(config); // eslint-disable-line new-cap
const devices = telldus.Devices(api); // eslint-disable-line new-cap

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

/**
 * Retrives information about all devices associated with the telldus account
 *
 * @param cb Callback that will recieve the list of device information
 */

function listDevices(cb) {
  api.request('/devices/list?' +
    querystring.stringify({includeIgnored: 1, supportedMethods: constants.SUPPORTED_METHODS}))
    .then(
      function (response) {
        logger.debug('Sucessfull call to telldus list devices, result is %s', response);

        if (isErrorResponse(response)) {
          return cb(response.error);
        }

        cb(null, response);
      },
      function (response) {
        logger.error('Call to telldus list devices failed, error message %s', response);
        return cb(response);
      });
}

/*
 * Private
 */

function isErrorResponse(response) {
  return 'error' in response;
}
