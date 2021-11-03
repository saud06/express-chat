/*
 * Title: Login controller
 * Description: Required login controllers for login route
 * Author: Saud
 * Date:
 */

// Dependencies

// App initialization
const loginController = {};

// Get login
loginController.getLogin = (req, res, next) => {
  res.render('index', {
    title: 'Login',
  });
};

// Export
module.exports = loginController;
