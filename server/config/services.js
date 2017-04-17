'use strict'
var request = require('request');
var UserSession = require('../api/user/sessions.model');
module.exports= {
  sendSMSDataConsumed: function (phone, name){
    var http = require('http');
    var urlencode = require('urlencode');
    var message = "Hi "+name+", Your limit of 100MB daily data usage has been exhausted.";
    var msg=urlencode(message);
    var number= phone;
    var apiKey='nUxPqf/fkfM-TJJAGdXOpC4XfV1vAENq3UrTTfzmyj';
    var sender='txtlcl';
    var data='apiKey='+apiKey+'&sender='+sender+'&numbers='+number+'&message='+msg
    var options = {
     host: 'api.textlocal.in',
      path: '/send?'+data
    };
    http.request(options, function(response){
      var str = '';
      //another chunk of data has been recieved, so append it to `str`
      response.on('data', function (chunk) {
      str += chunk;
      });
      //the whole response has been recieved, so we just print it out here
      response.on('end', function () {
      console.log(str);
      });
    }).end();
  },

  checkIfDailyDataLimitReached: function(mac, callback){
    var start = new Date();
    start.setHours(0,0,0,0);
    var end = new Date();
    end.setHours(23,59,59,999);
    UserSession.find({ mac: mac,  started_at: {$gte: start, $lt: end}}, function( err, sessions){
      if(err) {
        console.log("Unable to load sessions");
        //Playing safe
        callback(false);
      }
      console.log("Total totay sessions "+sessions.length);
      var totalBytesUsed=0;
      sessions.forEach(function(session){
        totalBytesUsed= totalBytesUsed+ session.incoming + session.outgoing; 
      });
      console.log("Total data used today "+totalBytesUsed);
      if(totalBytesUsed>= 100000000){
        callback(true)
      }else{
        callback(false)
      }
    });
  }
}

//module.exports.sendSMSDataConsumed("919741948625","Shashank");