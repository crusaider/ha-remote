// server.js
'use strict';

var path = require('path');
var logger = require('./utils/logger');
var env = require('./environment');
var config = require('./utils/config');
var ha = require('./ha-api');
var telldus = require('./telldus-api');
var authn = require('./routers/authn');

//
// SHOW WHAT RUNTIME PARAMETERS WE ARE USING
// ============================================================================
logger.info('============================================================');
logger.info('Runtime configuration');
logger.info('LogLevel: %s', logger.logLevel);
logger.info('NODE_ENV: %s', process.env.NODE_ENV);
logger.info('Control configuration file: %s', config.configFileName);
logger.info('HA Server: %s', ha.url);
logger.info('HA Password: %s', ha.password);
logger.info('Telldus public key: %s', telldus.isPublicKeySet ? 'Is set' : 'Is NOT set');
logger.info('Telldus private key: %s', telldus.isPrivateKeySet ? 'Is set' : 'Is NOT set');
logger.info('Telldus token: %s', telldus.isTelldusTokenSet ? 'Is set' : 'Is NOT set');
logger.info('Telldus token secret: %s', telldus.isTelldusTokenSecretSet ? 'Is set' : 'Is NOT set');
logger.info('Password: %s', authn.hasPassword() ? 'Is set' : 'Is NOT set');
logger.info('Token salt: %s', authn.hasTokenSalt() ? 'Is set' : 'Is NOT set');
logger.info('============================================================');

// SET UP WEB SERVER
// =============================================================================

// call the packages we need
var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');
var fs = require('fs');

// Compress response content
app.use(require('compression')());

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Add logger middleware
app.use(require('./utils/request-logger'));

// Serve client code as static assets
if (process.env.NODE_ENV === 'development') {
  app.use(express.static('../client/app'));
  app.use('/bower_components', express.static('../client/bower_components'));
} else {
  app.use(express.static(path.join(__dirname, 'client'), {maxAge: '365d'}));
}

//
// Set up authorization
app.use(authn.authnFilter);

// ROUTES FOR THE API
// =============================================================================

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api

app.use('/api', require('./routers/about'));
app.use('/api', authn.router);
app.use('/api', require('./routers/config'));
app.use('/api', require('./routers/controls'));

// Handle page/route not found (404)
// =============================================================================
app.use(function (req, res/* , next */) {
  res.status(404);
  res.set('Content-Type', 'text/html');

  var options;

  if (process.env.NODE_ENV === 'development') {
    options = {
      root: path.join(__dirname, '../../../client/app/')
    };
  } else {
    options = {
      root: path.join(__dirname, '/client')
    };
  }

  res.sendFile('404.html', options);
});

// START THE HTTP(S) SERVER
// =============================================================================
var server;

if (env.ssl === 'YES') {
  server = require('https').createServer({
    key: fs.readFileSync('./src/ssl/key.pem'),
    cert: fs.readFileSync('./src/ssl/cert.pem')
  }, app).listen(env.port);

  logger.info('Web Server listening over SSL on ' + env.port);
} else {
  server = require('http').createServer(app).listen(env.port);
  logger.info('Web Server listening on ' + env.port);
}

//
// SHUTDOWN THE APPLICATION WHEN ASKED TO
// =============================================================================

var shutdown = function () {
  logger.info('Shuttting down API server');
  server.close(function () {
    logger.info('API Server closed sucessfully');
    logger.info('Shutdown completed, exiting');
    process.exit(0);
  });

  // if after
  setTimeout(function () {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit();
  }, 10 * 1000);
};

process.on('SIGTERM', function () {
  logger.info('Got signal SIGTERM, shutting down');
  shutdown();
});

process.on('SIGINT', function () {
  logger.info('Got signal SIGINT, shutting down');
  shutdown();
});
