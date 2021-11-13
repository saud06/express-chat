/*
 * Title: Attachment upload handler
 * Description: Handles attachment uploads using multer
 * Author: Saud
 * Date:
 */

// Dependencies
const createError = require('http-errors');
const multer = require('multer');
const path = require('path');

// Middleware initialization
const attachmentUplaodHandler = {};

// Attachment upload handler
attachmentUplaodHandler.uploadAttachment = (req, res, next) => {
  // Define upload path
  const uploadPath = `${__dirname}/../public/uploads/attachment/`;

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
      if (req.files.length > 3) {
        callback(createError(400, 'Maximum 3 files are allowed as attachment'));
      } else {
        const tempErr = null;

        if (
          file.mimetype === 'image/jpg' ||
          file.mimetype === 'image/jpeg' ||
          file.mimetype === 'image/png'
        ) {
          callback(null, true);
        } else {
          callback(createError(400, 'Invalid file type. Must be jpg, jpeg or png'));
        }
      }
    },
  });

  // Upload attachment
  upload.any()(req, res, (err) => {
    if (err) {
      res.status(500).json({
        error: {
          attachment: {
            message: err.message,
          },
        },
      });
    } else {
      next();
    }
  });
};

module.exports = attachmentUplaodHandler;
