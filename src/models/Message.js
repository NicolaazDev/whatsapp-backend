const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["text", "image", "audio", "video", "document"],
  },
  content: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "sent",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Message", messageSchema);
