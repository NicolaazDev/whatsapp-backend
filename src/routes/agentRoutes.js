const express = require("express");

const {
  loginAgent,
  createAgent,
  getAgentsByIds,
  getAgentById,
  getAgentBackup,
  getMultipleAgentBackups,
} = require("../controllers/agentController");

const router = express.Router();

router.post("/register", createAgent);
router.post("/login", loginAgent);

router.post("/get-agents", getAgentsByIds);

router.get("/:username", getAgentById);

router.get("/:id/backup", getAgentBackup);
router.post("/multiple-backup", getMultipleAgentBackups);

module.exports = router;
