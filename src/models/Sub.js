const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const subSchema = new mongoose.Schema({
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
});

subSchema.methods.comparePassword = function (password) {
  return this.password === password;
};
module.exports = mongoose.model("Sub", subSchema);
