'use-strict';

var response;

response = {

  successResponse: function successResponse(res, data, statusCode) {
    return res.json(statusCode || 200, {
      isError: false,
      success: {
        data: data,
        message: 'Successfully Done!!'
      }
    });
  },

  errorResponse: function errorResponse(res, err, statusCode, message) {
    return res.json(statusCode, {
      isError: true,
      error: {
        data: null,
        message: message || err.message
      }
    });
  }

}

module.exports = response;
