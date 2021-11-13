/*
 * Title: Users router
 * Description: Hits here when the client requests for users
 * Author: Saud
 * Date:
 */

// Dependencies
const express = require('express');
const usersController = require('../controllers/users');
const imageUplaodHandler = require('../middlewares/imageUploadHandler');
const { validation, validationResult } = require('../middlewares/userValidateHandler');
const responseTypeHandler = require('../middlewares/responseTypeHandler');
const loggedInUserHandler = require('../middlewares/loggedInUserHandler');

// Router initialization
const router = express.Router();

// Get users
router.get(
  '/',
  responseTypeHandler.setResponse,
  loggedInUserHandler.checkAvailability,
  loggedInUserHandler.checkRoleValidity,
  usersController.getUsers
);

// Post users
router.post(
  '/',
  loggedInUserHandler.checkAvailability,
  imageUplaodHandler.uplaodImage,
  validation,
  validationResult,
  usersController.addUser
);

// Delete user
router.delete('/:id', usersController.deleteUser);

module.exports = router;
