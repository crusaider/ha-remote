'use strict';

var express = require('express');
var request = require('request');

var logger = require('../utils/logger');
var config = require('../utils/config');
var ha = require('../ha-api');
var telldus = require('../telldus-api');

var BACKEND_HA = "ha";
var BACKEND_TELLDUS = "telldus";



var router = express.Router();

router.route('/controls/:id/poweron')

  .post(function (req, res) {

    var control = config.controlDescription(Number(req.params.id));

    switch (control.backend) {
      case BACKEND_HA:
        ha.callService(control.service.domain,
          control.service.onService,
          { entity_id: control.device_id },
          function (err, responseBody) {
            if (err) {
              logger.error("Failed to call poweron service for device: %s", control.device_id);
              return res.status(err).json(responseBody);
            }

            return res.json(responseBody);
          });
        break;
      case BACKEND_TELLDUS:
        telldus.turnOn(control.device_id, function (err) {
          if (err) {
            logger.error("Failed to call turnOn API for device: %s, error message: %s", control.device_id, err);
            return res.status(500).send(err);
          }
          return res.status(200).send();
        });
        break;
      default:
        logger.error("Unknown backend %s for device %s", control.backend, control.device_id);
        return res.status(500).send();
    }
  })

router.route('/controls/:id/poweroff')

  .post(function (req, res) {

    var control = config.controlDescription(Number(req.params.id));

    switch (control.backend) {
      case BACKEND_HA:
        ha.callService(control.service.domain,
          control.service.offService,
          { entity_id: control.device_id },
          function (err, responseBody) {
            if (err) {
              logger.error("Failed to call poweroff service for device: %s", control.device_id);
              return res.status(err).json(responseBody);
            }

            return res.json(responseBody);
          })
        break;
      case BACKEND_TELLDUS:
        telldus.turnOff(control.device_id, function (err) {
          if (err) {
            logger.error("Failed to call turnOff API for device: %s, error message: %s", control.device_id, err);
            return res.status(500).send(err);
          }
          return res.status(200).send();
        });
        break;
      default:
        logger.error("Unknown backend %s for device %s", control.backend, control.device_id)
        return res.status(500).send();
    }
  })

router.route('/controls/:id')

  .get(function (req, res) {

    var control = config.controlDescription(Number(req.params.id));

    switch (control.backend) {
      case BACKEND_HA:
        ha.getDeviceState(control.device_id,
          function (err, responseBody) {
            if (err) {
              logger.error("Failed to call get state service for device: %s", control.device_id);
              return res.status(err).json(responseBody);
            }

            return res.json({ state: responseBody.state });
          })
        break;
      case BACKEND_TELLDUS:
        telldus.getDeviceState(control.device_id, function (err, state) {
          if (err) {
            logger.error("Call to telldus getDeviceState failed, error message: %s", err);
            return res.status(500).send(err);
          }

          return res.json({ state: state });
        });

        break;
      default:
        logger.error("Unknown backend %s for device %s", control.backend, control.device_id)
        return res.status(500).send();
    }
  })


module.exports = router;
