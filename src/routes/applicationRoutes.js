const express = require("express");
const {
  createApplication,
  addAdminToApplication,
  addAgentToApplication,
  getAdminsByApplication,
  getAgentsByApplication,
  addSubsToApplication,
  getSubsByApplication,
} = require("../controllers/applicationController");

const router = express.Router();

router.post("/", createApplication);
router.get("/:appId/admins", getAdminsByApplication);
router.get("/:appId/agents", getAgentsByApplication);
router.post("/:appId/add-admin", addAdminToApplication);
router.post("/:appId/add-agent", addAgentToApplication);
router.get("/:appId/subs", getSubsByApplication);
router.post("/:appId/add-sub", addSubsToApplication);

module.exports = router;
