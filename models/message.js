const mongoose = require('mongoose');

const messageSchema = mongoose.Schema(
  {
    text: {
      type: String,
    },
    attachment: [
      {
        type: String,
      },
    ],
    sender: {
      id: mongoose.Types.ObjectId,
      name: String,
      image: String,
    },
    receiver: {
      id: mongoose.Types.ObjectId,
      name: String,
      image: String,
    },
    datetime: {
      type: Date,
      default: Date.now(),
    },
    conversationId: {
      type: mongoose.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
