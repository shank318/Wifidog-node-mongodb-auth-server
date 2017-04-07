'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./gateways.controller');

router.get('/ping',  controller.getPong);

module.exports = router;
