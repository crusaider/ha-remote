'use strict';

var config = require('../utils/config');
var express = require('express');

var router = express.Router(); // eslint-disable-line new-cap

router.route('/config')

  //
  // Get the configuration

  .get(function (req, res) {
    res.json(config.clientConfig());
  });

module.exports = router;
