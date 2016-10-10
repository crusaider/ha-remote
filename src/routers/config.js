'use strict';

var logger = require('../utils/logger');
var config = require('../utils/config');
var express = require('express');


var router = express.Router();

router.route('/config')

  //
  // Get the configuration

  .get(function (req, res) {
    res.json(config.clientConfig());
  });

module.exports = router;
