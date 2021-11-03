/*
 * Title: Inbox controller
 * Description: Required inbox controllers for inbox route
 * Author: Saud
 * Date:
 */

// Dependencies

// Controller initialization
const inboxController = {};

// Get Inbox
inboxController.getInbox = (req, res, next) => {
  res.render('inbox', {
    title: 'Inbox',
  });
};

// Export
module.exports = inboxController;
