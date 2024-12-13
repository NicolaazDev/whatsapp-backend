const Admin = require("../models/Admin");

// Registrar um novo admin
const registerAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Verifica se o usuário já existe
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: "Usuário já existe!" });
    }

    const newAdmin = new Admin({ username, password });
    await newAdmin.save();

    res
      .status(201)
      .json({ message: "Admin registrado com sucesso!", admin: newAdmin });
  } catch (error) {
    res.status(500).json({ message: "Erro ao registrar admin!", error });
  }
};

// Login do admin
const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Verifica se o usuário existe
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(404).json({ message: "Usuário não encontrado!" });
    }

    // Verifica a senha
    const isMatch = await admin.comparePassword(password);

    console.log(isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Senha incorreta!" });
    }

    res.status(200).json({ message: "Login realizado com sucesso!", admin });
  } catch (error) {
    res.status(500).json({ message: "Erro ao realizar login!", error });
  }
};

const toggleAdminDesativated = async (req, res) => {
  try {
    const { adminId } = req.params;

    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({ message: "Admin não encontrado!" });
    }

    admin.desativated = !admin.desativated;
    await admin.save();

    res
      .status(200)
      .json({ message: "Admin status atualizado com sucesso!", admin });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao atualizar status do admin!", error });
  }
};

module.exports = { registerAdmin, loginAdmin, toggleAdminDesativated };
