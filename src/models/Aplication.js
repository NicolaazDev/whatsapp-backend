const mongoose = require("mongoose");

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
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  plan: {
    type: String,
    required: true,
  },
  limitAgents: {
    type: Number,
    required: true,
  },
  admins: {
    type: mongoose.Schema.Types.Array,
    ref: "Admin",
    required: true,
  },
  equipes: {
    type: mongoose.Schema.Types.Array,
    ref: "Equipe",
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
  document: {
    type: String,
    required: true,
  },
  enterprise: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  planningType: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  contract_at: {
    type: String,
    required: true,
  },
  expires_in: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Aplication", aplicationSchema);
