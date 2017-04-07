'use-strict';

var ErrorResponse = require('./../responses');

var errors ;

errors = {

  errorCustom: function errorCustom(res, err) {
    var error = {
      message: err.message || err,
      name: "ServerError",
      stack: new Error().stack
    };
    console.log("CUSTOM ERROR THROWN", JSON.stringify(error), error);
    return ErrorResponse.errorResponse(res, err, 500, error);
  },

  errorNotAllowed: function errorNotAllowed(res) {
    var errors = {};
    var error = {
      message: "You are not Allowed to make this change.",
      name: "NotAllowedError",
      errors: errors,
      stack: new Error().stack
    };
    return ErrorResponse.errorResponse(res, err, 403, error)
  },

  errorDBAlreadyExist: function errorDBAlreadyExist(res, model) {
    var error = {
      message: model + ' already exist.',
      name: "AlreadyExist",
      stack: new Error().stack
    };
    return ErrorResponse.errorResponse(res, '', 500, error)
  },

errorUserNotVerified: function errorDBAlreadyExist(res, model) {
    var error = {
      message: model,
      name: "Not verified",
      stack: new Error().stack
    };
    return ErrorResponse.errorResponse(res, '', 500, error)
  },
  errorUnauthorized: function errorUnauthorized(res) {
    var errors = {};
    var error = {
      message: "Unauthorized. Please Authenticate.",
      name: "UnauthorizedError",
      errors: errors,
      stack: new Error().stack
    };
    return ErrorResponse.errorResponse(res, '', 401, error)
  },

  errorDBNotFound: function errorDBNotFound(res, field) {
    var errors = {};
    errors[field] = {message: "Not Found."};
    var error = {
      message: field + ' not found.',
      name: "NotFoundError",
      stack: new Error().stack
    };
    return ErrorResponse.errorResponse(res, '', 500, error)
  },

  errorMissingParam: function errorMissingParam(res, field) {
    var errors = {};
    errors[field] = {message: "Missing Param."};
    var error = {
      message: field + ' missing from request.',
      name: "MissingParamError",
      stack: new Error().stack
    };
    return ErrorResponse.errorResponse(res, '', 422, error)
  },

  errorDB: function errorDB(res, err) {
    err['stack'] = new Error().stack;
    var error = {
      message: err.message,
      name: 'SERVER ERROR',
      stack: new Error().stack
    };
    return ErrorResponse.errorResponse(res, err, 500, error)
  },

  errorDBGeneric: function ( res, message ) {
    //err['stack'] = new Error().stack;
    var error = {
      message: message,
      name: "Invalid",
      stack: new Error().stack
    };
    return ErrorResponse.errorResponse(res, '', 422, error)
  },

  errorServer: function errorServer(res, err) {
    var error = {
      message: err.message,
      name: 'SERVER FAILURE',
      stack: new Error().stack
    };
    console.log(err.message);
    return ErrorResponse.errorResponse(res, err, 513, error);
  }
  

};

module.exports = errors;
