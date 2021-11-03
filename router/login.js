/*
 * Title: Login router
 * Description: Hits here when the client requests for login
 * Author: Saud
 * Date:
 */

// Dependencies
const express = require('express');
const responseType = require('../middlewares/responseTypeHandler');
const loginController = require('../controllers/login');

// Router initialization
const router = express.Router();

// Login
router.get('/', responseType.setResponse, loginController.getLogin);

module.exports = router;
