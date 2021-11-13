/*
 * Title: Logged in user handler
 * Description: Checks whetehr a user is logged in or not
 * Author: Saud
 * Date:
 */

// Dependencies
const jwt = require('jsonwebtoken');
const createError = require('http-errors');

// Middleware initialization
const loggedInUserHandler = {};

// Check if the user logged in
loggedInUserHandler.checkAvailability = (req, res, next) => {
  const cookies = Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;

  if (cookies) {
    try {
      const token = cookies['express-app-cookie'];
      const extractedUserData = jwt.verify(token, process.env.JWT_SECRET);

      req.user = extractedUserData;

      if (res.locals.response === 'html') {
        res.locals.loggedInUserData = extractedUserData;
      }

      next();
    } catch (err) {
      if (res.locals.response === 'html') {
        res.redirect('/');
      } else {
        res.status(500).json({
          errors: {
            common: {
              msg: err.message,
            },
          },
        });
      }
    }
  } else {
    const errMsg = true;

    if (res.locals.response === 'html') {
      res.redirect('/');
    } else {
      res.status(400).json({
        errors: 'Authentication failed.',
      });
    }
  }
};

// Check if the user logged in and redeirect
loggedInUserHandler.checkAvailabilityAndRedirect = (req, res, next) => {
  const cookies = Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;

  if (cookies) {
    res.redirect('/inbox');
  } else {
    next();
  }
};

// Check if the user has valid role
loggedInUserHandler.checkRoleValidity = (req, res, next) => {
  if (req.user.role === 'admin') {
    next();
  } else {
    const tempErr = null;

    if (res.locals.response === 'html') {
      next(createError(401, 'Access denied.'));
    } else {
      res.status(401).json({
        errors: {
          common: {
            msg: 'Access denied.',
          },
        },
      });
    }
  }
};

// Export
module.exports = loggedInUserHandler;
