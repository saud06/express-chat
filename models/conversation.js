const mongoose = require('mongoose');

const conversationSchema = mongoose.Schema(
  {
    createdBy: {
      id: mongoose.Types.ObjectId,
      name: String,
      image: String,
    },
    participant: {
      id: mongoose.Types.ObjectId,
      name: String,
      image: String,
    },
    updatedOn: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
