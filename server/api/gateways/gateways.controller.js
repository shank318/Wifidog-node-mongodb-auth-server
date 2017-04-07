"use strict"

var Gateway = require('./gateways.model');
var Errors = require('../../error');
var Success = require('../../responses');


var gateways = {};

/**
   * Receive ping from the gateway. Respond with a pong.
*/
gateways.getPong = function( req, res ) {
    
    // Get the moment now
    var moment = require( 'moment' );
    var now = moment();
    console.log("Ping coming from gateway "+req.query.gw_id);
    // Get the ip of gateway
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if( !ip ) {
    return Errors.errorMissingParam(res, 'ip');
    }
    if( !req.query.gw_id ) {
    return Errors.errorMissingParam(res, 'gw_id');
    }
    var gateway = {
      gwid: (req.query.gw_id).replace( '::ffff:', '' );,
      gwIP: ip,
      sysUpTime: req.query.sys_uptime,
      sysMemFree: req.query.sys_memfree,
      sysLoad: req.query.sys_load,
      wifiDogUpTime: req.query.wifidog_uptime,
      lastPingTime: Math.floor( now.format( 'x' ) )
    }
    // Update the server information
    Gateway.update({ gwid: req.query.gw_id }, gateway, { upsert: true} , function( err, nUpdated){
      if(err) {
        console.log(err);
        res.send('Error')
      }else {
        res.send( 'Pong' );
      }
    });
}


module.exports = gateways;