/*
 * Title: Inbox controller
 * Description: Required inbox controllers for inbox route
 * Author: Saud
 * Date:
 */

// Dependencies
const createError = require('http-errors');
const User = require('../models/people');
const Message = require('../models/message');
const Conversation = require('../models/conversation');

// Controller initialization
const inboxController = {};

// Get Inbox
inboxController.getInbox = async (req, res, next) => {
  try {
    let result;

    if (req.body.participantId) {
      result = await Conversation.find({ 'participant.id': req.body.participantId });
    } else {
      result = await Conversation.find({
        $or: [{ 'createdBy.id': req.user.userId }, { 'participant.id': req.user.userId }],
      });
    }

    res.locals.data = result;

    res.render('inbox', {
      title: 'Inbox',
    });
  } catch (err) {
    next(err);
  }
};

// Search user
inboxController.searchUser = async (req, res, next) => {
  const modifiedSearchStr = req.body.user.replace('+88', '');

  const nameSearchStr = new RegExp(modifiedSearchStr.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
  const mobileSearchStr = new RegExp(
    `^${`+88${modifiedSearchStr}`.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}`
  );
  const emailSearchStr = new RegExp(
    `^${modifiedSearchStr.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}$`,
    'i'
  );

  try {
    if (modifiedSearchStr !== '') {
      let result;

      if (req.body.searchType === 1) {
        result = await Conversation.find({ 'participant.name': nameSearchStr });

        res.json(result);
      } else {
        result = await User.find(
          {
            $or: [{ name: nameSearchStr }, { mobile: mobileSearchStr }, { email: emailSearchStr }],
          },
          'name image'
        );

        res.json(result);
      }
    } else {
      throw createError(400, 'You must provide some text to search!');
    }
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

// add conversation
inboxController.addConversation = async (req, res, next) => {
  try {
    const conversation = new Conversation({
      createdBy: {
        id: req.user.userId,
        name: req.user.username,
        image: req.user.image || null,
      },
      participant: {
        name: req.body.participant,
        id: req.body.id,
        image: req.body.image || null,
      },
    });

    const result = await Conversation.find({ 'participant.id': req.body.id });

    if (result && result.length === 0) {
      const result2 = await conversation.save();

      res.status(200).json({
        message: 'Conversation added successfully!',
      });
    } else {
      res.status(200).json({
        message: 'Already available!',
      });
    }
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

// Delete conversation
inboxController.deleteConversation = async (req, res, next) => {
  try {
    const result = await Conversation.findByIdAndDelete({ _id: req.params.id });

    res.status(200).json({
      status: 200,
      message: `Conversation with ${result.participant.name} deleted successfully.`,
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

// Get user message
inboxController.getUserMessage = async (req, res, next) => {
  try {
    const result = await Message.find({ conversationId: req.params.id }).sort('-createdAt');

    const { participant } = await Conversation.findById(req.params.id);

    res.status(200).json({
      data: {
        message: result,
        participant,
      },
      user: req.user.userId,
      id: req.params.id,
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

// Send message
inboxController.sendMessage = async (req, res, next) => {
  if (req.body.message || (req.files && req.files.length > 0)) {
    try {
      const attachment = [];

      if (req.files && req.files.length > 0) {
        req.files.forEach((file) => {
          attachment.push(file.filename);
        });
      }

      const message = new Message({
        text: req.body.message,
        attachment,
        sender: {
          id: req.user.userId,
          name: req.user.username,
          image: req.user.image ? req.user.image : null,
        },
        receiver: {
          id: req.body.receiverId,
          name: req.body.receiverName,
          image: req.body.image ? req.user.image : null,
        },
        conversationId: req.body.conversationId,
      });

      const result = await message.save();

      // Socket event
      global.io.emit('message', {
        message: {
          text: req.body.message,
          attachment,
          sender: {
            id: req.user.userId,
            name: req.user.username,
            image: req.user.image ? req.user.image : null,
          },
          conversationId: req.body.conversationId,
          datetime: result.datetime,
        },
      });

      res.status(200).json({
        message: 'Message sent!',
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
  } else {
    res.status(500).json({
      errors: {
        common: {
          msg: 'Message is required to be sent!',
        },
      },
    });
  }
};

// Export
module.exports = inboxController;
