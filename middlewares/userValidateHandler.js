/*
 * Title: User validate handler
 * Description: Handles proper validation of user data
 * Author: Saud
 * Date:
 */

// Dependencies
const expressValidator = require('express-validator');
const createError = require('http-errors');
const path = require('path');
const fs = require('fs');
const People = require('../models/people');

// Validation
const validation = [
  expressValidator
    .check('name')
    .isLength({ min: 1 })
    .withMessage('Name is required.')
    .isAlpha('en-US', { ignore: ' -' })
    .withMessage('Name can contain alphabets only.')
    .trim(),
  expressValidator
    .check('email')
    .isLength({ min: 1 })
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Invalid email address')
    .trim()
    .custom(async (value) => {
      try {
        const email = await People.find({ email: value });

        if (email.length > 0) {
          throw createError(400, 'Email already exists.');
        }
      } catch (err) {
        throw createError(err.message);
      }
    }),
  expressValidator
    .check('mobile')
    .isLength({ min: 1 })
    .withMessage('Mobile is required.')
    .isMobilePhone('bn-BD', { strictMode: true })
    .withMessage('Mobile no. can be Bangladeshi only.')
    .custom(async (value) => {
      try {
        const mobile = People.find({ mobile: value });

        if (mobile.length > 0) {
          throw createError(400, 'Mobile already exists.');
        }
      } catch (err) {
        throw createError(err.message);
      }
    }),
  expressValidator
    .check('password')
    .isLength({ min: 1 })
    .withMessage('Password is required.')
    .isStrongPassword()
    .withMessage(
      'Password can contain at least 8 characters, 1 lowercase, 1 uppercase, 1 number & 1 symbol.'
    ),
];

// Validation result
const validationResult = (req, res, next) => {
  const err = expressValidator.validationResult(req);
  const mappedErr = err.mapped();

  if (Object.keys(mappedErr).length === 0) {
    next();
  } else {
    // remove uploaded image
    if (req.files.length > 0) {
      fs.unlink(
        path.join(__dirname, `/../public/uploads/avatars/${req.files[0].filename}`),
        (err2) => {
          if (err2) {
            console.log(err2);
          }
        },
      );
    }

    res.status(500).json({
      errors: mappedErr,
    });
  }
};

// Export
module.exports = {
  validation,
  validationResult,
};
