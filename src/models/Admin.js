const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const adminSchema = new mongoose.Schema({
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
});

adminSchema.methods.comparePassword = function (password) {
  return this.password === password;
};

module.exports = mongoose.model("Admin", adminSchema);
