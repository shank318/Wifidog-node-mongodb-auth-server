'use strict';

var express = require('express');
var morgan = require('morgan');
var path = require('path');
var bodyParser = require('body-parser');

// auth purpose
// var session = require('express-session');
var mongoose = require('mongoose');

var config = require('./environment');

module.exports = function (app) {

  var env = config.env;

// view engine setup
  app.set('views', path.join(__dirname, '../../views'));
  app.set('view engine', 'ejs');
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(morgan('dev'));
  app.use(express.static(path.join(__dirname, '../../public')));


  if (env === 'development' || env === 'test') {
    app.use(require('errorhandler')());
  }

};
