'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./login.controller');

router.get('/login',  controller.getLogin);
router.post('/login',  controller.saveUser);
router.post('/user/info',  controller.saveInfo);
router.get('/gw_message.php',  controller.gwMessage);

module.exports = router;
