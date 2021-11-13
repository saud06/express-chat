/*
 * Title: Users controller
 * Description: Required users controllers for users route
 * Author: Saud
 * Date:
 */

// Dependencies
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const User = require('../models/people');

// Controller initialization
const usersController = {};

// Get Users
usersController.getUsers = async (req, res, next) => {
  try {
    const result = await User.find();

    res.render('users', {
      title: 'Users',
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
};

// Add user
usersController.addUser = async (req, res, next) => {
  const hashedPass = await bcrypt.hash(req.body.password, 10);
  let user;

  if (req.files && req.files.length > 0) {
    user = new User({
      ...req.body,
      password: hashedPass,
      role: 'user',
      image: req.files[0].filename,
    });
  } else {
    user = new User({
      ...req.body,
      password: hashedPass,
      role: 'user',
    });
  }

  try {
    const result = await user.save();

    res.status(200).json({
      message: 'User added successfully',
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
};

// Delete user
usersController.deleteUser = async (req, res, next) => {
  try {
    const result = await User.findByIdAndDelete({ _id: req.params.id });

    if (result.image) {
      fs.unlink(path.join(`${__dirname}/../public/uploads/people/${result.image}`), (err) => {
        if (err) {
          console.log(err);
        }
      });
    }

    res.status(200).json({
      status: 200,
      message: 'User deleted successfully.',
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
};

// Export
module.exports = usersController;
