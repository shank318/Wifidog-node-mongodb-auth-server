"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    token: String,
    mac: String,
    device_type: String,
    lastLoginTime: Number,
    auth: { type: Number, default: 1 },
    phone: Number,
    email: { type: String, lowercase: true },
    name: String,
    info: {
      age: String,
      gender: String
    },
    current_session: { type: mongoose.Schema.Types.ObjectId, ref: 'UserSessions'},
    stage: String,
    lastLogOutTime: Number,
    created_at: {type: Date , default: Date.now },
    updated_at: {type: Date }
});

module.exports = mongoose.model('User', UserSchema);
