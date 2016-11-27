'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// All configurations will extend these options
// ============================================

var defaults = {
  // Loglevel - defaults to 'info'
  logLevel: process.env.LOGLEVEL || 'info',

  // File with configuration data
  configFile: process.env.CONFIGFILE || './src/configuration.json',

  port: process.env.PORT || 8080,

  ssl: process.env.SSL || 'YES',

  // URL To the home assistant API server to use
  haURL: process.env.HA_URL,

  // Password used to access the home assistant API
  haPassword: process.env.HA_PASSWORD,

  // Password authorizing access to the app
  password: process.env.PASSWORD,

  // SALT used to generate the authentication token
  tokenSalt: process.env.TOKEN_SALT,

  // Telldus API access
  telldusPublicKey: process.env.TELLDUS_PUBLIC_KEY,
  telldusPrivateKey: process.env.TELLDUS_PRIVATE_KEY,
  telldusToken: process.env.TELLDUS_TOKEN,
  telldusTokenSecret: process.env.TELLDUS_TOKEN_SECRET
};

var _ = require('lodash');

/*
 * Load local config if it exists
 */

var local;

try {
  local = require('./local.env');
} catch (e) {

}

module.exports = _.merge(
  defaults,
  require(`./${process.env.NODE_ENV}.js`) || {},
  local);

