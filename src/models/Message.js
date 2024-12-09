const mongoose = require("mongoose");

// Esquema da Mensagem
const MessageSchema = new mongoose.Schema({
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
    enum: [
      "text",
      "image",
      "audio",
      "video",
      "document",
      "location",
      "contact",
    ],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["sent", "received", "read"],
    default: "sent",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Message", MessageSchema);
