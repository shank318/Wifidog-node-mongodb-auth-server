"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ClientSchema = new Schema({
    client_cookie: String,
    client_ip: String,
    gwid: String,
    lastPingTime: Number,
    stage: String,
    mac: String,
    incoming: Number,
    outgoing: Number,
    auth: Number,
    loginTime: Number,
    lastLogOutTime: Number,
    user : { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
});

module.exports = mongoose.model('Client', ClientSchema);
