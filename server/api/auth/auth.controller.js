"use strict"

var User = require('../user/user.model');
var Errors = require('../../error');
var Success = require('../../responses');
var config = require('../../config/environment');

var wifidogauth = {};


wifidogauth.getAuth = function( req, res ) {
    console.log("Wifidog auth api called..");
    // By default we deny authentication.
    var auth = config.AUTH_TYPES.AUTH_TYPES.AUTH_DENIED;
    
    // Get the moment now
    var moment = require( 'moment' );
    var now = moment();
    var nowInSeconds = Math.floor( now.format( 'x' ) );
    
    // Which client?
    var c = clients.get( req.query.ip );
    
    // If we have the client
    if ( c ) {
            
      auth = c.auth;
      
      switch ( auth ) {
      case config.AUTH_TYPES.AUTH_TYPES.AUTH_VALIDATION:
        // Did we timeout?
        if ( nowInSeconds > c.lastPingTime + config.timeouts.validation ) {
          // clients.setAuthType( req.query.ip, config.AUTH_TYPES.AUTH_TYPES.AUTH_VALIDATION_FAILED );
          auth = config.AUTH_TYPES.AUTH_TYPES.AUTH_VALIDATION_FAILED
        }
        
        break;
      case clients.AUTH_TYPES.AUTH_ALLOWED:
        // Did we timeout? We expect user to validate again.
        if ( nowInSeconds > c.lastPingTime + config.timeouts.expiration ) {
          
          // Set the last logout time
          // clients.setLogoutTime( req.query.ip, c.lastPingTime );
          
          // clients.setLastPing( req.query.ip, Math.floor( now.format( 'x' ) ) );
          // clients.setAuthType( req.query.ip, clients.AUTH_TYPES.AUTH_VALIDATION );
          auth = config.AUTH_TYPES.AUTH_TYPES.AUTH_VALIDATION
        } else {
          // Update the server information
          // clients.setStatistical( req.query.ip, req.query.stage, req.query.mac, 
          //   req.query.incoming, req.query.outgoing, nowInSeconds );
        }
          
        break;
      }
      
      // Save state
      // clients.save();
    }
     
    console.log( 'IP: ' + req.query.ip + ', Auth: ' + auth );
    
    res.send( 'Auth: ' + auth );
  }




module.exports = wifidogauth;