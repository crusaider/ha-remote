'use strict';

var express = require('express');
var request = require('request');

var logger = require('../utils/logger');
var config = require('../utils/config');
var ha = require('../ha-api');


var router = express.Router();

router.route('/controls/:id/poweron')

    .post(function (req, res) {

        var control = config.controlDescription(Number(req.params.id));
        
        ha.callService( control.service.domain,
            control.service.onService,
            { entity_id: control.device_id },
            function(err, responseBody ){
            if ( err ) {
                logger.error("Failed to call poweron service for device: %s", control.device_id);
                return res.status(err).json(responseBody); 
            }    
            
            res.json(responseBody);
        })
    })

router.route('/controls/:id/poweroff')

    .post(function (req, res) {

        var control = config.controlDescription(Number(req.params.id));
        
        ha.callService( control.service.domain,
            control.service.offService, 
            { entity_id: control.device_id },
            function(err, responseBody ){
            if ( err ) {
                logger.error("Failed to call poweroff service for device: %s", control.device_id);
                return res.status(err).json(responseBody); 
            }    
            
            res.json(responseBody);
        })
    })

router.route('/controls/:id')

    .get(function (req, res) {

        var control = config.controlDescription(Number(req.params.id));
        
        ha.getDeviceState( control.device_id,
            function(err, responseBody ){
            if ( err ) {
                logger.error("Failed to call get state service for device: %s", control.device_id);
                return res.status(err).json(responseBody); 
            }    
            
            res.json({ state: responseBody.state });
        })
    })


module.exports = router;