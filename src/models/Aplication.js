const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const aplicationSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  admins: {
    type: mongoose.Schema.Types.Array,
    ref: "Admin",
    required: true,
  },
  agents: {
    type: mongoose.Schema.Types.Array,
    ref: "Agent",
    required: true,
  },
  subs: {
    type: mongoose.Schema.Types.Array,
    ref: "Sub",
    required: true,
  },
});

module.exports = mongoose.model("Aplication", aplicationSchema);
