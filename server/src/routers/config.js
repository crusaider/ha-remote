'use strict';

const config = require('../utils/config');
const express = require('express');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/config')

//
// Get the configuration
  .get(function (req, res) {
    config.clientConfig((err, config) => {
      if (err) {
        return res.status(500).json({error: 'Invalid configuration'});
      }
      return res.json(config);
    });
  });

module.exports = router;
