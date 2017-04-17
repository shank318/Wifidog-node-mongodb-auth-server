'use strict';
var sessions = require('client-sessions');
const fileUpload = require('express-fileupload');
var device = require('express-device');
var conf = {
  db: {
    db: 'wifidog',
    host: 'localhost',
    collection: 'wifidogsessions' // optional, default: sessions
  },
  secret: '076ee61d63aa10a125ea872411e433b9'
};



module.exports = function (app) {

   app.use(sessions({
    cookieName: 'session',
    secret: conf.secret,
    duration: 10*24 * 60 * 60 * 1000,
    activeDuration: 5 * 60 * 1000
    // store: new MongoStore(conf.db)
  }));
  app.use(fileUpload());
  app.use(device.capture());
  // API routes
  app.use('/', require('./api/gateways'));
  app.use('/', require('./api/auth'));
  app.use('/', require('./api/login'));
  app.use('/', require('./api/trafficlogs'));


// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }

// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });

app.get('/connected', function( req, res ){
    res.redirect("http://www.google.com");
});

app.get('/portal', function( req, res ){
    res.redirect("http://www.google.com");
});

app.get('/splash', function( req, res ){
    res.render('splash', { "redirect_url": "www.osperi.com" });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404);
  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }
});






};
