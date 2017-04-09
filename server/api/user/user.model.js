"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    token: String,
    gwid: String,
    mac: String,
    email: { type: String, lowercase: true },
    name: String,
    info: {
      age: String,
      gender: String
    }
});

module.exports = mongoose.model('User', UserSchema);
