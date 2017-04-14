"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SessionsSchema = new Schema({
    started_at: {type: Date },
    incoming: Number,
    ougoing: Number,
    user : { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    ends_at: {type: Date }
});

module.exports = mongoose.model('UserSessions', SessionsSchema);
