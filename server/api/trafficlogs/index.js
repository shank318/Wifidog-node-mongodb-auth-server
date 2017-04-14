'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./trafficlogs.controller');

router.post('/upload',  controller.uploadTraffic);

module.exports = router;
