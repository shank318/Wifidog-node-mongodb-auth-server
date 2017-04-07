"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    gwid: String,
    gwIP: String,
    sysUpTime: String,
    sysMemFree: String,
    sysLoad: String,
    wifiDogUpTime: String,
    lastPingTime: String
});

module.exports = mongoose.model('User', UserSchema);
