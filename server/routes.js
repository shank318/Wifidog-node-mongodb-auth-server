'use strict';





module.exports = function (app) {

  // API routes
  app.use('/', require('./api/gateways'));
  app.use('/', require('./api/auth'));
  app.use('/', require('./api/login'));




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
