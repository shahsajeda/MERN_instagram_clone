const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  room: String,
  username: String,
  message: String,
  time: String,
}, {
  timestamps: true
});

module.exports = mongoose.model('Chat', chatSchema); // chat_details collection
