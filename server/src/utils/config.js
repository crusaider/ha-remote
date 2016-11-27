'use strict';

const fs = require('fs');
const jsmin = require('jsmin');

const logger = require('./logger');

/**
 * Exported
 */

module.exports = {
  clientConfig: function () {
    var retVal = [];
    getConfigData().controls.forEach(function (control) {
      retVal.push({id: retVal.length, caption: control.caption});
    });

    return retVal;
  },

  controlDescription: function (id) {
    return getConfigData().controls[id];
  },

  configFileName: process.env.CONFIGFILE || './src/configuration.json'
};

/**
 * Private
 */

let configData;

function getConfigData() {
  if (configData) {
    return configData;
  }
  try {
    configData = JSON.parse(jsmin.jsmin(fs.readFileSync(
      module.exports.configFileName, 'utf8')));
    logger.info('Loading controller configuration from [%s]',
      fs.realpathSync(module.exports.configFileName));
  } catch (err) {
    logger.error('Failed to load configuration from file [%s]',
      module.exports.configFileName);
    logger.error(err);
    throw (err);
  }
  return configData;
}
