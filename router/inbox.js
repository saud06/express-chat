/*
 * Title: Inbox router
 * Description: Hits here when the client requests for inbox
 * Author: Saud
 * Date:
 */

// Dependencies
const express = require('express');
const inboxController = require('../controllers/inbox');
const responseTypeHandler = require('../middlewares/responseTypeHandler');
const loggedInUserHandler = require('../middlewares/loggedInUserHandler');
const attachmentUploadHandler = require('../middlewares/attachmentUploadHandler');

// Router initialization
const router = express.Router();

// Get inbox
router.all(
  '/',
  responseTypeHandler.setResponse,
  loggedInUserHandler.checkAvailability,
  inboxController.getInbox
);

// Search user for conversation
router.post('/search', loggedInUserHandler.checkAvailability, inboxController.searchUser);

// Add new conversation
router.post(
  '/conversation',
  loggedInUserHandler.checkAvailability,
  inboxController.addConversation
);

// Delete conversation
router.delete(
  '/conversation/:id',
  loggedInUserHandler.checkAvailability,
  inboxController.deleteConversation
);

// Get a user message
router.get('/message/:id', loggedInUserHandler.checkAvailability, inboxController.getUserMessage);

// Send message
router.post(
  '/message',
  loggedInUserHandler.checkAvailability,
  attachmentUploadHandler.uploadAttachment,
  inboxController.sendMessage,
);

module.exports = router;
