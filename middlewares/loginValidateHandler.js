/*
 * Title: Login validate handler
 * Description: Handles proper validation of login data
 * Author: Saud
 * Date:
 */

// Dependencies
const expressValidator = require('express-validator');

// Validation
const validation = [
  expressValidator
    .check('username')
    .isLength({ min: 1 })
    .withMessage('Mobile or Email is required.'),
  expressValidator.check('password').isLength({ min: 1 }).withMessage('Password is required.'),
];

// Validation result
const validationResult = (req, res, next) => {
  const err = expressValidator.validationResult(req);
  const mappedErr = err.mapped();

  if (Object.keys(mappedErr).length === 0) {
    next();
  } else {
    res.render('index', {
      title: null,
      data: req.body.username,
      errors: mappedErr,
    });
  }
};

// Export
module.exports = {
  validation,
  validationResult,
};
