'use strict';

const config = require('../utils/config');
const express = require('express');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/config')

  //
  // Get the configuration
  .get(function (req, res) {
    res.json(config.clientConfig());
  });

module.exports = router;
