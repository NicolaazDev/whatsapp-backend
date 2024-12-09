const Application = require("../models/Aplication");
const Admin = require("../models/Admin");

require("dotenv").config();

const createApplication = async (req, res) => {
  try {
    console.log(req.body);

    const {
      username,
      password,
      admins = [],
      agents = [],
      subs = [],
    } = req.body;

    // Validação básica
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username e password são obrigatórios." });
    }

    const admin = new Admin({ username, password });
    await admin.save();

    admins.push(admin._id);

    const application = new Application({
      username,
      password,
      admins,
      agents,
      subs,
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

    const application = await Application.findById(appId);

    if (!application) {
      return res.status(404).json({ message: "Aplicação não encontrada." });
    }

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

module.exports = {
  createApplication,
  getAdminsByApplication,
  getAgentsByApplication,
  addAdminToApplication,
  addAgentToApplication,
  getSubsByApplication,
  addSubsToApplication,
};
