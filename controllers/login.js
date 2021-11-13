/*
 * Title: Login controller
 * Description: Required login controllers for login route
 * Author: Saud
 * Date:
 */

// Dependencies
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const User = require('../models/people');

// App initialization
const loginController = {};

// Get login
loginController.getLogin = (req, res, next) => {
  res.render('index', {
    title: 'Login',
  });
};

// Process login
loginController.login = async (req, res, next) => {
  try {
    // Get user data
    const result = await User.findOne({
      $or: [{ email: req.body.username }, { mobile: req.body.username }],
    });

    if (result) {
      // Check password validity
      const passValidity = await bcrypt.compare(req.body.password, result.password);

      if (passValidity) {
        // Generate token
        const userData = {
          userId: result._id,
          username: result.name,
          mobile: result.mobile,
          email: result.email,
          role: result.role,
        };

        const token = jwt.sign(userData, process.env.JWT_SECRET, {
          expiresIn: 3600000, // 1 hour
        });

        // Set cookie
        const cookie = res.cookie('express-app-cookie', token, {
          maxAge: 3600000, // 1 hour
          httpOnly: true,
          signed: true,
        });

        // Set local Data
        res.locals.loggedInUserData = userData;

        res.redirect('inbox');
      } else {
        throw createError(400, 'Incorrect password.');
      }
    } else {
      throw createError(400, 'User not found.');
    }
  } catch (err) {
    res.render('index', {
      title: null,
      data: req.body.username,
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
};

// Process logout
loginController.logout = async (req, res, next) => {
  res.clearCookie('express-app-cookie');
  res.send('Logged out.');
};

// Export
module.exports = loginController;
