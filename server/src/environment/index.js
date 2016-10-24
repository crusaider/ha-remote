'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// All configurations will extend these options
// ============================================

var defaults = {
    
    // Loglevel - defaults to 'info'
    logLevel: process.env.LOGLEVEL || 'info',
    
    // File with configuration data
    configFile: process.env.LOGLEVEL || './src/configuration.json',
    
    port: process.env.PORT || 8080,
    
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
    telldusTokebSecret: process.env.TELLDUS_TOKEN_SECRET,

}

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
  local,
  require(`./${process.env.NODE_ENV}.js`) || {});
