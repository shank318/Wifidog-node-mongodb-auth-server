"use strict"

var User = require('../user/user.model');
var Errors = require('../../error');
var Success = require('../../responses');
var config = require('../../config/environment');
var Client = require('../user/clients.model');
var UserSession = require('../user/sessions.model');
var SERVICES = require('../../config/services');
var wifidogauth = {};


wifidogauth.getAuth = function( req, res ) {
    console.log("Auth api called..");
    // By default we deny authentication.
    var auth = config.AUTH_TYPES.AUTH_DENIED;
    
    // Get the moment now
    var moment = require( 'moment' );
    var now = moment();
    var nowInSeconds = Math.floor( now.format( 'x' ) );

    User.findOne({ "mac": req.query.mac },function(err, user){
            if(err){
              console.log(JSON.stringify([err]))
              return res.send( 'Auth: ' + auth );
            }
            if(!user) return res.send( 'Auth: ' + auth );
            if(user.mac != req.query.mac ) {
              auth = config.AUTH_TYPES.AUTH_VALIDATION_FAILED
            }else{
            auth = user.auth;
            // if ( nowInSeconds > user.lastLoginTime + config.timeouts.expiration) {
            //       auth = config.AUTH_TYPES.AUTH_VALIDATION_FAILED
            //       console.log('IP: ' + req.query.ip +"client validation failed")
            //       //Send SMS
            //       SMS.sendSMSDataConsumed(user.phone,user.name);
            // }
            console.log("Incoming "+req.query.incoming)
            console.log("outgoing "+req.query.outgoing)
            if(req.query.incoming <= 0 && req.query.outgoing <= 0){
              UserSession.create({ started_at: Date.now(), mac: req.query.mac}, function(err, session){
                  User.update( {_id: user._id}, { $set: { current_session:session._id } }, function(err, update){
                    console.log('IP: ' + req.query.ip+" New Session created ");
                    sendAuth(req, auth, res);
                });
              });
            }else if(user.current_session){
              UserSession.update({_id: user.current_session}, { $set: { incoming: req.query.incoming, outgoing: req.query.outgoing }}, function(err, updated){
                console.log('IP: ' + req.query.ip+" Session updated ");
                sendAuth(req, auth, res);
              });
            }else{
              console.log("No session attached!");
              sendAuth(req, auth, res);
            }
           }
          });
  }


  function sendAuth(req, auth, res){
      SERVICES.checkIfDailyDataLimitReached(req.query.mac, function(isReached){
        if(isReached){
          console.log("100 MB daily data limit reached");
          auth = config.AUTH_TYPES.AUTH_VALIDATION_FAILED;
          console.log('IP: ' + req.query.ip +"client validation failed");
          SERVICES.sendSMSDataConsumed(user.phone,user.name);
        }
        console.log( 'IP: ' + req.query.ip + ', Auth: ' + auth );
        res.send( 'Auth: ' + auth );
      });
  }




module.exports = wifidogauth;