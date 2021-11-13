/*
 * Title: Response type handler
 * Description: Handles response types
 * Author: Saud
 * Date:
 */

// Middleware initialization
const responseType = {};

// Not found handler
responseType.setResponse = (req, res, next) => {
  res.locals.response = 'html';
  res.locals.loggedInUserData = {};
  res.locals.data = '';
  res.locals.errors = {};

  next();
};

// Export
module.exports = responseType;
