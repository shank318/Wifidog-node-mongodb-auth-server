"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TrafficLogsSchema = new Schema({
    mac: String,
    links: []
});

module.exports = mongoose.model('TrafficLogs', TrafficLogsSchema);
