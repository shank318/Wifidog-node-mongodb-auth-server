"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    token: String,
    gwid: String,
    mac: String,
    lastPingTime: Number,
    auth: Number,
    email: { type: String, lowercase: true },
    name: String,
    info: {
      age: String,
      gender: String
    },
    stage: String,
    lastLogOutTime: Number,
    created_at: {type: Date , default: Date.now },
    updated_at: {type: Date }
});

module.exports = mongoose.model('User', UserSchema);
