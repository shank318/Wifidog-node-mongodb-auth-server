"use strict"
var Errors = require('../../error');
var Success = require('../../responses');
var User = require('../user/user.model');
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
    
    // Get the client IP
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var token = '';
    ip = ip.replace( '::ffff:', '' );

    Client.findOne( { client_ip: ip, gwid: req.query.gw_id , client_cookie: req.session.client_cookie})
          .populate('user')
          .exec(function(err, client) {
             if(err) res.render('error')
            if(client){
                if(client.user){
                    if(client.user.info.age) {
                        ///Everything is ok, give access to internet.
                        console.log("Send token to gateway");
                        Client.update( {_id: client._id}, { $set: { lastPingTime: Math.floor( now.format( 'x' ) ) } }, function(err, update){
                            res.redirect('http://' + req.query.gw_address + ':' + req.query.gw_port + '/wifidog/auth?token='+client.user.token);
                        });
                    }else{
                        console.log("User exists with incomplete into..show info page")
                        renderUserInfoPage(res, req.query.gw_address,req.query.gw_port, ip, req.query.gw_id, client.user.email );
                    }
                }else{
                  console.log("No user is bind to this client..show login page")
                  renderLoginPage(res, req.query.gw_address,req.query.gw_port, ip, req.query.gw_id );
                }
            }else{
              console.log("Client does not exists..show login page")
              renderLoginPage(res, req.query.gw_address,req.query.gw_port, ip, req.query.gw_id );
            }
          });
    //res.redirect( 'http://' + req.query.gw_address + ':' + req.query.gw_port + '/wifidog/auth?token=' + token );
  }

 function renderLoginPage(res, gw_address, gw_port, ip, gwid ) {
    var data = {
    redirect_url:  'http://' + gw_address + ':' + gw_port + '/wifidog/auth?token=',
    ip: ip.replace( '::ffff:', '' ),
    gwid: gwid
    }
    res.render('login', data);
 }

 function renderUserInfoPage(res, gw_address, gw_port, ip, gwid , email) {
    var data = {
    redirect_url:  'http://' + gw_address + ':' + gw_port + '/wifidog/auth?token=',
    ip: ip.replace( '::ffff:', '' ),
    gwid: gwid,
    email: email
    }
    res.render('userinfo', data);
 }

  loginrequest.saveUser = function( req, res ) {
     if( !req.body.email ) {
        return Errors.errorMissingParam(res, 'state');
    }
    var token = crypt.randomBytes( 64 ).toString('hex');
    var client_cookie = req.session.client_cookie;
    if(!client_cookie) client_cookie = crypt.randomBytes( 10 ).toString('hex');
    var moment = require( 'moment' );
    var now = moment();
    var email = req.body.email.toString();
    User.findOneAndUpdate(  { "email": email.toLowerCase() },
                            { $set: { "email": email.toLowerCase(), 
                                      "name": req.body.name,
                                      "phone": req.body.phone,
                                      "token":token 
                                    } 
                            },
                            { upsert: true, new: true},
                            function( err, user){
                                if(err) return Errors.errorServer( res, err );
                                Client.update({ client_ip: req.body.ip, gwid: req.body.gwid },
                                               { $set: { 
                                                         client_ip: req.body.ip,
                                                         gwid: req.body.gwid,
                                                         user: user._id,
                                                         client_cookie: client_cookie,
                                                         auth: config.AUTH_TYPES.AUTH_VALIDATION,
                                                         lastPingTime: Math.floor( now.format( 'x' ) ) 
                                                        }
                                               },
                                               { upsert: true},
                                               function( err, client){
                                                 if(err) return Errors.errorServer( res, err );
                                                 console.log("Redirecting "+req.body.redirect_url+user.token);
                                                 req.session.client_cookie = client_cookie;
                                                 res.redirect(req.body.redirect_url+token);
                                               });
                            });
  }

  loginrequest.saveInfo = function( req, res ) {
    if( !req.body.email ) {
        return Errors.errorMissingParam(res, 'state');
    }
    var moment = require( 'moment' );
    var now = moment();
    var email = req.body.email.toString();
    User.findOneAndUpdate(  { "email": email.toLowerCase() },
                            { $set: { 
                                      info: { "age": req.body.age,
                                              "gender": req.body.gender
                                            }
                                    } 
                            },
                            { new: true },
                            function( err, user){
                                if(err) return Errors.errorServer( res, err );
                                Client.findOneAndUpdate({ client_ip: req.body.ip, gwid: req.body.gwid },
                                               { $set: { 
                                                         client_ip: req.body.ip,
                                                         gwid: req.body.gwid,
                                                         auth: config.AUTH_TYPES.AUTH_VALIDATION,
                                                         lastPingTime: Math.floor( now.format( 'x' ) ) 
                                                        }
                                               },
                                               { new: true},
                                               function( err, client){
                                                 if(err) return Errors.errorServer( res, err );
                                                 console.log("Redirecting "+req.body.redirect_url+user.token);
                                                 req.session.client_cookie = client.client_cookie;
                                                 res.redirect(req.body.redirect_url+user.token);
                                               });
                            });
  }


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