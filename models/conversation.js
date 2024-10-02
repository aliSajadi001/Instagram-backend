let mongoose = require('mongoose');

let Conversation = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    chats: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
    }],
  },
  { timestamps: true }
);

let conversationModel = mongoose.model('Conversation', Conversation);
module.exports = conversationModel;
