"use strict"

var TrafficLogs = require('./trafficlogs.model');
var fs = require('fs');


var logs = {};


logs.uploadTraffic = function( req, res ) {
    
     if (!req.files)
    return res.status(400).send('No files were uploaded.');
 
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file 
    let logfile = req.files.logfile;
    let dhcpLease = req.files.dhcp_lease;
    // Use the mv() method to place the file somewhere on your server 
    logfile.mv('traffic_logs.txt', function(err) {
      if (err)
        return res.status(500).send(err);
        dhcpLease.mv('dhcp.txt', function(err) {
          if (err)
            return res.status(500).send(err);
          var input = fs.createReadStream('dhcp.txt');
          readLinesFromDhcpLease(input, funcDhcpLeaseLine);
          res.send('File uploaded!');
        });
    });
}

function readLinesFromTrafficLogs(input, funcTrafficLogLine, ip_to_mac) {
  var remaining = '';
  var finalMacToLinks={};
  input.on('data', function(data) {
    remaining += data;
    var index = remaining.indexOf('\n');
    while (index > -1) {
      var line = remaining.substring(0, index);
      remaining = remaining.substring(index + 1);
      var data = funcTrafficLogLine(line);
      var mac = ip_to_mac[data.ip_address];
      var linkVisitedByThisMac = data.link;
      if(finalMacToLinks[mac]) {
        finalMacToLinks[mac].push(linkVisitedByThisMac)
      }else{
        finalMacToLinks[mac] = [linkVisitedByThisMac]
      }
      index = remaining.indexOf('\n');
    }
  });

  input.on('end', function() {
    if (remaining.length > 0) {
      funcTrafficLogLine(remaining);
    }
    var arr = [];
    for (var key in finalMacToLinks) {
        if (key && key!="undefined" && finalMacToLinks.hasOwnProperty(key)) {
            var object = {
              mac: key,
              links: finalMacToLinks[key]
            }
            arr.push(object)
        }
    }
    TrafficLogs.create(arr, function(err, created){
      if(err) console.log("Error in saveing traffic logs")
      else console.log("Logs saved");
    });
  });
}

function readLinesFromDhcpLease(input, funcDhcpLeaseLine) {
  var remaining = '';
  var ip_to_mac ={};
  input.on('data', function(data) {
    remaining += data;
    var index = remaining.indexOf('\n');
    while (index > -1) {
      var line = remaining.substring(0, index);
      remaining = remaining.substring(index + 1);
      var data = funcDhcpLeaseLine(line);
      if(data.ip_address){
       ip_to_mac[data.ip_address] = data.mac
      }
      index = remaining.indexOf('\n');
    }
  });

  input.on('end', function() {
    if (remaining.length > 0) {
      var data = funcDhcpLeaseLine(remaining);
      ip_to_mac[data.ip_address] = data.mac
    }
    console.log(ip_to_mac)
    var input = fs.createReadStream('traffic_logs.txt');
    readLinesFromTrafficLogs(input, funcTrafficLogLine, ip_to_mac);
  });
}

function funcDhcpLeaseLine(data) {
  var ip_traffic ={};
  var regIp = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
  var t = data.match(regIp);
  if(!t || t.length == 0) return ip_traffic;
  var regMac = data.match(/([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/);
  if(!regMac || regMac.length ==0 ) return ip_traffic;
  ip_traffic.ip_address = t[0];
  ip_traffic.mac = regMac[0]
  return ip_traffic;
}

function funcTrafficLogLine(data) {
  var ip_traffic = {};
  var r = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
  var t = data.match(r);
  if(!t || t.length == 0) return ip_traffic;
  var linkReg = "((?:(http|https|Http|Https|rtsp|Rtsp):\\/\\/(?:(?:[a-zA-Z0-9\\$\\-\\_\\.\\+\\!\\*\\'\\(\\)"
+ "\\,\\;\\?\\&\\=]|(?:\\%[a-fA-F0-9]{2})){1,64}(?:\\:(?:[a-zA-Z0-9\\$\\-\\_"
+ "\\.\\+\\!\\*\\'\\(\\)\\,\\;\\?\\&\\=]|(?:\\%[a-fA-F0-9]{2})){1,25})?\\@)?)?"
+ "((?:(?:[a-zA-Z0-9][a-zA-Z0-9\\-]{0,64}\\.)+"   // named host
+ "(?:"   // plus top level domain
+ "(?:aero|arpa|asia|a[cdefgilmnoqrstuwxz])"
+ "|(?:biz|b[abdefghijmnorstvwyz])"
+ "|(?:cat|com|coop|c[acdfghiklmnoruvxyz])"
+ "|d[ejkmoz]"
+ "|(?:edu|e[cegrstu])"
+ "|f[ijkmor]"
+ "|(?:gov|g[abdefghilmnpqrstuwy])"
+ "|h[kmnrtu]"
+ "|(?:info|int|i[delmnoqrst])"
+ "|(?:jobs|j[emop])"
+ "|k[eghimnrwyz]"
+ "|l[abcikrstuvy]"
+ "|(?:mil|mobi|museum|m[acdghklmnopqrstuvwxyz])"
+ "|(?:name|net|n[acefgilopruz])"
+ "|(?:org|om)"
+ "|(?:pro|p[aefghklmnrstwy])"
+ "|qa"
+ "|r[eouw]"
+ "|s[abcdeghijklmnortuvyz]"
+ "|(?:tel|travel|t[cdfghjklmnoprtvwz])"
+ "|u[agkmsyz]"
+ "|v[aceginu]"
+ "|w[fs]"
+ "|y[etu]"
+ "|z[amw]))"
+ "|(?:(?:25[0-5]|2[0-4]" // or ip address
+ "[0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\\.(?:25[0-5]|2[0-4][0-9]"
+ "|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\\.(?:25[0-5]|2[0-4][0-9]|[0-1]"
+ "[0-9]{2}|[1-9][0-9]|[1-9]|0)\\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}"
+ "|[1-9][0-9]|[0-9])))"
+ "(?:\\:\\d{1,5})?)" // plus option port number
+ "(\\/(?:(?:[a-zA-Z0-9\\;\\/\\?\\:\\@\\&\\=\\#\\~"  // plus option query params
+ "\\-\\.\\+\\!\\*\\'\\(\\)\\,\\_])|(?:\\%[a-fA-F0-9]{2}))*)?"
+ "(?:\\b|$)";;
  var linksInText = data.match(linkReg);
  if(!linksInText || linksInText.length == 0) return ip_traffic;
  ip_traffic.ip_address = t[0];
  ip_traffic.link = linksInText[0]
  return ip_traffic;

}


module.exports = logs;