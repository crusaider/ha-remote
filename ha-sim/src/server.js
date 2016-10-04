// server.js
'use strict';

var logger = require('./utils/logger');

var port = process.env.PORT || 8081;

//
// SHOW WHAT RUNTIME PARAMETERS WE ARE USING
// ============================================================================
logger.info("============================================================");
logger.info("Runtime configuration");
logger.info("LogLevel: %s", logger.logLevel);
logger.info("NODE_ENV: %s", process.env.NODE_ENV);
logger.info("HTTP(S) port: %s", port);
logger.info("============================================================");

// SET UP WEB SERVER
// =============================================================================

// call the packages we need
var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');
var fs = require('fs');
var http = require('http');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//
// Log all requests
app.use(function (req, res, next) {
  setTimeout(function () {
    next();
  }, process.env.REQUESTDELAY || 0);

  logger.info("%s %s : %s", req.method, req.originalUrl, res.statusCode);
});

// ROUTES FOR THE API
// =============================================================================
var router = express.Router();              // get an instance of the express Router


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api

app.use('/api', require('./api-sim'));


// START THE HTTP(S) SERVER
// =============================================================================
var server = http.createServer(app).listen(port);

logger.info('HA API Simulator Server listening on ' + port);


// SHUTDOWN THE APPLICATION WHEN ASKED TO
// =============================================================================

var shutdown = function () {

  logger.info("Shuttting HA API Simulator Server")
  server.close(function () {
    logger.info("HA API Simulator Server closed sucessfully");
    logger.info("Shutdown completed, exiting");
    process.exit(0);
  });

  // if after
  setTimeout(function () {
    logger.error("Could not close connections in time, forcefully shutting down");
    process.exit()
  }, 10 * 1000);
};

process.on('SIGTERM', function () {
  logger.info("Got signal SIGTERM, shutting down");
  shutdown();

});

process.on('SIGINT', function () {
  logger.info("Got signal SIGINT, shutting down");
  shutdown();
});
