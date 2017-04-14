"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SessionsSchema = new Schema({
    started_at: {type: Date },
    incoming: { type: Number, default: 0},
    outgoing: { type: Number, default: 0},
    mac : String
});

module.exports = mongoose.model('UserSessions', SessionsSchema);
