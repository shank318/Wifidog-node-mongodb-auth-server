'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./auth.controller');

router.get('/auth',  controller.getAuth);

module.exports = router;
