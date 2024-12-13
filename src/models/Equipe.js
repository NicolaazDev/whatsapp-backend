const mongoose = require("mongoose");

const equipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  sub: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sub",
    required: true,
  },
  agents: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Agent",
    required: false,
  },
});

module.exports = mongoose.model("Equipe", equipeSchema);
