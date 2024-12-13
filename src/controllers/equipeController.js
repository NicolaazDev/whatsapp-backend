const Equipe = require("../models/Equipe");

// Criar uma nova equipe
const createEquipe = async (req, res) => {
  try {
    const { sub, agents = [], name, description } = req.body;

    if (!sub || !agents) {
      return res.status(400).json({ error: "Sub e agents são obrigatórios" });
    }

    const novaEquipe = await Equipe.create({ sub, agents, name, description });
    res
      .status(201)
      .json({ message: "Equipe criada com sucesso", equipe: novaEquipe });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao criar equipe", details: error.message });
  }
};

// Buscar equipes de um sub específico
const getEquipesBySub = async (req, res) => {
  try {
    const { subId } = req.params;

    const equipes = await Equipe.find({ sub: subId }).populate("sub agents");
    res.status(200).json({ equipes });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao buscar equipes do sub", details: error.message });
  }
};

const getAgentsBySub = async (req, res) => {
  try {
    const { subId } = req.params;

    // Buscar todas as equipes do sub específico
    const equipes = await Equipe.find({ sub: subId }).populate("agents");

    // Extrair todos os agentes das equipes
    const allAgents = equipes.reduce((agents, equipe) => {
      return agents.concat(equipe.agents);
    }, []);

    res.status(200).json({ agents: allAgents });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao buscar agentes do sub", details: error.message });
  }
};

// Buscar uma equipe específica por ID
const getEquipeById = async (req, res) => {
  try {
    const { equipeId } = req.params;

    const equipe = await Equipe.findById(equipeId).populate("sub agents");
    if (!equipe) {
      return res.status(404).json({ error: "Equipe não encontrada" });
    }

    res.status(200).json({ equipe });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao buscar equipe", details: error.message });
  }
};

// Adicionar agente a uma equipe
const addAgentToEquipe = async (req, res) => {
  try {
    const { equipeId } = req.params;
    const { agentId } = req.body;

    const equipe = await Equipe.findById(equipeId);
    if (!equipe) {
      return res.status(404).json({ error: "Equipe não encontrada" });
    }

    // Evitar duplicação de agentes
    if (equipe.agents.includes(agentId)) {
      return res.status(400).json({ error: "Agente já está na equipe" });
    }

    equipe.agents.push(agentId);
    await equipe.save();

    res.status(200).json({ message: "Agente adicionado com sucesso", equipe });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao adicionar agente", details: error.message });
  }
};

// Remover agente de uma equipe
const removeAgentFromEquipe = async (req, res) => {
  try {
    const { equipeId, agentId } = req.params;

    const equipe = await Equipe.findById(equipeId);
    if (!equipe) {
      return res.status(404).json({ error: "Equipe não encontrada" });
    }

    equipe.agents = equipe.agents.filter((id) => id.toString() !== agentId);
    await equipe.save();

    res.status(200).json({ message: "Agente removido com sucesso", equipe });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao remover agente", details: error.message });
  }
};

// Remover uma equipe
const deleteEquipe = async (req, res) => {
  try {
    const { equipeId } = req.params;

    const equipe = await Equipe.findByIdAndDelete(equipeId);
    if (!equipe) {
      return res.status(404).json({ error: "Equipe não encontrada" });
    }

    res.status(200).json({ message: "Equipe removida com sucesso" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao remover equipe", details: error.message });
  }
};

// Listar todas as equipes
const getEquipes = async (req, res) => {
  try {
    const equipes = await Equipe.find().populate("sub agents");
    res.status(200).json({ equipes });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao buscar equipes", details: error.message });
  }
};

// Exportar funções
module.exports = {
  createEquipe,
  getEquipesBySub,
  getEquipeById,
  addAgentToEquipe,
  removeAgentFromEquipe,
  deleteEquipe,
  getEquipes,
  getAgentsBySub,
};
