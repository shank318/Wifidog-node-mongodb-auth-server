"use strict"
var Errors = require('../../error');
var Success = require('../../responses');
var User = require('../user/user.model');
var UserSession = require('../user/sessions.model');
var Client = require('../user/clients.model');
var crypt = require('crypto');
var config = require('../../config/environment');
var loginrequest = {};

/**
   * Receive request to login
   */
loginrequest.getLogin =  function( req, res ) {
    console.log("login called..");
    // Get the moment now
    var moment = require( 'moment' );
    var now = moment();
    var nowInSeconds = Math.floor( now.format( 'x' ) );
    
    // Get the client IP
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var token = '';
    ip = ip.replace( '::ffff:', '' );

    User.findOne( { mac: req.query.mac })
          .exec(function(err, user) {
             if(err) res.render('error')
            if(user){
                if ( nowInSeconds > user.lastLoginTime + config.timeouts.expiration ) {
                  console.log("User expired..asking to login again");
                  renderLoginPage(res, req.query.gw_address,req.query.gw_port, req.query.mac );
                }else{
                    ///Everything is ok, give access to internet.
                    console.log("Send token to gateway");
                    UserSession.create({ started_at: Date.now(), mac: req.query.mac}, function(err, session){
                      User.update( {_id: user._id}, { $set: { current_session:session._id, lastLoginTime: Math.floor( now.format( 'x' ) ) } }, function(err, update){
                          res.redirect('http://' + req.query.gw_address + ':' + req.query.gw_port + '/wifidog/auth?token='+user.token);
                      });
                    });
               }
            }else{
              console.log("User does not exists..show login page")
              renderLoginPage(res, req.query.gw_address,req.query.gw_port, req.query.mac );
            }
          });
    //res.redirect( 'http://' + req.query.gw_address + ':' + req.query.gw_port + '/wifidog/auth?token=' + token );
  }

 function renderLoginPage(res, gw_address, gw_port, mac ) {
    var data = {
    redirect_url:  'http://' + gw_address + ':' + gw_port + '/wifidog/auth?token=',
    mac: mac
    }
    res.render('login', data);
 }

 function renderUserInfoPage(res, gw_address, gw_port, gwid , mac) {
    var data = {
    redirect_url:  'http://' + gw_address + ':' + gw_port + '/wifidog/auth?token=',
    ip: ip.replace( '::ffff:', '' ),
    gwid: gwid,
    mac: mac
    }
    res.render('userinfo', data);
 }

  loginrequest.saveUser = function( req, res ) {
     if( !req.body.email ) {
        return Errors.errorMissingParam(res, 'email');
    }
    if( !req.body.mac ) {
        return Errors.errorMissingParam(res, 'mac');
    }
    var token = crypt.randomBytes( 64 ).toString('hex');

    var moment = require( 'moment' );
    var now = moment();
    var email = req.body.email.toString();
    UserSession.create({ started_at: Date.now(), mac: req.body.mac}, function(err, session){
      if(err) return Errors.errorServer( res, err );
      User.update( { "mac": req.body.mac }, { $set: { current_session:session._id, lastLoginTime: Math.floor( now.format( 'x' ) ) } }, function(err, nUpdated, rawResponse){
        if(err) return Errors.errorServer( res, err );
        if(nUpdated && !nUpdated.nModified) {
          User.create({   "email": email.toLowerCase(), 
                          "name": req.body.name,
                          "phone": req.body.phone,
                          "token":token,
                          "current_session":session._id,
                          "mac": req.body.mac,
                          "lastLoginTime": Math.floor( now.format( 'x' ) )
                        }, function( err, created){
                            if(err) return Errors.errorServer( res, err );
                            res.redirect(req.body.redirect_url+token);
                        });
        }else{
          res.redirect(req.body.redirect_url+token);
        }
      });
    });
  }

  // loginrequest.saveInfo = function( req, res ) {
  //   if( !req.body.mac ) {
  //       return Errors.errorMissingParam(res, 'mac');
  //   }
  //   var moment = require( 'moment' );
  //   var now = moment();
  //   var email = req.body.email.toString();
  //   User.findOneAndUpdate(  { "mac": email.toLowerCase() },
  //                           { $set: { 
  //                                     info: { "age": req.body.age,
  //                                             "gender": req.body.gender
  //                                           }
  //                                   } 
  //                           },
  //                           { new: true },
  //                           function( err, user){
  //                               if(err) return Errors.errorServer( res, err );
  //                               Client.findOneAndUpdate({ client_ip: req.body.ip, gwid: req.body.gwid },
  //                                              { $set: { 
  //                                                        client_ip: req.body.ip,
  //                                                        gwid: req.body.gwid,
  //                                                        auth: config.AUTH_TYPES.AUTH_ALLOWED,
  //                                                        lastPingTime: Math.floor( now.format( 'x' ) ) 
  //                                                       }
  //                                              },
  //                                              { new: true},
  //                                              function( err, client){
  //                                                if(err) return Errors.errorServer( res, err );
  //                                                console.log("Redirecting "+req.body.redirect_url+user.token);
  //                                                // req.session.client_cookie = client.client_cookie;
  //                                                res.redirect(req.body.redirect_url+user.token);
  //                                              });
  //                           });
  // }


/**
   * Gateway redirects to this action when there is an authentication error.
   */
loginrequest.gwMessage =  function( req, res ) {
    console.log("gw_message..");
    // Get the client IP
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    ip = ip.replace( '::ffff:', '' );
    // Get the moment now
    var moment = require( 'moment' );
    var now = moment();
    
    console.log( 'IP: ' + ip + ', GW-Message: ' + req.query.message);

    Client.findOne( { client_ip: ip }, function( err, client){
        if(err) {
            console.log(JSON.stringify([err]))
            return res.send( 'Access Denied!' );
        }
        if(!client) {
           console.log("client not found");
           return res.send( 'Access Denied!' );
        }

        switch( req.query.message ) {
          case 'denied':
             console.log("User validation denied");
          case 'failed_validation':
             console.log("User validation failed");
          case 'activate':
             console.log("User activated");
             res.redirect( '/connected' );
            break;
          }
    });
  }




module.exports = loginrequest;