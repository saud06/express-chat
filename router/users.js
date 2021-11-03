/*
 * Title: Users router
 * Description: Hits here when the client requests for users
 * Author: Saud
 * Date:
 */

// Dependencies
const express = require('express');
const usersController = require('../controllers/users');

// Router initialization
const router = express.Router();

// Users
router.get('/', usersController.getUsers);

module.exports = router;
