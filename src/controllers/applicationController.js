const Application = require("../models/Aplication");
const Admin = require("../models/Admin");

const { addMonths } = require("date-fns");

require("dotenv").config();

const getLimitByPlan = (plan) => {
  switch (plan) {
    case "basic":
      return 5;
    case "pro":
      return 10;
    case "enterprise":
      return 20;
    default:
      return 5;
  }
};

const getApplicationById = async (req, res) => {
  const { appId } = req.params;

  try {
    const application = await Application.findById(appId).populate(
      "admins equipes agents subs"
    );

    if (!application) {
      throw new Error("Não foi possivel encontrar esta aplicação!");
    }

    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createApplication = async (req, res) => {
  try {
    console.log(req.body);

    const {
      username,
      password,
      plan,
      token,
      document,
      enterprise,
      phoneNumber,
      planningType,
      status,
      email,
      contract_at = new Date().getTime(),
      expires_in = new Date(),
      admins = [],
      equipes = [],
      agents = [],
      subs = [],
    } = req.body;

    if (
      token !==
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjhkMTFiOTUyLTY5ZGItNGM0Ni05MDAwLWVlODc5N2Q4MDBhYyIsImlhdCI6MTczNDIyNDI5MiwiZXhwIjoxNzM0MjI3ODkyfQ.nhr3B78F8T-ew1UTdb8sPyXSxx90KJbTsZFb4boyfww"
    ) {
      return res.status(401).json({ message: "Token inválido." });
    }

    let updatedExpiresIn = new Date(expires_in);

    switch (planningType) {
      case "mensal":
        updatedExpiresIn = addMonths(updatedExpiresIn, 1);
        break;
      case "trimestral":
        updatedExpiresIn = addMonths(updatedExpiresIn, 3);
        break;
      case "anual":
        updatedExpiresIn = addMonths(updatedExpiresIn, 12);
        break;
      default:
        console.warn(
          "Planning type não reconhecido. Nenhuma modificação em expires_in."
        );
    }

    const updatedExpiresInTimestamp = updatedExpiresIn.getTime();

    // Validação básica
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username e password são obrigatórios." });
    }

    const limitAgents = getLimitByPlan(plan);

    const admin = new Admin({ username, password });
    await admin.save();

    admins.push(admin._id);

    const application = new Application({
      username,
      password,
      admins,
      agents,
      equipes,
      email,
      subs,
      plan,
      limitAgents,
      document,
      enterprise,
      phoneNumber,
      planningType,
      status,
      contract_at,
      expires_in: updatedExpiresInTimestamp,
    });
    await application.save();

    res.status(201).json({
      message: "Aplicação criada com sucesso!",
      application,
      url: `${process.env.CLIENT_URL}/${application._id}`,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erro ao criar a aplicação.", error: error.message });
  }
};

const getAdminsByApplication = async (req, res) => {
  try {
    const { appId } = req.params;
    const application = await Application.findById(appId).populate("admins");

    if (!application) {
      return res.status(404).json({ message: "Aplicação não encontrada." });
    }

    res.json(application.admins);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erro ao buscar admins.", error: error.message });
  }
};

const getAgentsByApplication = async (req, res) => {
  try {
    const { appId } = req.params;
    const application = await Application.findById(appId).populate("agents");

    if (!application) {
      return res.status(404).json({ message: "Aplicação não encontrada." });
    }

    res.json(application.agents);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erro ao buscar agents.", error: error.message });
  }
};

const getSubsByApplication = async (req, res) => {
  try {
    const { appId } = req.params;
    const application = await Application.findById(appId).populate("subs");

    if (!application) {
      return res.status(404).json({ message: "Aplicação não encontrada." });
    }

    res.json(application.subs);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erro ao buscar subs.", error: error.message });
  }
};

const addSubsToApplication = async (req, res) => {
  try {
    const { appId } = req.params;
    const { subId } = req.body;

    const application = await Application.findById(appId);

    if (!application) {
      return res.status(404).json({ message: "Aplicação não encontrada." });
    }

    if (!application.subs.includes(subId)) {
      application.subs.push(subId);
      await application.save();
    }

    res
      .status(200)
      .json({ message: "Sub adicionado com sucesso!", application });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erro ao adicionar sub.", error: error.message });
  }
};

const getEquipesByApplication = async (req, res) => {
  try {
    const { appId } = req.params;

    const application = await Application.findById(appId).populate({
      path: "equipes",
      populate: {
        path: "sub", // Popula o campo 'sub' dentro de cada 'equipe'
        model: "Sub",
      },
    });

    if (!application) {
      return res.status(404).json({ message: "Aplicação não encontrada." });
    }

    res.json(application.equipes);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erro ao buscar equipes.", error: error.message });
  }
};

const addEquipeToApplication = async (req, res) => {
  try {
    const { appId } = req.params;
    const { equipeId } = req.body;

    const application = await Application.findById(appId);

    if (!application) {
      return res.status(404).json({ message: "Aplicação não encontrada." });
    }

    if (!application.equipes.includes(equipeId)) {
      application.equipes.push(equipeId);
      await application.save();
    }

    res
      .status(200)
      .json({ message: "Equipe adicionado com sucesso!", application });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erro ao adicionar Equipe.", error: error.message });
  }
};

const addAdminToApplication = async (req, res) => {
  try {
    const { appId } = req.params;
    const { adminId } = req.body;

    const application = await Application.findById(appId);

    if (!application) {
      return res.status(404).json({ message: "Aplicação não encontrada." });
    }

    if (!application.admins.includes(adminId)) {
      application.admins.push(adminId);
      await application.save();
    }

    res
      .status(200)
      .json({ message: "Admin adicionado com sucesso!", application });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erro ao adicionar admin.", error: error.message });
  }
};

const addAgentToApplication = async (req, res) => {
  try {
    const { appId } = req.params;
    const { agentId } = req.body;

    // Busca a aplicação no banco de dados
    const application = await Application.findById(appId);

    if (!application) {
      return res.status(404).json({ message: "Aplicação não encontrada." });
    }

    // Verifica se o limite de agentes foi atingido
    if (application.agents.length >= application.limitAgents) {
      return res.status(400).json({
        message: "Limite de agentes atingido para o plano atual.",
      });
    }

    // Adiciona o agente se ele ainda não estiver na lista
    if (!application.agents.includes(agentId)) {
      application.agents.push(agentId);
      await application.save();
    }

    res
      .status(200)
      .json({ message: "Agent adicionado com sucesso!", application });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erro ao adicionar agent.", error: error.message });
  }
};

const removeSubsFromApplication = async (req, res) => {
  try {
    const { appId } = req.params;
    const { subId } = req.body;

    const application = await Application.findById(appId);

    if (!application) {
      return res.status(404).json({ message: "Aplicação não encontrada." });
    }

    application.subs = application.subs.filter((id) => id.toString() !== subId);

    await application.save();

    res.status(200).json({ message: "Sub removido com sucesso!", application });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erro ao remover sub.", error: error.message });
  }
};

const removeAdminFromApplication = async (req, res) => {
  try {
    const { appId } = req.params;
    const { adminId } = req.body;

    const application = await Application.findById(appId);

    if (!application) {
      return res.status(404).json({ message: "Aplicação não encontrada." });
    }

    application.admins = application.admins.filter(
      (id) => id.toString() !== adminId
    );

    await application.save();

    res
      .status(200)
      .json({ message: "Admin removido com sucesso!", application });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erro ao remover admin.", error: error.message });
  }
};

const removeAgentFromApplication = async (req, res) => {
  try {
    const { appId } = req.params;
    const { agentId } = req.body;

    const application = await Application.findById(appId);

    if (!application) {
      return res.status(404).json({ message: "Aplicação não encontrada." });
    }

    application.agents = application.agents.filter(
      (id) => id.toString() !== agentId
    );

    await application.save();

    res
      .status(200)
      .json({ message: "Agent removido com sucesso!", application });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erro ao remover agent.", error: error.message });
  }
};

const removeEquipesFromApplication = async (req, res) => {
  try {
    const { appId } = req.params;
    const { equipeId } = req.body;

    const application = await Application.findById(appId);

    if (!application) {
      return res.status(404).json({ message: "Aplicação não encontrada." });
    }

    application.equipes = application.equipes.filter(
      (id) => id.toString() !== equipeId
    );

    await application.save();

    res
      .status(200)
      .json({ message: "Equipe removido com sucesso!", application });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erro ao remover Equipe.", error: error.message });
  }
};

module.exports = {
  createApplication,
  getAdminsByApplication,
  getAgentsByApplication,
  addAdminToApplication,
  addAgentToApplication,
  getSubsByApplication,
  addSubsToApplication,
  removeSubsFromApplication,
  removeAdminFromApplication,
  removeAgentFromApplication,
  removeEquipesFromApplication,
  getEquipesByApplication,
  addEquipeToApplication,
  getApplicationById,
};
