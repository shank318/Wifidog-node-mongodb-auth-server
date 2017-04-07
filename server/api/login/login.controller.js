"use strict"
var Errors = require('../../error');
var Success = require('../../responses');
var User = require('../user/user.model');

var loginrequest = {};

/**
   * Receive request to login
   */
loginrequest.getLogin =  function( req, res ) {
    console.log("login called..");
    // Get the moment now
    var moment = require( 'moment' );
    var now = moment();
    
    // Get the client IP
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var token = '';


    
    // If we have the client, send its information. Otherwise send information
    // that is generated now.
    // var c = clients.get( ip );
    
    // console.log( 'Login with IP: ' + ip );
    // console.log(JSON.stringify(c))
    // if ( !c ) {
    //   // Generate a token for this client
    //   var crypt = require('crypto');
    //   token = crypt.randomBytes( 64 ).toString('hex');
    
    //   // Update the client information
    //   clients.set( ip, token, req.query.gw_id, Math.floor( now.format( 'x' ) ) );
    //   clients.setAuthType( ip, clients.AUTH_TYPES.AUTH_VALIDATION );
      
    //   // Save changes
    //   clients.save();
    // }
    //res.redirect("/web");
    // Register token with gateway
   res.render('login', { error: null, isAuth: null,catId: null, regId: null, gid: null });
    //res.redirect( 'http://' + req.query.gw_address + ':' + req.query.gw_port + '/wifidog/auth?token=' + token );
  }


/**
   * Gateway redirects to this action when there is an authentication error.
   */
loginrequest.gwMessage =  function( req, res ) {
    console.log("gw_message..");
    // Get the client IP
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    // If we have the client, send its information. Otherwise send information
    // that is generated now.
    // var c = clients.get( ip );
    var c;
    // Get the moment now
    var moment = require( 'moment' );
    var now = moment();
    
    console.log( 'IP: ' + ip + ', GW-Message: ' + req.query.message );
    
    if ( c ) {
      switch( req.query.message ) {
      case 'denied':
      case 'failed_validation':
        // clients.set( ip, c.token, c.gwid, Math.floor( now.format( 'x' ) ) );
      case 'activate':
        console.log("Activated");
         res.redirect( '/connected' );
        break;
      }
      
      // Save changes
      clients.save();
    } else {    
      res.send( 'Access Denied!' );
    }
  }



module.exports = loginrequest;