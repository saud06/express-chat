/*
 * Title: Error handler
 * Description: Handles all the errors
 * Author: Saud
 * Date:
 */

// Dependencies
const createError = require('http-errors');

// Middleware initialization
const errorHandler = {};

// Not found handler
errorHandler.notFound = (req, res, next) => {
  next(createError(404, 'Not found'));
};

// Default error handler
errorHandler.defaultError = (err, req, res, next) => {
  if (res.locals.response === 'html') {
    res.render('error', {
      title: `${err.status} ${err.message}`,
    });
  } else {
    const status = err.status ? err.status : 500;
    const message = err.message ? err.message : 'Internal server error.';

    res.status(status).json({ status, message });
  }
};

// Export
module.exports = errorHandler;
