'use strict';

const sid = require('shortid');
const fs = require('fs');
const jsmin = require('jsmin');

const logger = require('./logger');

/**
 * Private
 */

let clientConfig;
let controls = new Map();

function getConfigData() {
  if (clientConfig) {
    return clientConfig;
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
      let cc = {caption: c.caption, id: cid};
      cg.controls.push(cc);
      controls.set(cid, c);
    }
    clientConfig.groups.push(cg);
  }

  return clientConfig;
}

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
 * Exported
 */

module.exports = {
  clientConfig: function () {
    return getConfigData();
  },

  controlDescription: function (id) {
    return controls.get(id);
  },

  configFileName: process.env.CONFIGFILE || './src/configuration.json'
};

