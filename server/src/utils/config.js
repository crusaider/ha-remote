'use strict';

const constants = require('telldus-live-constants');
const sid = require('shortid');
const fs = require('fs');
const jsmin = require('jsmin');
const telldus = require('../telldus-api');
const logger = require('./logger');

/**
 * Private
 */

/**
 * Compiles client configuration from the configuration file and from the telldus backend service. A second call to the
 * function will return a cached version of the config, it will not be loaded from file/nnetwork.
 *
 * @param cb
 */

let clientConfig;
let controls = new Map();

function getConfigData(cb) {
  if (clientConfig) {
    return cb(null, clientConfig);
  }

  fetchTelldusDevices((err, telldusDevices) => {
    if (err) {
      return cb(err);
    }

    clientConfig = {groups: []};

    for (let g of loadFromFile().groups) {
      if ('enableSwitchAll' in g !== true) {
        g.enableSwitchAll = true;
      }
      let cg = {
        caption: g.caption,
        enableSwitchAll: g.enableSwitchAll,
        id: sid.generate(),
        controls: []
      };
      for (let c of g.controls) {
        let cid = sid.generate();
        let cc = {
          caption: c.caption,
          id: cid,
          type: 'switch'
        };

        if (c.backend === 'telldus') {
          cc.type = getTelldusDeviceType(c.device_id, telldusDevices);
        }

        if (!cc.type) {
          logger.error('Device id %s does not exist in telldus service', c.device_id);
          return cb(new Error('Device id not found in telldus service'));
        }
        cg.controls.push(cc);
        controls.set(cid, c);
      }
      clientConfig.groups.push(cg);
    }

    return cb(null, clientConfig);
  });
}

/**
 * Looks for a device in the telldus data and determines the type of device.
 *
 * @param id -  Id of the device to fin the type for
 * @param devices - Array of device descriptions from the telldus backend
 * @returns 'dimmer' or 'switch', null if the device could not be found
 */
function getTelldusDeviceType(id, devices) {
  for (let d of devices) {
    if (id === d.id) {
      // TODO: Handle other device types than dimmer and switch
      if (d.methods & constants.COMMANDS.dim) {
        return 'dimmer';
      }
      return 'switch';
    }
  }
  return null;
}

/**
 * Loads the configuration data from file
 *
 * @returns A object conatning the json structure from the config file
 */
function loadFromFile() {
  let data;
  try {
    data = JSON.parse(jsmin.jsmin(fs.readFileSync(
      module.exports.configFileName, 'utf8')));
    logger.info('Loading controller configuration from [%s]',
      fs.realpathSync(module.exports.configFileName));
  } catch (err) {
    logger.error('Failed to load configuration from file [%s]',
      module.exports.configFileName);
    logger.error(err);
    throw (err);
  }
  return data;
}

/**
 * Fetch information about devices in the telldus service.
 *
 * @param cb callback that receives a array of devices descriptions from the telldus service
 */
function fetchTelldusDevices(cb) {
  telldus.listDevices((err, res) => {
    if (err) {
      return cb(err);
    }
    return cb(null, res.device);
  });
}

/**
 * Exported
 */

module.exports = {
  clientConfig: getConfigData,

  controlDescription: function (id) {
    return controls.get(id);
  },

  configFileName: process.env.CONFIGFILE || './src/configuration.json'
};

