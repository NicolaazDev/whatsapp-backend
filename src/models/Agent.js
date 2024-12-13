const mongoose = require("mongoose");
const Message = require("./Message");

const AgentSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  desativated: { type: Boolean, default: false, required: false },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  urlConnection: {
    type: String,
    required: true,
  },
  qrCode: {
    type: String,
    required: true,
  },
  phoneNumbers: { type: [String] },
  name: { type: String },
  pushName: { type: String },
  connectedAt: { type: Date, default: Date.now },

  messages: [Message.schema],
});

AgentSchema.methods.comparePassword = function (password) {
  return this.password === password;
};

module.exports = mongoose.model("Agent", AgentSchema);
