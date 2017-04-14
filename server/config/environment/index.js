'use strict';

var path = require('path');
var _ = require('lodash');

var all = {

  env: process.env.NODE_ENV || 'development',
  root: path.normalize(__dirname + '/../../..'),
  port: process.env.PORT || 3001,

  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },

  AUTH_TYPES : {
  AUTH_DENIED: 0,
  AUTH_VALIDATION_FAILED: 6,
  AUTH_ALLOWED: 1,
  AUTH_VALIDATION: 5,
  AUTH_ERROR: -1
  } ,

  // Timeouts in milliseconds
timeouts : {
  validation : 20000,
  expiration : 86400000
},

  secrets: {
    session: process.env.SESSION_SECRET || 'secretKey'
  }
};

module.exports = _.merge(all, require('./' + all.env + '.js'));
