/*
 * Title: Users controller
 * Description: Required users controllers for users route
 * Author: Saud
 * Date:
 */

// Dependencies

// Controller initialization
const usersController = {};

// Get Users
usersController.getUsers = (req, res, next) => {
  res.render('users', {
    title: 'Users',
  });
};

// Export
module.exports = usersController;
