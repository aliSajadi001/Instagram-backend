const chatModel = require('../models/chat');
const conversationModel = require('../models/conversation');
const { resiverIdOnline, io } = require('../socket/socket');

let CretaeChat = async (req, res) => {
  try {
    let resiverId = req.params.id;
    let senderId = req.id;
    let { text } = req.body;
    ///////////find old conversation//////////////
    let conversation = await conversationModel.findOne({
      participants: { $all: [senderId, resiverId] },
    });
    ///////////create newconversation/////////////
    if (!conversation) {
      conversation = await conversationModel({
        participants: [senderId, resiverId],
      });
    }
    ///////////create newMessage//////////////////
    let message = await chatModel({
      senderId,
      resiverId,
      text,
    });
    ////////////// create message ans save////////
    if (message) conversation.chats.push(message._id);
    await conversation.save();
    await message.save();
    let onlineResiver = resiverIdOnline(resiverId);
    if (onlineResiver) {
      io.to(resiverId).emit('message', message);
    }
    return res.json({ success: true, message });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};
////////////////////get all chats////////////////////
let GetAllChat = async (req, res) => {
  try {
    let resiverId = req.params.id;
    let senderId = req.id;
    let allChats = await conversationModel.findOne({
      participants: { $all: [senderId, resiverId] },
    }).populate("chats")
    if (!allChats) return res.json({ success: false, chat: [] });
    return res.json({ success: true, chat: allChats.chats });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};
module.exports = {
  CretaeChat,
  GetAllChat,
};
