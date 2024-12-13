const express = require("express");
const router = express.Router();
const {
  createEquipe,
  getEquipesBySub,
  getEquipeById,
  addAgentToEquipe,
  removeAgentFromEquipe,
  deleteEquipe,
  getEquipes,
  getAgentsBySub,
} = require("../controllers/equipeController");

// Criar uma nova equipe
router.post("/", createEquipe);

// Listar equipes de um sub específico
router.get("/sub/:subId", getEquipesBySub);

router.get("/sub-agents/:subId", getAgentsBySub);

// Buscar uma equipe específica
router.get("/:equipeId", getEquipeById);

// Adicionar agente a uma equipe
router.put("/:equipeId/agent", addAgentToEquipe);

// Remover agente de uma equipe
router.delete("/:equipeId/agent/:agentId", removeAgentFromEquipe);

// Remover uma equipe
router.delete("/:equipeId", deleteEquipe);

// Listar todas as equipes
router.get("/", getEquipes);

module.exports = router;
