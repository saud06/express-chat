/*
 * Title: Inbox router
 * Description: Hits here when the client requests for inbox
 * Author: Saud
 * Date:
 */

// Dependencies
const express = require('express');
const inboxController = require('../controllers/inbox');

// Router initialization
const router = express.Router();

// Login
router.get('/', inboxController.getInbox);

module.exports = router;
