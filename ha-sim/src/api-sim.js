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
                devices.switchOn(req.body.entity_id);
                return res.send(200);

            case "turn_off":
                devices.switchOff(req.body.entity_id);
                return res.send(200);

            default:
                logger.error("Service: %s is not implemented", req.params.service);
                return res.send(500);

        }
    });

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

