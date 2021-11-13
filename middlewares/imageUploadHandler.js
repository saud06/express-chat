/*
 * Title: Image upload handler
 * Description: Handles image uploads using multer
 * Author: Saud
 * Date:
 */

// Dependencies
const createError = require('http-errors');
const multer = require('multer');
const path = require('path');

// Middleware initialization
const imageUplaodHandler = {};

// Image upload handler
imageUplaodHandler.uplaodImage = (req, res, next) => {
  // Define upload path
  const uploadPath = `${__dirname}/../public/uploads/people/`;

  // Define storage
  const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, uploadPath);
    },
    filename: (req, file, callback) => {
      const fileExt = path.extname(file.originalname);
      let updFileName = file.originalname
        .replace(fileExt, '')
        .toLocaleLowerCase()
        .split(' ')
        .join('_');
      updFileName += Date.now() + fileExt;

      callback(null, updFileName);
    },
  });

  // Define uplaod settings
  const upload = multer({
    storage,
    limits: {
      fileSize: 2000000, // 2 mb
    },
    fileFilter: (req, file, callback) => {
      if (
        file.mimetype === 'image/jpg'
        || file.mimetype === 'image/jpeg'
        || file.mimetype === 'image/png'
      ) {
        callback(null, true);
      } else {
        callback(createError(400, 'Invalid file type. Must be jpg, jpeg or png'));
      }
    },
  });

  // Upload image
  upload.any()(req, res, (err) => {
    if (err) {
      res.status(500).json({
        error: {
          image: {
            message: err.message,
          },
        },
      });
    } else {
      next();
    }
  });
};

module.exports = imageUplaodHandler;
