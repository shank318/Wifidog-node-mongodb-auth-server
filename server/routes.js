'use strict';
var sessions = require('client-sessions');
const fileUpload = require('express-fileupload');
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
  // API routes
  app.use('/', require('./api/gateways'));
  app.use('/', require('./api/auth'));
  app.use('/', require('./api/login'));

  app.use(fileUpload());

 
  app.post('/upload', function(req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');
 
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file 
  let sampleFile = req.files.file2;
  // console.log(req.files.file.name);
  console.log(req.files.file2.name);
  // Use the mv() method to place the file somewhere on your server 
  sampleFile.mv('/server/shank.jpg', function(err) {
    if (err)
      return res.status(500).send(err);
 
    res.send('File uploaded!');
  });
});

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
