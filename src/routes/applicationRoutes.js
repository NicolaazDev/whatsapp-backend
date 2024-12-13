const express = require("express");
const {
  createApplication,
  addAdminToApplication,
  addAgentToApplication,
  getAdminsByApplication,
  getAgentsByApplication,
  addSubsToApplication,
  getSubsByApplication,
  removeAdminFromApplication,
  removeAgentFromApplication,
  removeSubsFromApplication,
  addEquipeToApplication,
  getEquipesByApplication,
  removeEquipesFromApplication,
  getApplicationById,
} = require("../controllers/applicationController");

const router = express.Router();

router.post("/", createApplication);

router.get("/:appId", getApplicationById);

router.get("/:appId/admins", getAdminsByApplication);
router.get("/:appId/agents", getAgentsByApplication);
router.get("/:appId/subs", getSubsByApplication);
router.get("/:appId/equipes", getEquipesByApplication);

router.post("/:appId/add-admin", addAdminToApplication);
router.post("/:appId/add-agent", addAgentToApplication);
router.post("/:appId/add-sub", addSubsToApplication);
router.post("/:appId/add-equipe", addEquipeToApplication);

router.post("/:appId/admin", removeAdminFromApplication);
router.post("/:appId/agent", removeAgentFromApplication);
router.post("/:appId/sub", removeSubsFromApplication);
router.post("/:appId/equipe", removeEquipesFromApplication);

module.exports = router;
