"use strict"

var User = require('../user/user.model');
var Errors = require('../../error');
var Success = require('../../responses');
var config = require('../../config/environment');
var Client = require('../user/clients.model');
var wifidogauth = {};


wifidogauth.getAuth = function( req, res ) {
    console.log("Auth api called..");
    // By default we deny authentication.
    var auth = config.AUTH_TYPES.AUTH_DENIED;
    
    // Get the moment now
    var moment = require( 'moment' );
    var now = moment();
    var nowInSeconds = Math.floor( now.format( 'x' ) );

    Client.findOne({ client_ip: req.query.ip, gwid: req.query.gw_id })
          .populate('user')
          .exec(function(err, client){
            if(err){
              console.log(JSON.stringify([err]))
              return res.send( 'Auth: ' + auth );
            }
            if(!client) return res.send( 'Auth: ' + auth );
            if(client.mac && (client.mac != req.query.mac )) {
              auth = config.AUTH_TYPES.AUTH_VALIDATION_FAILED
              Client.remove({ client_ip: req.query.ip, gwid: req.query.gw_id }, function( err, removed){
                  console.log("Mac addres dosen't match..removing client");
                  console.log( 'IP: ' + req.query.ip + ', Auth: ' + auth );
                  return res.send( 'Auth: ' + auth );
              });
            }else{
            auth = client.auth;
            var isInfoCompleted = false;
            if(client.user && client.user.info.age) {
              console.log("User info is completed");
              auth = config.AUTH_TYPES.AUTH_ALLOWED;
              isInfoCompleted = true;
            }else{
              console.log("User info not completed");
            }
            var clientData={};
            clientData.mac = req.query.mac;
            switch ( auth ) {
              case config.AUTH_TYPES.AUTH_VALIDATION:
                // Did we timeout?
                console.log('IP: ' + req.query.ip +"checking if client is validated..");
                if ( (isInfoCompleted == false) && (nowInSeconds > client.lastPingTime + config.timeouts.validation) ) {
                  clientData.auth = config.AUTH_TYPES.AUTH_VALIDATION_FAILED;
                  auth = config.AUTH_TYPES.AUTH_VALIDATION_FAILED
                  console.log('IP: ' + req.query.ip +"client validation failed")
                }
                break;
              case config.AUTH_TYPES.AUTH_ALLOWED:
                // Did we timeout? We expect user to validate again.
                console.log('IP: ' + req.query.ip +"client allowed");
                if ( nowInSeconds > client.lastPingTime + config.timeouts.expiration ) {
                  // Set the last logout time
                     clientData.lastLogOutTime = client.lastPingTime;
                     clientData.lastPingTime = Math.floor( now.format( 'x' )) ;
                     clientData.auth = config.AUTH_TYPES.AUTH_VALIDATION
                     auth = config.AUTH_TYPES.AUTH_VALIDATION
                } else {
                  // Update the server information
                      clientData.stage = req.query.stage;
                      clientData.incoming = req.query.incoming;
                      clientData.outgoing = req.query.outgoing;
                      clientData.lastPingTime = nowInSeconds;
                }
                  
                break;
              }
              Client.update({ "_id": client._id}, { $set: clientData }, function(err, updated){
                console.log("Client updated");
                console.log( 'IP: ' + req.query.ip + ', Auth: ' + auth );
                res.send( 'Auth: ' + auth );
              });
            }
          });
  }




module.exports = wifidogauth;