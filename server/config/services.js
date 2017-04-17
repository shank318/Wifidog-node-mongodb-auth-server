'use strict'
var request = require('request');
module.exports= {
  sendSMSDataConsumed: function (phone, name){
    var http = require('http');
    var urlencode = require('urlencode');
    var message = "Hi "+name+", Your limit of 100MB of daily data usage has been exhausted, please login back after ";
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
  }
}

//module.exports.sendSMSDataConsumed("919741948625","Shashank");