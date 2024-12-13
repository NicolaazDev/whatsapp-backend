const express = require("express");

const {
  loginAgent,
  createAgent,
  getAgentsByIds,
  getAgentById,
  getAgentBackup,
  getMultipleAgentBackups,
  toggleAgentDesativated,
  addPhoneNumber,
  getAgentID,
} = require("../controllers/agentController");

const router = express.Router();

router.post("/register", createAgent);
router.post("/login", loginAgent);

router.post("/add-phone-number", addPhoneNumber);

router.post("/get-agents", getAgentsByIds);

router.get("/:username", getAgentById);
router.get("/id/:id", getAgentID);

router.get("/:id/backup", getAgentBackup);
router.post("/multiple-backup", getMultipleAgentBackups);

router.post("/toggle/:agentId", toggleAgentDesativated);

module.exports = router;
