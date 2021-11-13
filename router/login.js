/*
 * Title: Login router
 * Description: Hits here when the client requests for login
 * Author: Saud
 * Date:
 */

// Dependencies
const express = require('express');
const responseType = require('../middlewares/responseTypeHandler');
const loggedInUserHandler = require('../middlewares/loggedInUserHandler');
const loginController = require('../controllers/login');
const { validation, validationResult } = require('../middlewares/loginValidateHandler');

// Router initialization
const router = express.Router();

// Get login
router.get(
  '/',
  responseType.setResponse,
  loggedInUserHandler.checkAvailabilityAndRedirect,
  loginController.getLogin
);

// Post login
router.post('/', responseType.setResponse, validation, validationResult, loginController.login);

// Logout
router.delete('/', loginController.logout);

module.exports = router;
