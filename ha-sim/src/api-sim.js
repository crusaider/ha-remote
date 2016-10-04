/**
 * Simulates parts of the Home Assistant REST Api
 */

'use strict';

var express = require('express');
var fs = require('fs');
var logger = require('./utils/logger');
var devices = require('./devices');

var router = express.Router();

router.route('/services/:domain/:service')


  .post(function (req, res) {
    if (req.params.domain != "switch") {
      logger.error("Servicedomain: %s is not implemented", req.params.domain);
      return res.send(500);
    }
    if (!devices.exists(req.body.entity_id)) {
      logger.error("Device id %s does not exist", req.body.entity_id);
      return res.send(404);
    }

    switch (req.params.service) {

      case "turn_on":
        flipSwitch(req.body.entity_id, devices.switchOn);
        return res.send(200);

      case "turn_off":
        flipSwitch(req.body.entity_id, devices.switchOff);
        return res.send(200);

      default:
        logger.error("Service: %s is not implemented", req.params.service);
        return res.send(500);

    }
  });

/**
 * Flips a switch with a optional delay to be able to simluate the
 * fact that HA not always reflects the new state of a entitiy
 * emediatley.
 *
 * Defauls to 10 ms delay - can be set trough STATEDELAY environment
 * variable.
 *
 * @param entity_id The entity to flip
 * @param executor the switch function (on or off)
 */
function flipSwitch(entity_id, executor) {
  setTimeout(function () {
    executor(entity_id);
  }, process.env.STATEDELAY || 0);
}

router.route('/states/:entity_id')

  .get(function (req, res) {
    if (devices.exists(req.params.entity_id)) {
      return res.json(
        {
          entity_id: req.params.entity_id,
          state: devices.getState(req.params.entity_id)
        });

    } else {
      logger.error("Device id %s does not exist", req.params.entity_id);
      return res.send(404);
    }

  });

module.exports = router;

