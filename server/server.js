'use strict';
var config = require('./config/environment');
var express = require('express');
var chalk = require('chalk');
var mongoose = require('mongoose');
var path = require('path');
mongoose.connect(config.mongo.uri, config.mongo.options);


var app = express();

 
app.use(express.static(path.join(__dirname, 'public')));
var server = require('http').createServer(app);


require('./config/express')(app);
require('./routes')(app);
server.listen(config.port, config.ip, function () {

  console.log(
    chalk.red('\nExpress server listening on port ')
    + chalk.yellow('%d')
    + chalk.red(', in ')
    + chalk.yellow('%s')
    + chalk.red(' mode.\n'),
    config.port,
    app.get('env')
  );

  if (config.env === 'development') {
    require('ripe').ready();
  } 
});

module.exports = server;
